<template>
  <main v-if="sanityData?.modules?.length">
    <SanityComponent
      v-for="(module, index) in sanityData.modules"
      :key="module._key"
      :index="index"
      :data="module"
    />
    <slot />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Home, NotFound, Page } from '@devite/nuxt-sanity'
import { setResponseStatus } from 'h3'
import { groq, IMAGE_WITHOUT_PREVIEW_PROJECTION, useRequestEvent, useRoute, useRuntimeConfig, useSanityQuery, useSanitySEO } from '#imports'

const { prefix = '' } = defineProps<{ prefix?: string }>()

const path = useRoute().path
const groqFilter = path === '/' ? '_type == "home"' : `_type == "page" && slug.current == $slug`
const { data: sanityData } = await useSanityQuery<Home | Page | NotFound>(
  groq`*[(${groqFilter}) || _type == "notFound"][0] { _id, _type, slug, title, modules, seo { _type, indexable, title, shortTitle, description, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} } }`,
  { slug: prefix + path.substring(1) },
)

if (sanityData.value?._type === 'notFound' && import.meta.server) {
  const event = useRequestEvent()

  if (event)
    setResponseStatus(event, 404)
}

const { baseUrl } = useRuntimeConfig().public
const seo = computed(() => sanityData.value?.seo)

useSanitySEO(
  ((baseUrl as string) || '') + prefix + '/' + (sanityData.value && 'slug' in sanityData.value && sanityData.value.slug?.current ? sanityData.value.slug.current : ''),
  seo,
)
</script>
