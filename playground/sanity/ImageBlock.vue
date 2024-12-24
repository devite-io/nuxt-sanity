<template>
  <SanityImageAsset
    :asset="data?.image?.asset"
    :loading="data.lazy ? 'lazy' : 'eager'"
    sizes="320px xs:640px md:768px lg:1024px xl:1280px 2xl:1536px"
    style="width: 25%; height: auto;"
  />
</template>

<script setup lang="ts">
defineProps<{ data: ImageBlock }>()
</script>
