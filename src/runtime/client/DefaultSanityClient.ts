import {
  type ClientPerspective,
  createClient,
  type QueryParams,
  type SanityClient as SanityClientType,
} from '@sanity/client'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import { createQueryStore as createCoreQueryStore, type QueryStore } from '@sanity/core-loader'
import { SanityClient } from '#imports'

class DefaultSanityClient extends SanityClient {
  public readonly client: SanityClientType
  public queryStore: QueryStore | null = null

  constructor(config: ModuleOptions) {
    super(config)
    this.client = createClient(config)
  }

  public async fetch<T>(
    query: string,
    params: QueryParams,
    options?: { perspective?: ClientPerspective },
  ): Promise<T | null> {
    try {
      return await this.client.fetch<T>(query, params, options)
    }
    catch (error) {
      console.error('Failed to fetch data from Sanity:', error)
      return null
    }
  }

  public createQueryStore(tag?: string) {
    const queryStore = createCoreQueryStore({
      tag: tag || 'nuxt-loader',
      client: false,
      ssr: true,
    })

    if (import.meta.server) {
      const serverClient = this.client.withConfig({
        perspective: 'previewDrafts',
        token: this.config.token,
        useCdn: false,
      })

      queryStore.setServerClient(serverClient)
    }

    this.queryStore = queryStore
  }

  public clone(): DefaultSanityClient {
    return new DefaultSanityClient({
      useCdn: this.config.useCdn,
      projectId: this.config.projectId,
      dataset: this.config.dataset,
      apiVersion: this.config.apiVersion,
      withCredentials: this.config.withCredentials,
      token: this.config.token,
      perspective: this.config.perspective,
    })
  }
}

export default DefaultSanityClient
