<template>
  <div class="mx-6 pt-6 lg:pt-0 border-t lg:border-0">
    <h3 class="hidden lg:block font-bold text-main-red text-2xl">Reviews</h3>

    <p v-if="store.currentUser">
      <span
        class="border-b cursor-pointer text-lg"
        @click="showNewReviewModal = true"
      >
        Leave a review
      </span>
    </p>

    <p v-else>
      <span
        class="border-b cursor-pointer text-lg"
        @click="store.showLogin = true;"
      >
        Log in to leave a review
      </span>
    </p>

    <div class="mt-4">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="mb-4 text-justify"
      >
        <p class="text-main-red text-lg">{{ review.user.username }}</p>
        <p class="break-words">{{ review.review }}</p>
      </div>
    </div>
  </div>

  <NewReviewWindow
    :show="showNewReviewModal"
    @close="showNewReviewModal = false"
    @new-review="getReviews"
    :movie-id="movieId"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMoviesStore } from '@/stores/movies.js';
import NewReviewWindow from '@/components/layout/windows/NewReviewWindow.vue';

const props = defineProps({
  movieId: {
    type: String,
    required: false,
  },
});
const store = useMoviesStore();

const showNewReviewModal = ref(false);
let reviews = ref([]);

async function getReviews() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews?from=0&count=100&movieId=${props.movieId}`);
  reviews.value = await response.json();
}

onMounted(() => {
  getReviews();
});
</script>