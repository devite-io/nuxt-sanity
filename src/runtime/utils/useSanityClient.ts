import type { ModuleOptions } from '@devite/nuxt-sanity'
import type SanityClient from '../client/SanityClient'
import type { SanityClientType } from '../client/SanityClient'
import type DefaultSanityClient from '~/src/runtime/client/DefaultSanityClient'

const clients = {} as Record<SanityClientType, SanityClient>

export default async function useSanityClient(visualEditing: boolean, type: SanityClientType, config: ModuleOptions): Promise<SanityClient> {
  const clientType = visualEditing ? 'default' : type

  if (clientType in clients) return clients[clientType]

  const clientConfig = {
    ...config,
    stega: visualEditing && config.stega,
  }

  const client = new (await import(
    clientType === 'minimal' ? '../client/MinimalSanityClient.ts' : '../client/DefaultSanityClient.ts'
  )).default(clientConfig) as SanityClient

  if (visualEditing) (client as DefaultSanityClient).createQueryStore()

  clients[clientType] = client

  return client
}
