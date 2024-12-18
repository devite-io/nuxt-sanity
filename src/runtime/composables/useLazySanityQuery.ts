import type { AsyncDataOptions } from 'nuxt/app'
import type { QueryParams } from '@sanity/client'
import type { AsyncSanityData, SanityQueryResponse } from '~/src/runtime/composables/useSanityQuery'
import { useSanityQuery } from '#imports'

export const useLazySanityQuery = <T = unknown, E = Error>(query: string, _params: QueryParams = {}, options: AsyncDataOptions<SanityQueryResponse<T | null>> = {}): AsyncSanityData<T | null, E> => {
  return useSanityQuery(query, _params, options, true)
}
