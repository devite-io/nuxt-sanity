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
import type { Reference } from '@sanity/types'
import { type Ref, resolveInternalLink } from '#imports'

const { data } = defineProps<{ data: LinkInternal | { reference: Reference } }>()
const resolvedLink: Ref<LinkInternal | undefined> | LinkInternal = 'reference' in data
  ? await resolveInternalLink(data.reference)
  : data as LinkInternal
</script>
