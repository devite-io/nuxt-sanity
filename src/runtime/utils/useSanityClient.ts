import type { ModuleOptions } from '@devite/nuxt-sanity'
import type DefaultSanityClient from '../client/DefaultSanityClient'
import type { SanityClientType, SanityClient } from '#imports'

const clients = {} as Record<SanityClientType, SanityClient>

export default async function useSanityClient(visualEditing: boolean, type: SanityClientType, config: ModuleOptions): Promise<SanityClient> {
  const clientType = visualEditing ? 'default' : type

  if (clientType in clients) return clients[clientType]

  const clientConfig = {
    ...config,
    stega: visualEditing && config.stega,
  }

  const client = new (await (clientType === 'minimal' ? import('../client/MinimalSanityClient') : import('../client/DefaultSanityClient')
  )).default(clientConfig) as SanityClient

  if (visualEditing) (client as DefaultSanityClient).createQueryStore()

  clients[clientType] = client

  return client
}
