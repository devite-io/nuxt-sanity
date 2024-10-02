<template>
  <SanityImageAsset
    :asset="data?.image?.asset"
    :loading="data.lazy ? 'lazy' : 'eager'"
  />
</template>

<script setup lang="ts">
defineProps<{ data: ImageBlock }>()
</script>
