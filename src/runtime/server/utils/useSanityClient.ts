import defu from 'defu'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import type SanityClient from '../../client/SanityClient'
import type { SanityClientType } from '../../utils/getOrCreateSanityClient'
import getOrCreateSanityClient from '../../utils/getOrCreateSanityClient'
import { useRuntimeConfig } from '#imports'

export default function useSanityClient(type?: SanityClientType): SanityClient {
  const $config = useRuntimeConfig()
  const sanityConfig = defu($config.sanity, $config.public.sanity || {}) as ModuleOptions
  const visualEditingEnabled = sanityConfig.visualEditing && sanityConfig.visualEditing.previewMode !== false

  return getOrCreateSanityClient(
    visualEditingEnabled || false,
    visualEditingEnabled
      ? {
          ...sanityConfig,
          token: sanityConfig.visualEditing?.token,
          useCdn: false,
        }
      : sanityConfig,
    type)
}
