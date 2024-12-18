import {
  type ClientConfig,
  type ClientPerspective,
  createClient,
  type FilteredResponseQueryOptions,
  type QueryParams,
  type SanityClient as SanityClientType,
} from '@sanity/client'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import { createQueryStore as createCoreQueryStore, type QueryStore } from '@sanity/core-loader'
import SanityClient from './SanityClient'

class DefaultSanityClient extends SanityClient {
  public readonly client: SanityClientType
  public queryStore: QueryStore | null = null

  constructor(config: ClientConfig & ModuleOptions) {
    super(config)
    this.client = createClient(config)
  }

  public fetch<T = unknown>(query: string, params: QueryParams, options?: { perspective?: ClientPerspective } & FilteredResponseQueryOptions): Promise<T> {
    return this.client.fetch<T>(query, params, options)
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