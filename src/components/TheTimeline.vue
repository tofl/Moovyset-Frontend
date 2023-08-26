<template>
  <div class="h-10 text-center whitespace-nowrap overflow-x-scroll">
    <div
      class="inline-block w-24 text-center border-r leading-10 cursor-pointer relative hover:font-bold hover:bottom-0.5"
      v-for="decade in decades()"
      :key="decade"
      :id="decade"
      :class="{ 'font-bold bottom-0.5': decade === movies.decade }"
      @click="changeDecade(decade)"
    >
      {{ decade }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMoviesStore } from '@/stores/movies.js';

const movies = useMoviesStore();

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
  // TODO return to homepage if necessary
};

movies.decade = ref(decades()[Math.floor(Math.random() * decades().length)]);

onMounted(() => {
  document.getElementById(movies.decade).scrollIntoView();
  movies.fetchMovies();
});
</script>