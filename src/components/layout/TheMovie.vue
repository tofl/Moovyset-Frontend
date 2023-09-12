<template>
  <div
    class="flex flex-col-reverse lg:flex-row h-screen z-10 bg-no-repeat bg-cover"
    :style="`background-image: url('${props.movie.posterUrl}'); height: 100svh`"
  >
    <div
      class="hidden lg:block duration-200 ease-out bg-no-repeat bg-cover"
      :class="{ 'grow-0': isFullPage, 'grow': !isFullPage }"
      :style="`background-image: url('${props.movie.posterUrl}')`"
    >
    </div>

    <div
      class="h-[50vh] pb-16 pt-16 lg:w-1/2 lg:h-screen text-gray-200 duration-200 ease-out"
      :class="{ 'grow bg-main-dark': isFullPage, 'custom-movie-bg lg:bg-main-dark': !isFullPage }"
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
            class="lg:w-1/2 flex flex-col lg:sticky top-0"
            :class="{ 'lg:w-full': !isFullPage }"
          >
            <div class="grow lg:w-3/4 lg:mx-auto overflow-y-scroll">
              <!-- [FREE] Movie name -->
              <h2
                class="px-6 lg:px-0 text-4xl font-bold text-main-red"
                :class="{ 'mb-4': movie.freeToWatch, 'mb-2': !movie.freeToWatch, 'cursor-pointer': !isFullPage }"
                @click="toggleFromMovieName"
              >
                  <span
                    v-if="movie.freeToWatch"
                    class="mr-2 px-3 pb-0.5 bg-gray-100 text-main-dark font-bold relative bottom-1 text-xl rounded"
                  >
                    Free
                </span>
                {{ props.movie.name }}
              </h2>
              <h3
                v-if="!movie.freeToWatch"
                class="px-6 lg:px-0 mb-4 underline"
              >
                <a
                  :href="movie.purchase.url"
                  target="_blank"
                >
                  Rent or buy
                </a>
              </h3>

              <!-- Full movie (free movie) - Mobile -->
              <div
                v-if="isFullPage && props.movie.freeToWatch"
                class="relative h-0 overflow-hidden max-w-full w-full mb-4 lg:hidden"
                style="padding-bottom: 56.25%"
              >
                <iframe
                  class="absolute top-0 left-0 w-full h-full"
                  :src="`https://www.youtube-nocookie.com/embed/${videoId(props.movie.watch.url)}?&amp;controls=0`"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>

              <!-- Genres -->
              <p class="px-6 lg:px-0 mb-3 font-bold text-xl">
                {{ props.movie.year }} |
                <span
                  v-for="(genre, i) in props.movie.genres"
                  :key="genre"
                >
                  {{ genre }}{{ i < props.movie.genres.length - 1 ? ', ' : '' }}
                </span>
              </p>

              <p class="px-8 lg:px-0 mb-3 text-justify text-lg text-gray-300 italic">{{ props.movie.description }}</p>

              <!-- Actors -->
              <p class="px-6 mb-6 lg:px-0 font-bold text-lg">
                <span
                  v-for="(actor, i) in props.movie.actors"
                  :key="actor"
                >
                  {{ actor }}{{ i < props.movie.actors.length - 1 ? ', ' : '' }}
                </span>
              </p>
            </div>

            <!-- Open/Close (desktop) -->
            <div class="hidden lg:block text-center text-lg font-bold">
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
          <div :class="{ 'lg:w-0 lg:overflow-y-hidden': !isFullPage, 'lg:w-1/2': isFullPage }">
            <!-- Full movie (free movie) - Mobile -->
            <div class="px-6">
              <div
                class="relative h-0 overflow-hidden max-w-full w-full mb-2 hidden lg:block"
                style="padding-bottom: 56.25%"
              >
                <iframe
                  class="absolute top-0 left-0 w-full h-full"
                  :src="`https://www.youtube-nocookie.com/embed/${videoId(props.movie.watch ? props.movie.watch.url : props.movie.trailer.url)}`"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <!-- Reviews -->
            <TheReviews :movie-id="props.movie.id" />
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
import { onBeforeMount, onUpdated, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies.js';
import Chevron from '@/components/ui/TheChevron.vue';
import TheReviews from '@/components/layout/TheReviews.vue';

const props = defineProps(['movie']);

const router = useRouter();
const store = useMoviesStore();

const movieDescription = ref(null);
const isFullPage = ref(false);

onBeforeMount(() => {
  if (!store.decade) {
    store.decade = Math.floor(parseInt(props.movie.year) / 10) * 10;
    document.getElementById(store.decade).scrollIntoView();
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

    if (!store.movies.length) {
      store.movies.unshift(props.movie);
      await store.fetchMovies();
    }

    setTimeout(() => router.push('/'), 210);
  } else {
    window.history.pushState({}, '', `/m/${props.movie.slug}`);
    isFullPage.value = true;
  }
}

function toggleFromMovieName() {
  if (!isFullPage.value) {
    toggleMoviePage();
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