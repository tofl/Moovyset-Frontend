<script setup>
import { RouterView } from 'vue-router';
import TheTimeline from '@/components/TheTimeline.vue';
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="border grow">
      <RouterView />
    </div>

    <TheTimeline />
  </div>
</template>