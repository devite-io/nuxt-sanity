import type { ModuleOptions } from '@devite/nuxt-sanity'
import MinimalSanityClient from '../client/MinimalSanityClient'
import DefaultSanityClient from '../client/DefaultSanityClient'
import type SanityClient from '../client/SanityClient'

export type SanityClientType = 'minimal' | 'default'

const clients = {} as Record<SanityClientType, SanityClient>

export default function getOrCreateSanityClient(
  visualEditing: boolean,
  config: ModuleOptions,
  type?: SanityClientType,
) {
  const clientType = visualEditing ? 'default' : type || (config.minimalClient ? 'minimal' : 'default')

  if (clientType in clients) return clients[clientType]

  const clientConfig = {
    ...config,
    stega: visualEditing && config.stega,
  }

  const client
    = clientType === 'minimal' ? new MinimalSanityClient(clientConfig) : new DefaultSanityClient(clientConfig)

  if (visualEditing && import.meta.client) (client as DefaultSanityClient).createQueryStore()

  clients[clientType] = client

  return client
}
