<template>
  <main v-if="sanityData.modules?.length > 0">
    <SanityComponent
      v-for="module in sanityData.modules"
      :key="module._key"
      :data="module"
    />
  </main>
</template>

<script setup lang="ts">
import type { Home } from '~/types/singletons/Home'
import type { Page } from '~/types/documents/Page'
import type { NotFound } from '~/types/singletons/NotFound'
import type { GlobalSEO } from '~/types/objects/global/GlobalSEO'

const { baseURL } = useRuntimeConfig().public

const path = useRoute().fullPath
const groqFilter = path === '/' ? '_type == "home"' : `_type == "page" && slug.current == "${path.substring(1)}"`
const { data: sanityData } = await useSanityQuery<Home | Page | NotFound>(groq`*[(${groqFilter}) || _type == "notFound"][0] { _id, _type, title, modules, seo }`)

const seo = computed(() => sanityData.value?.seo)
const url = computed(() => baseURL + (sanityData.value?.slug || '/'))

const { data: globalSEO } = await useSanityQuery<GlobalSEO>(groq`*[_type == 'settings'][0].seo { site_name, image }`)
const image = computed(() => sanityData.value?.image || globalSEO.value?.image)

useHead({
  meta: [
    { name: 'site_name', content: () => globalSEO.value?.site_name },
    { name: 'og:image', content: () => image.value?.url },
    { name: 'og:image:width', content: () => image.value?.metadata.dimensions.width },
    { name: 'og:image:height', content: () => image.value?.metadata.dimensions.height },
    { name: 'twitter:image', content: () => image.value?.url },
    { name: 'twitter:image:width', content: () => image.value?.metadata.dimensions.width },
    { name: 'twitter:image:height', content: () => image.value?.metadata.dimensions.height },
    { name: 'og:url', content: () => url.value },
    { name: 'twitter:url', content: () => url.value },
  ],
  link: [
    { rel: 'canonical', href: () => url.value },
  ],
})

useSeoMeta({
  robots: () => ((seo.value?.indexable ? '' : 'no') + 'index,follow'),
  title: () => seo.value?.title,
  description: () => seo.value?.description,
  ogTitle: () => seo.value?.opengraph_title,
  ogDescription: () => seo.value?.description,
  twitterTitle: () => seo.value?.opengraph_title,
  twitterDescription: () => seo.value?.description,
})
</script>
