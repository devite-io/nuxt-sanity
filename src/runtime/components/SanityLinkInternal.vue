<template>
  <NuxtLink
    :to="data.slug"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LinkInternal } from '../types/objects/link/LinkInternal'

defineProps<{ data: LinkInternal }>()
</script>
