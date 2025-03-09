<template>
  <NuxtLink
    :to="resolvedLink?.slug"
    :title="resolvedLink?.linkTitle"
    :rel="resolvedLink?.relationship"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Reference } from '@sanity/types'
import type { LinkInternal } from '@devite/nuxt-sanity'
import type { Ref } from 'vue'
import { resolveInternalLink } from '../utils/resolveInternalLink'

const { data } = defineProps<{ data: LinkInternal | { reference: Reference } }>()
const resolvedLink: Ref<LinkInternal | null> | LinkInternal = 'reference' in data
  ? await resolveInternalLink(data.reference)
  : data as LinkInternal
</script>
