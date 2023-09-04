<template>
  <TheMovie
    v-if="movie"
    :movie="movie"
  />
  <p v-else>Loading...</p>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import TheMovie from '@/components/layout/TheMovie.vue';

const route = useRoute();
const movie = ref(null);

onBeforeMount(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/${route.params.slug}`);
  movie.value = await response.json();
});
</script>