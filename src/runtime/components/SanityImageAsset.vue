<template>
  <NuxtImg
    v-if="imageAsset?._id"
    densities="x1 x2"
    :src="imageAsset._id"
    :width="imageAsset.metadata.dimensions.width"
    :height="imageAsset.metadata.dimensions.height"
    :alt="imageAsset.altText"
    :placeholder="loading === 'eager' ? undefined : imageAsset.metadata.lqip"
    :loading="loading || 'lazy'"
    :format="imageAsset.mimeType === 'image/svg+xml' ? undefined : 'webp'"
    draggable="false"
  />
</template>

<script setup lang="ts">
import type { ImageAsset, Reference } from '@sanity/types'
import { resolveImageAssetById } from '../utils/resolveImageAssetById'
import { useLazyAsyncData, useAsyncData, useId } from '#imports'

const props = defineProps<{
  asset?: ImageAsset | Reference | null
  loading?: 'eager' | 'lazy'
}>()

const { data: imageAsset } = await (
  props.loading !== 'eager' ? useLazyAsyncData : useAsyncData
)<ImageAsset | null>(
  useId(),
  async () =>
    props.asset?._ref
      ? (await resolveImageAssetById((props.asset as Reference)._ref)).value
      : ((props.asset || null) as ImageAsset | null),
  { watch: [props] },
)
</script>
