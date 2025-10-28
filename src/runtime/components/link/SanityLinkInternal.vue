<template>
  <NuxtLink
    :to="resolvedLink?.slug + (data.queryString ? `?${data.queryString}` : '')"
    :title="resolvedLink?.linkTitle"
    :rel="resolvedLink?.relationship"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { resolveInternalLink } from '#imports'
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Ref } from 'vue'

const { data } = defineProps<{ data: LinkInternal | { reference: Reference } }>()
const resolvedLink: Ref<LinkInternal | null> | LinkInternal = 'reference' in data
  ? await resolveInternalLink(data.reference)
  : data as LinkInternal
</script>
