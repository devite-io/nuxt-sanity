import type { ClientPerspective, ContentSourceMap, QueryParams } from '@sanity/client'
import type { ModuleOptions } from '@devite/nuxt-sanity'

export type SanityClientType = 'minimal' | 'default'

export default abstract class SanityClient {
  public config: ModuleOptions
  public sourceMap: ContentSourceMap | undefined = undefined

  protected constructor(config: ModuleOptions) {
    this.config = config
  }

  public abstract fetch<T>(
    query: string,
    params: QueryParams,
    options?: { perspective?: ClientPerspective }
  ): Promise<T | null>
}
