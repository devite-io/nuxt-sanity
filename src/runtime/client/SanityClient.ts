import type {
  ClientConfig,
  ClientPerspective,
  ContentSourceMap,
  FilteredResponseQueryOptions,
  QueryParams,
} from '@sanity/client'
import type { ModuleOptions } from '@devite/nuxt-sanity'

export default abstract class SanityClient {
  public config: ClientConfig & ModuleOptions
  public sourceMap: ContentSourceMap | undefined = undefined

  protected constructor(config: ClientConfig & ModuleOptions) {
    this.config = config
  }

  public abstract fetch<T = unknown>(query: string, params: QueryParams, options?: { perspective?: ClientPerspective } & FilteredResponseQueryOptions): Promise<T>
}
