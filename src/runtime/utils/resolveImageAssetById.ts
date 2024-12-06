import { useSanityQuery } from '@nuxtjs/sanity/runtime/composables/visual-editing'
import type { ImageAsset } from '@sanity/types'
import { IMAGE_ASSET_PROJECTION } from './projections'
import type { Ref } from '#imports'

export const resolveImageAssetById = async (id: string): Promise<Ref<ImageAsset | undefined>> => {
  return (await useSanityQuery<ImageAsset>(`*[_type == "sanity.imageAsset" && _id == $assetId][0] ${IMAGE_ASSET_PROJECTION}`, { assetId: id })).data
}
