import defu from 'defu'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import type { ClientConfig } from '@sanity/client'
import type SanityClient from '../../client/SanityClient'
import type { SanityClientType } from '../../utils/getOrCreateSanityClient'
import getOrCreateSanityClient from '../../utils/getOrCreateSanityClient'
import { useRuntimeConfig } from '#imports'

export default function useSanityClient(type?: SanityClientType): SanityClient {
  const $config = useRuntimeConfig()
  const sanityConfig = (
    import.meta.client ? $config.public.sanity : defu($config.sanity, $config.public.sanity || {})
  ) as ClientConfig & ModuleOptions

  const visualEditingEnabled
    = (sanityConfig.visualEditing && !sanityConfig.visualEditing.previewMode) || false

  return getOrCreateSanityClient(visualEditingEnabled, sanityConfig, type)
}
