<template>
  <component
    :is="component"
    v-if="data"
    :data="data"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import { resolveComponent } from '#imports'
import { SanityLinkExternal, SanityLinkInternal, SanityRichText } from '#components'

const props = defineProps<{ data?: object }>()

const type = props.data?._type
let component: Component

switch (type) {
  case 'linkInternal':
    component = SanityLinkInternal
    break
  case 'linkExternal':
    component = SanityLinkExternal
    break
  default:
    if (props.data?.constructor.name === 'Array' && props.data.every(item => item._type === 'block'))
      component = SanityRichText
    else if (type) {
      const upperCamelCase = type.charAt(0).toUpperCase() + type.slice(1)
      component = resolveComponent('Sanity' + upperCamelCase)
    }

    break
}
</script>
