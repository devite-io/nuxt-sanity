<template>
  <component
    :is="component"
    v-if="data"
    ref="componentRef"
    v-bind="{ ...$props, ...$attrs }"
  >
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import type { Component } from '@nuxt/schema'
import { computed, ref, resolveComponent } from '#imports'
import { SanityLinkExternal, SanityLinkInternal, SanityRichText } from '#components'

const { data } = defineProps<{ data?: { _type?: string } | Array<{ _type: string }> }>()

const component = computed<Component | null>(() => {
  if (Array.isArray(data) && data.every((item) => item._type === 'block')) {
    return SanityRichText
  }

  if (data && typeof data === 'object' && '_type' in data) {
    const type = data._type as string

    switch (type) {
      case 'linkInternal':
        return SanityLinkInternal
      case 'linkExternal':
        return SanityLinkExternal
      default: {
        const upperCamelCase = type.charAt(0).toUpperCase() + type.slice(1)
        const resolvedComponent = resolveComponent('Sanity' + upperCamelCase)

        return resolvedComponent ? (resolvedComponent as Component) : null
      }
    }
  }

  return null
})

const componentRef = ref<Component>()
defineExpose({ componentRef })
</script>
