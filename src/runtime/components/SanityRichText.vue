<template>
  <PortableText
    :value="currentData"
    :components="richTextSerializer"
  />
</template>

<script setup lang="ts">
import { PortableText, type PortableTextComponents } from '@portabletext/vue'
import type { RichText } from '../types/richText/RichText'
import { computed, h } from '#imports'
import { SanityLinkExternal, SanityLinkInternal } from '#components'

const { data, placeholders = {} } = defineProps<{ data: RichText, placeholders?: object }>()
const currentData = computed(() => {
  return data.map((block) => {
    return {
      ...block,
      children: replaceChildren(block.children),
    }
  })
})

function replaceChildren(children: object[]) {
  return children.map((child) => {
    if (child._type === 'span') {
      return {
        ...child,
        text: replacePlaceholders(child.text),
      }
    }

    if (child.children) {
      return {
        ...child,
        children: replaceChildren(child.children),
      }
    }

    return child
  })
}

function replacePlaceholders(text: string) {
  return text.replace(/\{\{(.*?)\}\}/g, (match, key) => placeholders[key] || match)
}

const richTextSerializer: PortableTextComponents = {
  marks: {
    linkExternal: ({ value }, { slots }) =>
      h(SanityLinkExternal, { data: value }, slots.default),
    linkInternal: ({ value }, { slots }) =>
      h(SanityLinkInternal, { data: value }, slots.default),
  },
}
</script>
