import type { QueryStoreState } from '@sanity/core-loader'
import { type Reactive, toRaw } from 'vue'
import type { ContentSourceMap, QueryParams } from '@sanity/client'
import type { EncodeDataAttributeFunction } from '@sanity/core-loader/encode-data-attribute'
import { defineEncodeDataAttribute } from '@sanity/core-loader/encode-data-attribute'
import type DefaultSanityClient from '../../client/DefaultSanityClient'
import type { SanityClient } from '#imports'

export const subscribeToChanges = <T, E>(
  query: string,
  params: Reactive<QueryParams> | undefined,
  client: SanityClient,
  updateData: (data: T, sourceMap?: ContentSourceMap, encodeDataAttribute?: EncodeDataAttributeFunction) => void,
) => {
  let unsubscribe = () => {}

  function setupFetcher(cb?: (state: Readonly<QueryStoreState<T, E>>) => void) {
    unsubscribe()

    const deepClonedParams = params ? JSON.parse(JSON.stringify(toRaw(params))) : undefined
    const fetcher = (client as DefaultSanityClient).queryStore!.createFetcherStore<T, E>(query, deepClonedParams, undefined)

    unsubscribe = fetcher.subscribe((newSnapshot) => {
      if (newSnapshot.data) {
        const encodeDataAttribute = newSnapshot.sourceMap
          ? defineEncodeDataAttribute(newSnapshot.data, newSnapshot.sourceMap, client.config.visualEditing?.studioUrl)
          : undefined

        updateData(newSnapshot.data, newSnapshot.sourceMap, encodeDataAttribute)
        cb?.(newSnapshot)
      }
    })
  }

  setupFetcher()
}
