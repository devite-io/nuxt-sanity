<template>
  <NuxtPicture
    v-if="imageAsset?._id"
    densities="x1 x2"
    :src="imageAsset._id"
    :sizes="isSvg ? (imageAsset.metadata.dimensions.width ?? 64) + 'px' : sizes"
    :width="imageAsset.metadata.dimensions.width"
    :height="imageAsset.metadata.dimensions.height"
    :alt="imageAsset.altText as (string | undefined)"
    :placeholder="loading === 'eager' || !lqip ? undefined : imageAsset.metadata.lqip"
    :loading="loading || 'lazy'"
    :format="isSvg ? 'svg+xml' : 'webp'"
    legacy-format="png"
    :img-attrs="{ ...imgAttrs, draggable: false }"
    provider="cachedSanity"
  >
    <slot />
  </NuxtPicture>
</template>

<script setup lang="ts">
import type { ImageAsset, Reference } from '@sanity/types'
import { computed, ref, watch } from 'vue'
import { resolveImageAssetById } from '#imports'

const { asset } = defineProps<{
  asset?: ImageAsset | Reference | null
  sizes?: string
  loading?: 'eager' | 'lazy'
  lqip?: boolean
  imgAttrs?: Record<string, unknown>
}>()
const imageAsset = ref<ImageAsset | null>(null)
const isSvg = computed(() => imageAsset.value?.mimeType === 'image/svg+xml')
let unwatchFunc = undefined as (() => void) | undefined

async function resolveImageAsset() {
  if (asset?._ref) {
    const assetRef = await resolveImageAssetById((asset as Reference)._ref, false)

    imageAsset.value = assetRef.value

    unwatchFunc?.()
    unwatchFunc = watch(assetRef, (updatedAsset) => imageAsset.value = updatedAsset)
    return
  }

  imageAsset.value = (asset || null) as ImageAsset | null
}

await resolveImageAsset()
</script>
