import { useSanityQuery } from '#imports'
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Reference } from '@sanity/types'
import { computed, type MaybeRef, type Ref, toValue } from 'vue'

export const resolveInternalLink = async (reference: MaybeRef<Reference>): Promise<Ref<LinkInternal | null>> => {
  return (await useSanityQuery<LinkInternal>(
    `*[_id == $documentId][0] { '_type': 'linkInternal', 'slug': '/' + coalesce(slug.current, ''), linkTitle, relationship }`,
    { documentId: computed(() => toValue(reference)._ref) },
  )).data
}
