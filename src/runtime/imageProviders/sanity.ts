import sanity from '@nuxt/image/runtime/providers/sanity'
import type { ImageCTX, ImageOptions, ResolvedImage } from '@nuxt/image'
import { defineProvider } from '@nuxt/image/runtime'

export default defineProvider({
  getImage(src: string,
    { modifiers = {}, projectId, dataset, cacheEndpoint }: ImageOptions, context: ImageCTX): ResolvedImage {
    modifiers.format = modifiers.format === 'svg+xml' ? undefined : modifiers.format

    if (cacheEndpoint) {
      const params = new URLSearchParams()
      params.set('src', src)

      if (modifiers.format || !src.endsWith('-svg'))
        params.set('modifiers', JSON.stringify(modifiers))

      return { url: cacheEndpoint + `?${params.toString()}` }
    }

    return sanity().getImage(src, { modifiers, projectId, dataset }, context)
  },
})
