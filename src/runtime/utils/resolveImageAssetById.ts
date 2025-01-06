import type { ImageAsset } from '@sanity/types'
import type { Ref } from 'vue'
import { IMAGE_ASSET_PROJECTION } from './projections'
import { useSanityQuery } from '#imports'

export const resolveImageAssetById = async (id: string, lqip?: boolean): Promise<Ref<ImageAsset | null>> => {
  const projection = lqip
    ? IMAGE_ASSET_PROJECTION
    : IMAGE_ASSET_PROJECTION.replace('lqip, ', '')

  return (await useSanityQuery<ImageAsset>(
    `*[_type == "sanity.imageAsset" && _id == $assetId][0] ${projection}`,
    { assetId: id },
  )).data
}
