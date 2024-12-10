<template>
  <main v-if="sanityData?.modules?.length">
    <SanityComponent
      v-for="module in sanityData.modules"
      :key="module._key"
      :data="module"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import type { ImageAsset } from '@sanity/types'
import type { GlobalSEO, Home, NotFound, Page } from '@devite/nuxt-sanity'
import { IMAGE_WITHOUT_PREVIEW_PROJECTION } from '../utils/projections'
import { useHead, useRoute, useRuntimeConfig, useSanityQuery, useSeoMeta } from '#imports'
import { groq } from '#build/imports'

const path = useRoute().fullPath
const groqFilter = path === '/' ? '_type == "home"' : `_type == "page" && slug.current == $slug`
const { data: sanityData } = await useSanityQuery<Home | Page | NotFound>(groq`*[(${groqFilter}) || _type == "notFound"][0] { _id, _type, title, modules, seo { _type, indexable, title, shortTitle, description, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} } }`, { slug: path.substring(1) })

const { baseURL } = useRuntimeConfig().public
const seo = computed(() => sanityData.value?.seo)
const url = computed(() => (baseURL as string || '') + ((sanityData.value && ('slug' in sanityData.value ? sanityData.value.slug.current : null)) || '/'))

const { data: globalSEO } = await useSanityQuery<GlobalSEO>(groq`*[_type == 'settings'][0].seo { siteName, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} }`)
const image: ComputedRef<ImageAsset | undefined> = computed(() => sanityData.value?.seo.image?.asset || globalSEO.value?.image?.asset)
const imageUrl = computed(() => image.value?.url)
const imageDimensions = computed(() => image.value?.metadata.dimensions)

useHead({
  meta: [
    { name: 'site_name', content: () => globalSEO.value?.siteName },
    { name: 'og:image', content: () => imageUrl.value },
    { name: 'og:image:width', content: () => imageDimensions.value?.width },
    { name: 'og:image:height', content: () => imageDimensions.value?.height },
    { name: 'twitter:image', content: () => imageUrl.value },
    { name: 'twitter:image:width', content: () => imageDimensions.value?.width },
    { name: 'twitter:image:height', content: () => imageDimensions.value?.height },
    { name: 'og:url', content: () => url.value },
    { name: 'twitter:url', content: () => url.value },
  ],
  link: [
    { rel: 'canonical', href: () => url.value },
  ],
})

useSeoMeta({
  robots: () => `${seo.value?.indexable ? '' : 'no'}index,follow`,
  title: () => seo.value?.title || '',
  description: () => seo.value?.description,
  ogTitle: () => seo.value?.shortTitle,
  ogDescription: () => seo.value?.description,
  twitterTitle: () => seo.value?.shortTitle,
  twitterDescription: () => seo.value?.description,
})
</script>
