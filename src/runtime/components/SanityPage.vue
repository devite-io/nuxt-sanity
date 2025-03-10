<template>
  <main v-if="sanityData?.modules?.length">
    <SanityComponent
      v-for="module in sanityData.modules"
      :key="module._key"
      :data="module"
    />
    <slot />
  </main>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import type { ImageAsset } from '@sanity/types'
import type { GlobalSEO, Home, NotFound, Page } from '@devite/nuxt-sanity'
import { setResponseStatus } from 'h3'
import { IMAGE_WITHOUT_PREVIEW_PROJECTION, groq, useHead, useRequestEvent, useRoute, useRuntimeConfig, useSanityQuery, useSeoMeta } from '#imports'

const path = useRoute().path
const groqFilter = path === '/' ? '_type == "home"' : `_type == "page" && slug.current == $slug`
const { data: sanityData } = await useSanityQuery<Home | Page | NotFound>(
  groq`*[(${groqFilter}) || _type == "notFound"][0] { _id, _type, title, modules, seo { _type, indexable, title, shortTitle, description, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} } }`,
  { slug: path.substring(1) },
)

if (sanityData.value?._type === 'notFound' && import.meta.server) {
  const event = useRequestEvent()

  if (event)
    setResponseStatus(event, 404)
}

const { baseUrl } = useRuntimeConfig().public
const seo = computed(() => sanityData.value?.seo)
const url = computed(
  () =>
    ((baseUrl as string) || '')
    + ((sanityData.value && ('slug' in sanityData.value ? sanityData.value.slug.current : null)) || '/'),
)

const { data: globalSEO } = await useSanityQuery<GlobalSEO>(
  groq`*[_type == 'settings'][0].seo { siteName, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} }`,
)
const image: ComputedRef<ImageAsset | undefined> = computed(
  () => sanityData.value?.seo.image?.asset || globalSEO.value?.image?.asset,
)
const imageUrl = computed(() => image.value?.url)
const imageDimensions = computed(() => image.value?.metadata.dimensions)
const imageMimeType = computed(() => image.value?.mimeType as 'image/gif' | 'image/jpeg' | 'image/png' | undefined)
const imageAlt = computed(() => image.value?.altText as string | undefined)

useHead({
  meta: [
    { name: 'og:url', content: () => url.value },
    { name: 'twitter:url', content: () => url.value },
  ],
  link: [{ rel: 'canonical', href: () => url.value }],
})

useSeoMeta({
  // indexing
  robots: () => `${seo.value?.indexable ? '' : 'no'}index,follow`,
  // title
  title: () => seo.value?.title || '',
  ogTitle: () => seo.value?.shortTitle,
  twitterTitle: () => seo.value?.shortTitle,
  // description
  description: () => seo.value?.description,
  ogDescription: () => seo.value?.description,
  twitterDescription: () => seo.value?.description,
  // OpenGraph site name
  ogSiteName: () => globalSEO.value?.siteName,
  // OpenGraph Image
  ogImage: () => imageUrl.value,
  ogImageWidth: () => imageDimensions.value?.width,
  ogImageHeight: () => imageDimensions.value?.height,
  ogImageType: () => imageMimeType.value,
  ogImageAlt: () => imageAlt.value,
  // Twitter Image
  twitterImage: () => imageUrl.value,
  twitterImageAlt: () => imageAlt.value,
})
</script>
