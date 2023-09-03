<script setup>
import { RouterView } from 'vue-router';
import TheTimeline from '@/components/TheTimeline.vue';
</script>

<template>
  <div class="h-screen">
    <RouterView />

    <TheTimeline />
  </div>
</template>