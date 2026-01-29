import { useRuntimeConfig } from '#imports'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import type { ClientPerspective } from '@sanity/client'
import { createError, defineEventHandler, getQuery, getRequestURL, readBody, setResponseHeader } from 'h3'
import { useStorage } from 'nitropack/runtime/internal/storage'
import { hash } from 'ohash'
import useSanityClient from '../../utils/useSanityClient'

const TTL = 60 * 60 * 8 // 8 hours

export default defineEventHandler(async (event) => {
  let query, params

  switch (event.method) {
    case 'GET': {
      const queryParams = getRequestURL(event).searchParams
      query = queryParams.get('query')
      params = Object.fromEntries(Array.from(queryParams).filter(([key]) => key.startsWith('$')).map(([key, value]) => [key.slice(1), JSON.parse(value)]))

      if (!query)
        throw createError({ statusCode: 400, statusMessage: 'Missing query parameter "query"' })

      break
    }
    case 'POST': {
      const body = await readBody(event)
      query = body.query
      params = body.params || {}

      if (!query)
        throw createError({ statusCode: 400, statusMessage: 'Missing field "query"' })

      break
    }
    default:
      throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const perspective = getQuery(event).perspective || ((useRuntimeConfig().public.sanity as ModuleOptions).perspective as ClientPerspective | undefined)

  if (typeof perspective === 'string' && !['drafts', 'preview-drafts', 'published', 'raw'].includes(perspective))
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

  // prevent recursive calls
  delete client.config.minimalClient

  // prevent caching of outdated data
  client.config.useCdn = false

  const result = await client.fetch<object>(
    query,
    params,
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

      sanityDocumentDeps.getItem(id).then((deps: string[] | null) => {
        let documentDeps = deps

        if (!documentDeps || !Array.isArray(documentDeps)) {
          documentDeps = []
        }

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
