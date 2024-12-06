import { useSanityQuery } from '@nuxtjs/sanity/runtime/composables/visual-editing'
import type { ImageAsset, Reference } from '@sanity/types'
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Ref } from '#imports'

export const resolveInternalLink = async (reference: Reference): Promise<Ref<LinkInternal | undefined>> => {
  return (await useSanityQuery<ImageAsset>(`*[_id == $documentId][0] { '_type': 'linkInternal', 'slug': coalesce(slug.current, '/') }`, { documentId: reference._ref })).data
}
