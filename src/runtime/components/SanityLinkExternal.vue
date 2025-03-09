<template>
  <NuxtLink
    :to="data.url"
    :target="data.newWindow ? '_blank' : '_self'"
    :title="data.linkTitle"
    :rel="data.relationship"
    :external="!data.url.startsWith('/')"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LinkExternal } from '@devite/nuxt-sanity'

defineProps<{ data: LinkExternal }>()
</script>
