<template>
  <NuxtImg
    v-if="asset?._id"
    densities="x1 x2"
    :src="asset._id"
    :width="asset.metadata.dimensions.width"
    :height="asset.metadata.dimensions.height"
    :alt="asset.altText"
    :placeholder="asset.metadata.lqip"
    :loading="loading"
    :format="asset.mimeType === 'image/svg+xml' ? undefined : 'webp'"
    draggable="false"
  />
</template>

<script setup lang="ts">
import type { ImageAsset } from '@sanity/types'

const { loading = 'lazy' } = defineProps<{ asset: ImageAsset, loading?: 'lazy' | 'eager' }>()
</script>
