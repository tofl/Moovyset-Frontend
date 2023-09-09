<template>
  <TheMovie
    v-if="movie"
    :movie="movie"
  />
  <p v-else>Loading...</p>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import TheMovie from '@/components/layout/TheMovie.vue';

const route = useRoute();
const movie = ref(null);

async function fetchMovie(slug) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/movies/${slug}`);
  movie.value = await response.json();
}

onBeforeRouteUpdate((r) => {
  fetchMovie(r.params.slug);
});

onBeforeMount(() => {
  fetchMovie(route.params.slug);
});
</script>