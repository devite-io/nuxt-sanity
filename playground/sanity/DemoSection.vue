<template>
  <section>
    <h1>{{ data.headline }}</h1>
    <SanityComponent :data="data.paragraph" />
    <SanityComponent :data="data.image" />
  </section>
</template>

<script setup lang="ts">
const { data } = defineProps<{ data: DemoSection }>()
</script>
