<template>
  <PortableText
    :value="currentData"
    :components="richTextSerializer"
  />
</template>

<script setup lang="ts">
import type { PortableTextComponents } from '@portabletext/vue'
import { PortableText } from '@portabletext/vue'
import type { PortableTextChild, PortableTextSpan } from '@sanity/types'
import type { RichText } from '@devite/nuxt-sanity'
import { computed, h } from 'vue'
import { SanityLinkExternal, SanityLinkInternal } from '#components'

const props = defineProps<{ data: RichText, placeholders?: Record<string, string> }>()
const currentData = computed(() => {
  return props.data.map((block) => {
    return {
      ...block,
      children: replaceChildren(block.children as PortableTextChild[]),
    }
  })
})

function replaceChildren(children: PortableTextChild[]): PortableTextChild[] {
  return children.map((child) => {
    if (child._type === 'span') {
      return {
        ...child,
        text: replacePlaceholders((child as PortableTextSpan).text),
      }
    }

    return child
  })
}

function replacePlaceholders(text: string) {
  return text.replace(/\{\{(.*?)}}/g, (match, key) => {
    if (!props.placeholders || !Object.prototype.hasOwnProperty.call(props.placeholders, key)) return match

    return props.placeholders[key]
  })
}

const richTextSerializer: PortableTextComponents = {
  marks: {
    linkExternal: ({ value }, { slots }) => h(SanityLinkExternal, { data: value }, slots.default),
    linkInternal: ({ value }, { slots }) => h(SanityLinkInternal, { data: value }, slots.default),
  },
}
</script>
