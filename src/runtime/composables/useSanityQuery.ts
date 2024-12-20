import { hash } from 'ohash'
import type {
  ClientPerspective,
  ContentSourceMap,
  QueryParams,
  SanityClient,
  UnfilteredResponseQueryOptions,
} from '@sanity/client'
import type { EncodeDataAttributeFunction } from '@sanity/core-loader/encode-data-attribute'
import { defineEncodeDataAttribute } from '@sanity/core-loader/encode-data-attribute'
import type { AsyncData, AsyncDataOptions, AsyncDataRequestStatus } from 'nuxt/app'
import type { QueryStoreState } from '@sanity/core-loader'
import { onScopeDispose, reactive, type Ref, ref } from 'vue'
import type DefaultSanityClient from '../client/DefaultSanityClient'
import useSanityClient from '../utils/useSanityClient'
import { useAsyncData, useLazyAsyncData } from '#imports'

export interface SanityQueryResponse<T> {
  data: T
  sourceMap?: ContentSourceMap
  encodeDataAttribute?: EncodeDataAttributeFunction
}

interface AsyncDataExecuteOptions {
  _initial?: boolean
  dedupe?: boolean
}

export interface _AsyncSanityData<T, E> {
  data: Ref<T>
  sourceMap: Ref<ContentSourceMap | null>
  encodeDataAttribute: Ref<EncodeDataAttributeFunction | (() => void)>
  pending: Ref<boolean>
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>
  error: Ref<E | null>
  status: Ref<AsyncDataRequestStatus>
}

export type AsyncSanityData<T, E> = _AsyncSanityData<T, E> & Promise<_AsyncSanityData<T, E>>

export interface UseSanityQueryOptions<T> extends AsyncDataOptions<T> {
  client?: 'default' | 'minimal'
  perspective?: 'previewDrafts' | 'published' | 'raw'
}

export const useSanityQuery = <T = unknown, E = Error>(query: string, _params: QueryParams = {}, _options: UseSanityQueryOptions<SanityQueryResponse<T | null>> = {}, lazy = false): AsyncSanityData<T | null, E> => {
  const { client: clientType, perspective: _perspective, ...options } = _options
  const client = clientType ? useSanityClient(clientType) : useSanityClient()
  const perspective = (
    (_perspective || 'queryStore' in client) ? 'previewDrafts' : 'published'
  ) as ClientPerspective

  const key = 'sanity-' + hash(query + (_params ? JSON.stringify(_params) : ''))

  const reactiveParams = _params ? reactive(_params) : undefined

  if (reactiveParams) {
    options.watch ||= []
    options.watch.push(reactiveParams)
  }

  const data = ref<T | null>(null)
  const sourceMap = ref<ContentSourceMap | null>(null)
  const encodeDataAttribute = ref<EncodeDataAttributeFunction | (() => void)>(() => {})

  function updateResult(newData: T | null, newSourceMap?: ContentSourceMap) {
    data.value = newData
    sourceMap.value = newSourceMap || null

    if (client.config.visualEditing) {
      encodeDataAttribute.value = defineEncodeDataAttribute(newData, newSourceMap, client.config?.visualEditing?.studioUrl)
    }
  }

  let fetchFunc = () => client.fetch<SanityQueryResponse<T>>(query, reactiveParams || {}, { perspective })

  if ('queryStore' in client) {
    const defaultClient = client as DefaultSanityClient

    let unsubscribe = () => {}

    function setupFetcher(cb?: (state: Readonly<QueryStoreState<T, E>>) => void) {
      unsubscribe()

      if (!defaultClient.queryStore) return

      const fetcher = defaultClient.queryStore.createFetcherStore<T, E>(query, _params, undefined)

      unsubscribe = fetcher.subscribe((newSnapshot) => {
        if (newSnapshot.data) {
          updateResult(newSnapshot.data, newSnapshot.sourceMap)
          cb?.(newSnapshot)
        }
      })
    }

    const proxyClient = {
      fetch: <T> (
        query: string,
        params: QueryParams,
        options: UnfilteredResponseQueryOptions,
      ) => $fetch<{ result: T, resultSourceMap: ContentSourceMap }>(defaultClient.config.visualEditing!.proxyEndpoint || '/_sanity/proxy', {
        method: 'POST',
        body: { query, params, options },
      }),
    }

    fetchFunc = async () => {
      const currentClient = import.meta.server ? (defaultClient.queryStore!.unstable__serverClient.instance || defaultClient.client) : (proxyClient as SanityClient)

      const { result: fetchData, resultSourceMap: sourceMap } = await currentClient.fetch<T>(query, reactiveParams || {}, {
        perspective,
        filterResponse: false,
        resultSourceMap: 'withKeyArraySelector',
      })

      return sourceMap ? { data: fetchData, sourceMap } : { data: fetchData }
    }

    if (import.meta.client) setupFetcher()

    onScopeDispose(unsubscribe)
  }

  const pendingData = (lazy
    ? useLazyAsyncData<SanityQueryResponse<T | null>, E>(key, fetchFunc, options)
    : useAsyncData<SanityQueryResponse<T | null>, E>(key, fetchFunc, options)) as AsyncData<SanityQueryResponse<T | null>, E>

  return Object.assign(new Promise((resolve) => pendingData.then(async (result) => {
    updateResult(result.data.value?.data, client.sourceMap)
    resolve(result)
  })), { ...pendingData, data, sourceMap, encodeDataAttribute }) as AsyncSanityData<T | null, E>
}
