import type { ImageCTX, ImageOptions, ResolvedImage } from '@nuxt/image'
import { useSanityVisualEditingState } from '../composables/visual_editing_state'
import { getImage as getSanityImage } from '#image/providers/sanity'

export function getImage(src: string,
  { modifiers = {}, projectId, dataset, cacheEndpoint }: ImageOptions, context: ImageCTX): ResolvedImage {
  modifiers.format = modifiers.format === 'svg+xml' ? undefined : modifiers.format

  if (cacheEndpoint && !(import.meta.client && useSanityVisualEditingState().enabled)) {
    const params = new URLSearchParams()
    params.set('src', src)

    if (modifiers.format || !src.endsWith('-svg'))
      params.set('modifiers', JSON.stringify(modifiers))

    return { url: cacheEndpoint + `?${params.toString()}` }
  }

  return getSanityImage(src, { modifiers, projectId, dataset }, context)
}
