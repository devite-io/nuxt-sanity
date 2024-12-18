import { onScopeDispose } from 'vue'
import type DefaultSanityClient from '../client/DefaultSanityClient'
import { useSanityClient } from '#imports'

export const useSanityLiveMode = () => {
  let disable = () => {}

  if (import.meta.client) {
    const client = useSanityClient('default') as DefaultSanityClient

    if (client.queryStore) {
      disable = client.queryStore.enableLiveMode({
        client: client.client,
      })
    }
  }

  onScopeDispose(disable)

  return disable
}
