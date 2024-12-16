<template>
  <NuxtLink
    :to="data.url"
    :target="data.newWindow ? '_blank' : '_self'"
    external
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LinkExternal } from '@devite/nuxt-sanity'

defineProps<{ data: LinkExternal }>()
</script>
