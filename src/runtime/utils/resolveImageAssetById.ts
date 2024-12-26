import type { ImageAsset } from '@sanity/types'
import type { Ref } from 'vue'
import { IMAGE_ASSET_PROJECTION } from './projections'
import { useSanityQuery } from '#imports'

export const resolveImageAssetById = async (id: string): Promise<Ref<ImageAsset | null>> => {
  return (await useSanityQuery<ImageAsset>(
    `*[_type == "sanity.imageAsset" && _id == $assetId][0] ${IMAGE_ASSET_PROJECTION}`,
    { assetId: id },
  )).data
}
