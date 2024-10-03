<template>
  <component
    :is="component"
    v-if="data"
    ref="componentRef"
    v-bind="{ ...$props, ...$attrs }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import { computed, ref, resolveComponent } from '#imports'
import { SanityLinkExternal, SanityLinkInternal, SanityRichText } from '#components'

const { data } = defineProps<{ data?: object }>()

const component = computed<Component>(() => {
  const type = data?._type

  switch (type) {
    case 'linkInternal':
      return SanityLinkInternal
    case 'linkExternal':
      return SanityLinkExternal
    default:
      if (data?.constructor.name === 'Array' && data.every(item => item._type === 'block'))
        return SanityRichText
      else if (type) {
        const upperCamelCase = type.charAt(0).toUpperCase() + type.slice(1)

        return resolveComponent('Sanity' + upperCamelCase)
      }
  }

  return null
})

const componentRef = ref<Component>()
defineExpose({ componentRef })
</script>
