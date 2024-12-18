import defu from 'defu'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import type { ClientConfig } from '@sanity/client'
import type SanityClient from '../client/SanityClient'
import DefaultSanityClient from '../client/DefaultSanityClient'
import MinimalSanityClient from '../client/MinimalSanityClient'
import { useSanityVisualEditingState } from '../composables/useSanityVisualEditingState'
import { useRuntimeConfig } from '#imports'

const clients: Record<string, SanityClient> = {}

export default function useSanityClient(type?: 'minimal' | 'default'): SanityClient {
  const $config = useRuntimeConfig()
  const sanityConfig = (
    import.meta.client ? $config.public.sanity : defu($config.sanity, $config.public.sanity || {})
  ) as ClientConfig & ModuleOptions

  const visualEditingEnabled
    = sanityConfig.visualEditing
    && !sanityConfig.visualEditing.previewMode
    && useSanityVisualEditingState().enabled
  const clientType = visualEditingEnabled
    ? 'default'
    : type || (sanityConfig.minimalClient ? 'minimal' : 'default')

  if (clientType in clients) return clients[clientType]

  const clientConfig = {
    ...sanityConfig,
    stega: visualEditingEnabled && sanityConfig.stega,
  }

  const client
    = clientType === 'minimal' ? new MinimalSanityClient(clientConfig) : new DefaultSanityClient(clientConfig)

  if (visualEditingEnabled) (client as DefaultSanityClient).createQueryStore()

  clients[clientType] = client

  return client
}
