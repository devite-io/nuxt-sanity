import type { Reference } from '@sanity/types'
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Ref } from 'vue'
import { useSanityQuery } from '#imports'

export const resolveInternalLink = async (reference: Reference): Promise<Ref<LinkInternal | null>> => {
  return (await useSanityQuery<LinkInternal>(
    `*[_id == $documentId][0] { '_type': 'linkInternal', 'slug': '/' + coalesce(slug.current, '') }`,
    { documentId: reference._ref },
  )).data
}
