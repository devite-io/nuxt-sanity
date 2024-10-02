<template>
  <NuxtImg
    v-if="imageAsset?._id"
    densities="x1 x2"
    :src="imageAsset._id"
    :width="imageAsset.metadata.dimensions.width"
    :height="imageAsset.metadata.dimensions.height"
    :alt="imageAsset.altText"
    :placeholder="imageAsset.metadata.lqip"
    :loading="loading"
    :format="imageAsset.mimeType === 'image/svg+xml' ? undefined : 'webp'"
    draggable="false"
  />
</template>

<script setup lang="ts">
import type { ImageAsset } from '@sanity/types'

const { asset, loading = 'lazy' } = defineProps<{ asset?: ImageAsset, loading?: 'lazy' | 'eager' }>()
const imageAsset = asset?._ref ? await resolveImageAssetById(asset._ref) : asset
</script>
