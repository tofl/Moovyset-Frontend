<template>
  <div
    class="flex flex-col-reverse lg:flex-row h-screen z-10 bg-no-repeat bg-cover"
    :style="`background-image: url('${movie.posterUrl}')`"
  >
    <div
      class="hidden lg:block duration-200 ease-out bg-no-repeat bg-cover"
      :class="{ 'grow-0': isFullPage, 'grow': !isFullPage }"
      :style="`background-image: url('${movie.posterUrl}')`"
    >
    </div>

    <div
      class="h-[50vh] pb-16 pt-5 lg:w-1/2 lg:h-screen text-white duration-200 ease-out"
      :class="{ 'grow bg-main-dark': isFullPage, 'custom-gradient-background lg:bg-main-dark': !isFullPage }"
    >
      <div class="flex flex-col h-full">

        <div v-if="isFullPage" class="self-center lg:hidden">
          <button @click="toggleMoviePage">
            <Chevron
              direction="down"
              :size="45"
            />
          </button>
        </div>

        <div
          ref="movieDescription"
          class="grow overflow-y-hidden flex flex-col lg:flex-row"
          :class="{ 'overflow-y-scroll': isFullPage }"
        >
          <!-- left (desktop) -->
          <div
            class="lg:w-1/2 flex flex-col"
            :class="{ 'lg:w-full': !isFullPage }"
          >
            <div class="grow">
              <!-- [FREE] Movie name -->
              <div class="flex items-baseline px-2 mb-4">
                <p
                  v-if="movie.freeToWatch"
                  class="bg-gray-100 px-2 text-black text-xl rounded mr-2"
                >
                  Free
                </p>
                <h2 class="text-4xl">{{ movie.name }}</h2>
              </div>

              <!-- Full movie (free movie) - Mobile -->
              <div
                v-if="isFullPage && movie.freeToWatch"
                class="relative h-0 overflow-hidden max-w-full w-full mb-4 lg:hidden"
                style="padding-bottom: 56.25%"
              >
                <iframe
                  class="absolute top-0 left-0 w-full h-full"
                  :src="`https://www.youtube-nocookie.com/embed/${videoId(movie.watch.url)}?&amp;controls=0`"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>

              <!-- Genres -->
              <p class="px-2 mb-3 font-bold text-xl">
                {{ movie.year }} •
                <span
                  v-for="(genre, i) in movie.genres"
                  :key="genre"
                >
                  {{ genre }}{{ i < movie.genres.length - 1 ? ', ' : '' }}
                </span>
              </p>

              <p class="px-4 mb-3 text-justify text-lg text-gray-200 italic">{{ movie.description }}</p>

              <!-- Actors -->
              <p class="px-2 font-bold text-lg">
                <span
                  v-for="(actor, i) in movie.actors"
                  :key="actor"
                >
                  {{ actor }}{{ i < movie.actors.length - 1 ? ', ' : '' }}
                </span>
              </p>
            </div>

            <!-- Open/Close (desktop) -->
            <div class="hidden lg:block grow-0 text-center text-lg font-bold">
              <button @click="toggleMoviePage">
                <span v-if="isFullPage">
                  <span class="border-b">See less</span> <Chevron direction="right" />
                </span>

                <span v-else>
                  <Chevron direction="left" /> <span class="border-b">See more</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Right (desktop) -->
          <div :class="{ '!lg:w-0 lg:overflow-y-hidden': !isFullPage, 'lg:w-1/2': isFullPage }">
            <!-- Full movie (free movie) - Mobile -->
            <div
              class="relative h-0 overflow-hidden max-w-full w-full mb-2 hidden lg:block"
              style="padding-bottom: 56.25%"
            >
              <iframe
                class="absolute top-0 left-0 w-full h-full"
                :src="`https://www.youtube-nocookie.com/embed/${videoId(movie.watch ? movie.watch.url : movie.trailer.url)}`"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
            </div>

            <!-- Reviews -->
            <TheReviews :movie-id="movie.id" />
          </div>
        </div>

        <div
          v-if="!isFullPage"
          class="self-center lg:hidden"
        >
          <button @click="toggleMoviePage">
            <Chevron
              direction="up"
              :size="45"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies.js';
import Chevron from '@/components/ui/TheChevron.vue';
import TheReviews from '@/components/layout/TheReviews.vue';

const props = defineProps(['movie']);
const movie = props.movie;

const router = useRouter();
const movies = useMoviesStore();

const movieDescription = ref(null);
const isFullPage = ref(false);

onBeforeMount(() => {
  if (!movies.decade) {
    movies.decade = Math.floor(parseInt(movie.year) / 10) * 10;
    document.getElementById(movies.decade).scrollIntoView();
  }

  if (window.location.pathname.slice(0, 2) === '/m') {
    isFullPage.value = true;
  }
});

async function toggleMoviePage() {
  if (isFullPage.value) {
    isFullPage.value = false;
    movieDescription.value.scrollTo({ top: 0, smooth: true });
    window.history.pushState({}, '', `/`);

    if (!movies.movies.length) {
      movies.movies.unshift(movie);
      await movies.fetchMovies();
    }

    setTimeout(() => router.push('/'), 210);
  } else {
    window.history.pushState({}, '', `/m/${movie.slug}`);
    isFullPage.value = true;
  }
}

const videoId = (url) => {
  let id = url.split('v=')[1];

  const ampersandPosition = id.indexOf('&');
  if (ampersandPosition !== -1) {
    id = id.substring(0, ampersandPosition);
  }

  return id;
};
</script>
