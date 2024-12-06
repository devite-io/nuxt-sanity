<template>
  <NuxtLink
    v-if="resolvedLink"
    :to="resolvedLink.slug"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Ref } from '#imports'

const { data } = defineProps<{ data: LinkInternal }>()
const resolvedLink: Ref<LinkInternal | undefined> | undefined = 'reference' in data ? await resolveInternalLink(data.reference) : data
</script>
