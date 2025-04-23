import type { ImageCTX, ImageOptions, ResolvedImage } from '@nuxt/image'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { getImage as getSanityImage } from '#image/providers/sanity'

export function getImage(src: string,
  { modifiers = {}, projectId, dataset, cacheEndpoint }: ImageOptions, context: ImageCTX): ResolvedImage {
  if (cacheEndpoint && !(import.meta.client && useSanityVisualEditingState().enabled)) {
    const params = new URLSearchParams()
    params.set('src', src)
    params.set('modifiers', JSON.stringify(modifiers))

    return { url: cacheEndpoint + `?${params.toString()}` }
  }

  return getSanityImage(src, { modifiers: {
    ...modifiers,
    format: modifiers.format === 'svg+xml' ? 'auto' : modifiers.format,
  }, projectId, dataset }, context)
}
