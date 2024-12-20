<template>
  <section>
    <h1 v-html="data.headline" />
    <SanityComponent :data="data.paragraph" />
    <SanityComponent :data="data.image" />
  </section>
</template>

<script setup lang="ts">
defineProps<{ data: DemoSection }>()
</script>
