import type { ModuleOptions } from '@devite/nuxt-sanity'
import type DefaultSanityClient from '../client/DefaultSanityClient'
import useSanityClient from '../utils/useSanityClient'
import { useRuntimeConfig } from '#imports'

export const useSanityLiveMode = async () => {
  if (import.meta.client) {
    const client = await useSanityClient(true, 'default', useRuntimeConfig().public.sanity as ModuleOptions) as DefaultSanityClient

    if (client.queryStore) {
      return client.queryStore.enableLiveMode({ client: client.client })
    }
  }

  return () => {}
}
