import type { ClientPerspective, ContentSourceMap, QueryParams } from '@sanity/client'
import type { Reactive } from 'vue'
import type { EncodeDataAttributeFunction } from '@sanity/core-loader/encode-data-attribute'
import type { SanityClient } from '#imports'

export async function fetchSanityData<T>(
  query: string,
  params: Reactive<QueryParams> | undefined,
  client: SanityClient,
  perspective: ClientPerspective,
  callback: (data: T | null, sourceMap?: ContentSourceMap, encodeDataAttribute?: EncodeDataAttributeFunction) => void,
) {
  client.fetch<T>(query, params || {}, { perspective }).then((fetchResult) => {
    callback(fetchResult)
  })
}
