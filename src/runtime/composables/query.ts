import { hash } from 'ohash'
import type { AsyncData, AsyncDataOptions, AsyncDataRequestStatus } from 'nuxt/app'
import { useAsyncData, useLazyAsyncData } from 'nuxt/app'
import type { ClientPerspective, ContentSourceMap, QueryParams } from '@sanity/client'
import type { EncodeDataAttributeFunction } from '@sanity/core-loader/encode-data-attribute'
import { type Reactive, reactive, type Ref, ref } from 'vue'
import type { ModuleOptions } from '@devite/nuxt-sanity'
import defu from 'defu'
import useSanityClient from '../utils/useSanityClient'
import { useSanityVisualEditingState } from './useSanityVisualEditingState'
import type { SanityClient } from '#imports'
import { useRuntimeConfig } from '#imports'

export interface UseSanityQueryOptions<T> extends AsyncDataOptions<T> {
  client?: 'default' | 'minimal'
  perspective?: 'previewDrafts' | 'published' | 'raw'
}

export interface SanityQueryResponse<T> {
  data: T
  sourceMap?: ContentSourceMap
  encodeDataAttribute?: EncodeDataAttributeFunction
}

export type AsyncSanityData<T, E> = _AsyncSanityData<T, E> & Promise<_AsyncSanityData<T, E>>

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

export function useLazySanityQuery<T = unknown, E = Error>(
  query: string,
  params: QueryParams = {},
  options: UseSanityQueryOptions<SanityQueryResponse<T | null>> = {},
): AsyncSanityData<T | null, E> {
  return useSanityQuery(query, params, options, true)
}

export function useSanityQuery<T = unknown, E = Error>(
  query: string,
  _params: QueryParams = {},
  options: UseSanityQueryOptions<SanityQueryResponse<T | null>> = {},
  lazy = false,
): AsyncSanityData<T | null, E> {
  const $config = useRuntimeConfig()
  const sanityConfig = defu(import.meta.server ? $config.sanity : {}, $config.public.sanity) as ModuleOptions
  const visualEditingEnabled = useSanityVisualEditingState().enabled
  const clientType = visualEditingEnabled
    ? 'default'
    : (options.client || (sanityConfig.minimalClient ? 'minimal' : 'default'))
  const perspective = (
    (options.perspective || (visualEditingEnabled ? 'previewDrafts' : 'published'))
  ) as ClientPerspective

  const reactiveParams = _params ? reactive(_params) : undefined

  if (reactiveParams) {
    options.watch ||= []
    options.watch.push(reactiveParams)
  }

  const data = ref<T | null>(null)
  const sourceMap = ref<ContentSourceMap | null>(null)
  const encodeDataAttribute = ref<EncodeDataAttributeFunction | (() => void)>(() => {})

  function updateRefs(resultData: T | null, resultSourceMap?: ContentSourceMap, resultEncodeDataAttribute?: EncodeDataAttributeFunction) {
    data.value = resultData
    sourceMap.value = resultSourceMap || null

    if (resultEncodeDataAttribute) encodeDataAttribute.value = resultEncodeDataAttribute
  }

  const fetchFunc: (() => Promise<SanityQueryResponse<T | null>>) = () => new Promise((resolve) => {
    (visualEditingEnabled ? import('../utils/visualEditing/fetchSanityData') : import('../utils/default/fetchSanityData')).then(async ({ fetchSanityData }) => {
      const client = (import.meta.server
        ? (await import('../server/utils/useSanityClient')).default(clientType, sanityConfig)
        : await useSanityClient(visualEditingEnabled, clientType, sanityConfig))

      function onDataUpdate(resultData: T | null, resultSourceMap?: ContentSourceMap, resultEncodeDataAttribute?: EncodeDataAttributeFunction) {
        if (resultEncodeDataAttribute)
          encodeDataAttribute.value = resultEncodeDataAttribute

        resolve({ data: resultData, sourceMap: resultSourceMap })
      }

      const fetchSanityDataFunc = fetchSanityData as (
        query: string,
        params: Reactive<QueryParams> | undefined,
        client: SanityClient,
        perspective: ClientPerspective,
        callback: (data: T | null, sourceMap?: ContentSourceMap, encodeDataAttribute?: EncodeDataAttributeFunction) => void,
      ) => void

      fetchSanityDataFunc(query, reactiveParams, client, perspective, onDataUpdate)
    })
  })

  const key = 'sanity-' + hash(query + (reactiveParams ? JSON.stringify(reactiveParams) : ''))
  const pendingData = (lazy
    ? useLazyAsyncData<SanityQueryResponse<T | null>, E>(key, fetchFunc, options)
    : useAsyncData<SanityQueryResponse<T | null>, E>(key, fetchFunc, options)) as AsyncData<SanityQueryResponse<T | null>, E>

  if (visualEditingEnabled && import.meta.client) {
    import('../utils/visualEditing/subscribeToChanges').then(async ({ subscribeToChanges }) => {
      const client = await useSanityClient(visualEditingEnabled, clientType, sanityConfig)

      subscribeToChanges<T, E>(query, reactiveParams, client as SanityClient, updateRefs)
    })
  }

  return Object.assign(new Promise((resolve) => pendingData.then(({ data: { value } }) => {
    updateRefs(value.data, value.sourceMap)
    resolve({ ...pendingData, data, sourceMap, encodeDataAttribute })
  })), { ...pendingData, data, sourceMap, encodeDataAttribute }) as AsyncSanityData<T | null, E>
}
