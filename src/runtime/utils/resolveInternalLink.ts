import { useSanityQuery } from '@nuxtjs/sanity/runtime/composables/visual-editing'
import type { ImageAsset, Reference } from '@sanity/types'
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Ref } from '#imports'

export const resolveInternalLink = async (reference: Reference): Promise<Ref<LinkInternal | null>> => {
  return (await useSanityQuery<ImageAsset>(`*[( _type == "home" || _type == "page") && _id == $documentId][0] { '_type': 'linkInternal', 'slug': coalesce(@.slug.current, '/') }`, { $documentId: reference._ref })).data
}
