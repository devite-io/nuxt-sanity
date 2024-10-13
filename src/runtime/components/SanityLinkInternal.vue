<template>
  <NuxtLink
    :to="data.slug"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LinkInternal } from '@devite/nuxt-sanity'

defineProps<{ data: LinkInternal }>()
</script>
