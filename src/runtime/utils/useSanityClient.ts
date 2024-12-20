import type { ModuleOptions } from '@devite/nuxt-sanity'
import type SanityClient from '../client/SanityClient'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import getOrCreateSanityClient from './getOrCreateSanityClient'
import { useRuntimeConfig } from '#imports'

export default function useSanityClient(type?: 'minimal' | 'default'): SanityClient {
  const $config = useRuntimeConfig()
  const sanityConfig = $config.public.sanity as ModuleOptions

  return getOrCreateSanityClient(useSanityVisualEditingState().enabled, sanityConfig, type)
}
