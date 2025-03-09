import defu from 'defu'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import MinimalSanityClient from '../../client/MinimalSanityClient'
import DefaultSanityClient from '../../client/DefaultSanityClient'
import type { SanityClient, SanityClientType } from '#imports'
import { useRuntimeConfig } from '#imports'

type ReusableClientType = SanityClientType | 'default-visual-editing'

const clients = {} as Record<ReusableClientType, SanityClient>

export default function useSanityClient(type?: SanityClientType, config?: ModuleOptions): SanityClient {
  const sanityConfig = config || defu(useRuntimeConfig().sanity, useRuntimeConfig().public.sanity || {}) as ModuleOptions
  const visualEditingEnabled = type !== 'minimal' && sanityConfig.visualEditing && sanityConfig.visualEditing.previewMode !== false

  const clientType = ((type || (sanityConfig.minimalClient ? 'minimal' : 'default')) + (visualEditingEnabled ? '-visual-editing' : '')) as ReusableClientType

  if (clientType in clients) return clients[clientType]

  const clientConfig = visualEditingEnabled
    ? {
        ...sanityConfig,
        token: sanityConfig.visualEditing?.token,
        useCdn: false,
      }
    : sanityConfig

  const client = new (clientType === 'minimal' ? MinimalSanityClient : DefaultSanityClient)(clientConfig)

  if (visualEditingEnabled) (client as DefaultSanityClient).createQueryStore()

  clients[clientType] = client

  return client
}
