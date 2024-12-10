<template>
  <NuxtImg
    v-if="imageAsset?._id"
    densities="x1 x2"
    :src="imageAsset._id"
    :width="imageAsset.metadata.dimensions.width"
    :height="imageAsset.metadata.dimensions.height"
    :alt="imageAsset.altText"
    :placeholder="loading === 'eager' ? undefined : imageAsset.metadata.lqip"
    :loading="loading"
    :format="imageAsset.mimeType === 'image/svg+xml' ? undefined : 'webp'"
    draggable="false"
  />
</template>

<script setup lang="ts">
import type { ImageAsset, Reference } from '@sanity/types'
import type { Ref } from 'vue'
import { resolveImageAssetById } from '#imports'

const { asset, loading = 'lazy' } = defineProps<{ asset?: ImageAsset | Reference, loading?: 'eager' | 'lazy' }>()
const imageAsset: Ref<ImageAsset | null> | ImageAsset | undefined = asset?._ref
  ? await resolveImageAssetById((asset as Reference)._ref)
  : asset as (ImageAsset | undefined)
</script>
