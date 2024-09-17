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
const props = defineProps<{ data: object }>()

const type
  = props.data.constructor.name === 'Array' && props.data.every(item => item._type === 'block')
    ? 'richText'
    : props.data?._type
const upperCamelCase = type?.charAt(0).toUpperCase() + type?.slice(1)
const component = resolveComponent('Sanity' + upperCamelCase)
</script>
