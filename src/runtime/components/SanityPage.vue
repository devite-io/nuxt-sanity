<template>
  <main v-if="sanityData?.modules?.length > 0">
    <SanityComponent
      v-for="module in sanityData.modules"
      :key="module._key"
      :data="module"
    />
  </main>
</template>

<script setup lang="ts">
import { useSanityQuery } from '@nuxtjs/sanity/runtime/composables/visual-editing'
import { groq } from '@nuxtjs/sanity/runtime/groq'
import type { ComputedRef } from 'vue'
import type { ImageAsset } from '@sanity/types'
import type { Home, Page, NotFound, GlobalSEO } from '@devite/nuxt-sanity'
import { IMAGE_WITHOUT_PREVIEW_PROJECTION } from '../utils/projections'
import { useHead, useRoute, useRuntimeConfig, useSeoMeta, computed } from '#imports'

const path = useRoute().fullPath
const groqFilter = path === '/' ? '_type == "home"' : `_type == "page" && slug.current == $slug`
const { data: sanityData } = await useSanityQuery<Home | Page | NotFound>(groq`*[(${groqFilter}) || _type == "notFound"][0] { _id, _type, title, modules, seo { _type, indexable, title, shortTitle, description, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} } }`, { slug: path.substring(1) })

const { baseURL } = useRuntimeConfig().public
const seo = computed(() => sanityData.value?.seo)
const url = computed(() => baseURL + (sanityData.value?.slug || '/'))

const { data: globalSEO } = await useSanityQuery<GlobalSEO>(groq`*[_type == 'settings'][0].seo { siteName, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} }`)
const image: ComputedRef<ImageAsset> = computed(() => sanityData.value?.image?.asset || globalSEO.value?.image?.asset)
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
  title: () => seo.value?.title,
  description: () => seo.value?.description,
  ogTitle: () => seo.value?.shortTitle,
  ogDescription: () => seo.value?.description,
  twitterTitle: () => seo.value?.shortTitle,
  twitterDescription: () => seo.value?.description,
})
</script>
