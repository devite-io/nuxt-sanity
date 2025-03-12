import { $fetch } from 'ofetch'
import type { ClientPerspective, QueryParams } from '@sanity/client'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import { SanityClient } from '#imports'

const API_HOST = 'api.sanity.io'
const API_CDN_HOST = 'apicdn.sanity.io'

class MinimalSanityClient extends SanityClient {
  private readonly queryPath: string
  private readonly fetchOptions: RequestInit

  constructor(config: ModuleOptions) {
    super({
      ...config,
      perspective: config.perspective || 'raw',
      useCdn: config.perspective === 'drafts' ? false : config.useCdn,
    })

    this.queryPath = `/v${config.apiVersion}/data/query/${config.dataset}`
    this.fetchOptions = {
      headers: {
        ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
        Accept: 'application/json',
        ...(import.meta.server ? { 'accept-encoding': 'gzip, deflate' } : {}),
      },
    }

    if (import.meta.client) {
      this.fetchOptions.credentials = config.withCredentials ? 'include' : 'omit'
    }
  }

  private getByteLength(query: string): number {
    return encodeURI(query).split(/%..|./).length
  }

  private toQueryString(query: string, params: Record<string, unknown>): string {
    const baseQueryStr = `?query=${encodeURIComponent(query)}`

    return Object.keys(params).reduce((acc, paramName) => {
      return (
        acc
        + `&${encodeURIComponent(`$${paramName}`)}=${encodeURIComponent(JSON.stringify(params[paramName]))}`
      )
    }, baseQueryStr)
  }

  public async fetch<T>(
    query: string,
    params: QueryParams,
    _options?: { perspective?: ClientPerspective },
  ): Promise<T | null> {
    const perspectiveQueryString = `&perspective=${_options?.perspective || this.config.perspective}`
    const queryString = this.toQueryString(query, params || {}) + (this.config.useCdn ? '' : perspectiveQueryString)
    const byteLength = this.getByteLength(queryString)
    const isEligibleForGetRequest = byteLength <= 9000

    const minimalClientConfig = typeof this.config.minimalClient === 'object' ? this.config.minimalClient : {}
    const useCache = minimalClientConfig.cachingEnabled && isEligibleForGetRequest
    const cacheBaseUrl = import.meta.client ? minimalClientConfig.cacheClientBaseUrl : minimalClientConfig.cacheServerBaseUrl
    const requestUrl = useCache && cacheBaseUrl
      ? cacheBaseUrl + minimalClientConfig.queryEndpoint
      : `https://${this.config.projectId}.${this.config.useCdn && isEligibleForGetRequest ? API_CDN_HOST : API_HOST}${this.queryPath}`

    try {
      return (await $fetch<{
        result: T
      }>(requestUrl + queryString, {
        ...this.fetchOptions,
        method: isEligibleForGetRequest ? 'GET' : 'POST',
        body: !isEligibleForGetRequest ? { query, params } : undefined,
      })).result
    }
    catch (error) {
      console.error('Failed to fetch data from Sanity:', error)
      return null
    }
  }

  public clone(): MinimalSanityClient {
    return new MinimalSanityClient({
      useCdn: this.config.useCdn,
      projectId: this.config.projectId,
      dataset: this.config.dataset,
      apiVersion: this.config.apiVersion,
      withCredentials: this.config.withCredentials,
      token: this.config.token,
      perspective: this.config.perspective,
      minimalClient: this.config.minimalClient,
    })
  }
}

export default MinimalSanityClient
