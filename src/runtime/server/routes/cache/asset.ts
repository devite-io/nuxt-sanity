import { createError, defineEventHandler, getRequestURL } from 'h3'
import { hash } from 'ohash'
import resolveSanityImageUrl from '../../utils/resolveSanityImageUrl'
import { useStorage } from '#imports'

const TTL = 60 * 60 * 24 * 365 // 1 year

export default defineEventHandler(async (event) => {
  const queryParams = getRequestURL(event).searchParams
  const src = queryParams.get('src')

  if (!src) {
    throw createError({ statusCode: 400, statusMessage: 'Missing src parameter' })
  }

  const modifiers = JSON.parse(queryParams.get('modifiers') || '{}')

  const hashedPath = hash(src + JSON.stringify(modifiers))

  const dataCache = useStorage('sanityData')
  const cachedAsset = await dataCache.getItemRaw<ArrayBuffer>(hashedPath)

  if (cachedAsset) {
    const meta = await dataCache.getMeta(hashedPath)

    if (import.meta.dev) {
      console.debug(`Cache hit for asset ${hashedPath}`)
    }

    return new Response(cachedAsset, {
      headers: {
        'Content-Type': meta.contentType as string || 'application/octet-stream',
        'Cache-Control': `public, max-age=${TTL}, immutable`,
      },
    })
  }

  const imageUrl = resolveSanityImageUrl(src, modifiers)

  return await new Promise((resolve, reject) => $fetch(imageUrl, {
    headers: {
      'Accept-Encoding': 'gzip, deflate',
    },
    method: 'GET',
    responseType: 'stream',
    onResponseError: ({ response }) => reject(response),
    async onResponse({ response }) {
      if (response.status === 200) {
        const assetBinaryData = Buffer.from(await response.arrayBuffer())

        await dataCache.setItemRaw(hashedPath, assetBinaryData, { ttl: TTL })
        await dataCache.setMeta(hashedPath, { contentType: response.headers.get('Content-Type') }, { ttl: TTL })

        const assetId = src.split('/').pop()

        if (assetId) {
          const sanityDocumentDeps = useStorage('sanityDocumentDeps')
          const documentDeps = (await sanityDocumentDeps.getItem(assetId)) as string[] || []
          documentDeps.push(hashedPath)

          await sanityDocumentDeps.setItem(assetId, documentDeps)

          if (import.meta.dev) {
            console.debug(`Cache miss for asset ${hashedPath} (${assetId})`)
          }
        }

        resolve(new Response(assetBinaryData, {
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
            'Cache-Control': `public, max-age=${TTL}, immutable`,
          },
        }))
      }
    },
  }))
})
