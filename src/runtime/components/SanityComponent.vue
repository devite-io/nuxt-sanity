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
import { type Component, computed, ref, resolveComponent } from 'vue'
import type { SanityModule } from '@devite/nuxt-sanity'
import { SanityImageAsset, SanityLinkExternal, SanityLinkInternal, SanityRichText } from '#components'

const { data } = defineProps<{ data?: SanityModule | Array<SanityModule> }>()

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
      case 'sanity.imageAsset':
        return SanityImageAsset
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
