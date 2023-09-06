<template>
  <div class="absolute bottom-0 z-40 w-screen h-10 text-center whitespace-nowrap overflow-x-scroll bg-main-dark text-main-red border-t border-gray-400">
    <div
      class="inline-block w-24 text-center leading-10 cursor-pointer relative hover:font-bold hover:bottom-0.5"
      v-for="decade in decades()"
      :key="decade"
      :id="decade"
      :class="{ 'font-bold relative bottom-1': decade === movies.decade }"
      @click="changeDecade(decade)"
    >
      {{ decade }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies.js';

const movies = useMoviesStore();
const router = useRouter();
const route = useRoute();

const decades = () => {
  const y = [];
  for (let i = 1900; i <= new Date().getFullYear(); i += 10) { y.push(i) }
  return y;
};

const changeDecade = (e) => {
  movies.decade = e;
  movies.from = 0;
  movies.movies = [];
  movies.fetchMovies();

  if (window.location.pathname) {
    router.push('/');
    window.history.pushState({}, '', `/`);
  }
};

onMounted(async () => {
  // If the app is accessed through a movie page, then this isn't needed
  await router.isReady();
  if (route.name !== 'movie') {
    movies.decade = ref(decades()[Math.floor(Math.random() * decades().length)]);
    await movies.fetchMovies();
    document.getElementById(movies.decade).scrollIntoView();
  }
});
</script>