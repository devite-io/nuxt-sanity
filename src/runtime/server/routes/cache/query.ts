import {
  createError,
  defineEventHandler,
  getRequestURL,
  setResponseHeader,
} from 'h3'
import type { ClientPerspective } from '@sanity/client'
import { hash } from 'ohash'
import useSanityClient from '../../utils/useSanityClient'
import { useRuntimeConfig, useStorage } from '#imports'

const TTL = 60 * 60 * 8 // 8 hours

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const queryParams = url.searchParams

  const query = queryParams.get('query')

  if (!query)
    throw createError({ statusCode: 400, statusMessage: 'Missing query parameter' })

  const params = Array.from(queryParams).filter(([key]) => key.startsWith('$'))
  const perspective = queryParams.get('perspective')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    || ((useRuntimeConfig().public.sanity as any).perspective as ClientPerspective | undefined)

  if (typeof perspective === 'string' && !['previewDrafts', 'published', 'raw'].includes(perspective))
    throw createError({ statusCode: 400, statusMessage: 'Invalid perspective' })

  const hashedQuery = hash(query + JSON.stringify(params) + (perspective || ''))

  const dataCache = useStorage('sanityData')
  const cachedResult = await dataCache.getItem(hashedQuery)

  if (cachedResult) {
    setResponseHeader(event, 'X-Cache', 'hit')
    setResponseHeader(event, 'Content-Type', 'application/json')

    if (import.meta.dev) {
      console.debug(`Cache hit for query ${hashedQuery}`)
    }

    return { result: cachedResult }
  }

  const client = useSanityClient('minimal')

  // Prevent recursive calls
  delete client.config.minimalClient

  // prevent caching of outdated data
  client.config.useCdn = false

  const result = await client.fetch<object>(
    query,
    Object.fromEntries(params.map(([key, value]) => [key.slice(1), JSON.parse(value)])),
    { perspective: perspective as ClientPerspective | undefined },
  )

  if (!result)
    throw createError({ statusCode: 404, statusMessage: 'No results' })

  setResponseHeader(event, 'Content-Type', 'application/json')

  if (Object.keys(result).length === 0)
    return {}

  await dataCache.setItem(hashedQuery, result, { ttl: TTL })

  // resolve document ids
  const stringifiedResult = JSON.stringify(result)
  const referencedIds = stringifiedResult.match(/"(_ref|_id)":\s*"(.*?)"/g) || []

  if (referencedIds.length > 0) {
    const sanityDocumentDeps = useStorage('sanityDocumentDeps')

    await Promise.all(referencedIds.map((ref) => new Promise((resolve) => {
      const id = ref.split('"')[3]

      sanityDocumentDeps.getItem(id).then((deps) => {
        const documentDeps = deps as string[] || []
        documentDeps.push(hashedQuery)

        sanityDocumentDeps.setItem(id, documentDeps).then(resolve)
      })
    })))
  }

  if (import.meta.dev) {
    console.debug(`Cache miss for query ${hashedQuery} (${referencedIds.join(', ')})`)
  }

  return { result }
})
