<template>
  <div class="h-screen">
    <TheHeader />

    <RouterView />

    <TheTimeline />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import TheTimeline from '@/components/layout/TheTimeline.vue';
import TheHeader from '@/components/layout/TheHeader.vue';
</script>