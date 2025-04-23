<template>
  <NuxtImg
    v-if="imageAsset?._id"
    densities="x1 x2"
    :src="imageAsset._id"
    :width="imageAsset.metadata.dimensions.width"
    :height="imageAsset.metadata.dimensions.height"
    :alt="imageAsset.altText as (string | undefined)"
    :placeholder="loading === 'eager' || !lqip ? undefined : imageAsset.metadata.lqip"
    :loading="loading || 'lazy'"
    :format="imageAsset.mimeType === 'image/svg+xml' ? 'svg+xml' : 'webp'"
    draggable="false"
    provider="cachedSanity"
  />
</template>

<script setup lang="ts">
import type { ImageAsset, Reference } from '@sanity/types'
import { ref, watch } from 'vue'
import { resolveImageAssetById } from '#imports'

const props = defineProps<{
  asset?: ImageAsset | Reference | null
  loading?: 'eager' | 'lazy'
  lqip?: boolean
}>()
const imageAsset = ref<ImageAsset | null>(null)
let unwatchFunc = undefined as (() => void) | undefined

async function resolveImageAsset() {
  if (props.asset?._ref) {
    const assetRef = await resolveImageAssetById((props.asset as Reference)._ref, props.lqip || false)

    imageAsset.value = assetRef.value

    unwatchFunc?.()
    unwatchFunc = watch(assetRef, (updatedAsset) => imageAsset.value = updatedAsset)
    return
  }

  imageAsset.value = (props.asset || null) as ImageAsset | null
}

await resolveImageAsset()
</script>
