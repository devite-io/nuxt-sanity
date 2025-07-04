import type {
  ClientPerspective,
  ContentSourceMap,
  QueryParams,
  RawQueryResponse,
  SanityClient as SanityVisualEditingClient,
  UnfilteredResponseQueryOptions,
} from '@sanity/client'
import type { Reactive } from 'vue'
import type { EncodeDataAttributeFunction } from '@sanity/core-loader/encode-data-attribute'
import { defineEncodeDataAttribute } from '@sanity/core-loader/encode-data-attribute'
import type DefaultSanityClient from '../../client/DefaultSanityClient'
import type { SanityClient } from '#imports'

export async function fetchSanityData<T>(
  query: string,
  params: Reactive<QueryParams> | undefined,
  client: SanityClient,
  perspective: ClientPerspective,
  callback: (data: T | null, sourceMap?: ContentSourceMap, encodeDataAttribute?: EncodeDataAttributeFunction) => void,
) {
  function updateResult(data: T | null, sourceMap?: ContentSourceMap) {
    const encodeDataAttribute = sourceMap
      ? defineEncodeDataAttribute(data, sourceMap, client.config.visualEditing?.studioUrl)
      : undefined

    callback(data, sourceMap, encodeDataAttribute)
  }

  const defaultClient = client as DefaultSanityClient
  const proxyClient = {
    fetch: <T> (
      query: string,
      params: QueryParams,
      options: UnfilteredResponseQueryOptions,
    ) => $fetch<RawQueryResponse<T>>(client.config.visualEditing!.proxyEndpoint || '/_sanity/fetch', {
      method: 'POST',
      body: { query, params, options },
    }),
  } as SanityVisualEditingClient
  const currentClient = import.meta.server ? (defaultClient.queryStore!.unstable__serverClient.instance || defaultClient.client) : proxyClient

  const { result: data, resultSourceMap: sourceMap } = await currentClient.fetch<T>(query, params || {}, {
    perspective,
    filterResponse: false,
    resultSourceMap: 'withKeyArraySelector',
  })

  updateResult(data, sourceMap)
}
