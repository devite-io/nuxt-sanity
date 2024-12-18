import type { ImageAsset } from '@sanity/types'
import type { Ref } from 'vue'
import { useSanityQuery } from '../composables/useSanityQuery'
import { IMAGE_ASSET_PROJECTION } from './projections'

export const resolveImageAssetById = async (id: string): Promise<Ref<ImageAsset | null>> => {
  return useSanityQuery<ImageAsset>(`*[_type == "sanity.imageAsset" && _id == $assetId][0] ${IMAGE_ASSET_PROJECTION}`, { assetId: id }).data
}
