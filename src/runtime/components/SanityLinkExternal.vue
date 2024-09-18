<template>
  <NuxtLink
    :to="data.url"
    :options="{ external: true, target: data.newWindow ? '_blank' : null }"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LinkExternal } from '../types/objects/link/LinkExternal'

defineProps<{ data: LinkExternal }>()
</script>
