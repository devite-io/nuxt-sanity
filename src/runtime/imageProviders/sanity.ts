import { joinURL } from 'ufo'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import type { ProviderGetImage } from '@nuxt/image'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { useRuntimeConfig } from '#imports'
import { getImage as getSanityImage } from '#image/providers/sanity'

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {} } = {},
  ctx,
): { url: string } => {
  const sanityConfig = useRuntimeConfig().public.sanity as ModuleOptions
  const minimalClientConfig = sanityConfig.minimalClient
  const useCaching = typeof minimalClientConfig === 'object' && minimalClientConfig.cachingEnabled

  if (useCaching && minimalClientConfig.cacheBaseUrl && !useSanityVisualEditingState().enabled) {
    const params = new URLSearchParams()
    params.set('src', src)
    params.set('modifiers', JSON.stringify(modifiers))

    return { url: joinURL(minimalClientConfig.cacheBaseUrl, minimalClientConfig.assetEndpoint + `?${params.toString()}`) }
  }

  return getSanityImage(src, { modifiers, projectId: sanityConfig.projectId, dataset: sanityConfig.dataset }, ctx)
}
