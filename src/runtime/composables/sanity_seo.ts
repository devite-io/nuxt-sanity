import type { GlobalSEO, SEO } from '@devite/nuxt-sanity'
import type { ImageAsset } from '@sanity/types'
import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import { groq, IMAGE_WITHOUT_PREVIEW_PROJECTION, useHead, useSanityQuery, useSeoMeta } from '#imports'

export const useSanitySEO = (url: string, seo: Ref<SEO | undefined>) => {
  const { data: globalSEO } = useSanityQuery<GlobalSEO>(
    groq`*[_type == 'settings'][0].seo { siteName, image ${IMAGE_WITHOUT_PREVIEW_PROJECTION} }`,
  )

  const image: ComputedRef<ImageAsset | undefined> = computed(
    () => seo.value?.image?.asset ?? globalSEO.value?.image?.asset,
  )
  const imageUrl = computed(() => image.value?.url)
  const imageDimensions = computed(() => image.value?.metadata.dimensions)
  const imageMimeType = computed(
    () => image.value?.mimeType as 'image/gif' | 'image/jpeg' | 'image/png' | undefined,
  )
  const imageAlt = computed(() => image.value?.altText as string | undefined)

  useHead({
    meta: [
      { name: 'og:url', content: () => url },
      { name: 'twitter:url', content: () => url },
    ],
    link: [{ rel: 'canonical', href: () => url }],
  })

  useSeoMeta({
    // indexing
    robots: () => (seo.value?.indexable ? '' : 'no') + `index,follow`,
    // title
    title: () => seo.value?.title ?? '',
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
}
