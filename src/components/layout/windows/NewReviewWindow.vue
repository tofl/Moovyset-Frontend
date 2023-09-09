<template>
  <TheModal
    :show="show"
    @close="$emit('close')"
  >
    <template #default>
      <div
        v-if="!reviewSent"
        class="grow flex flex-col justify-center w-3/4 lg:w-1/2 mx-auto transform -translate-y-1/4"
      >
        <h3 class="mb-6 text-4xl font-bold text-main-red">Log in</h3>

        <form @submit.prevent="submit">
          <p class="mb-6">
            <textarea
              class="w-full p-2 h-24 max-h-56 rounded text-lg text-main-dark"
              placeholder="Leave a review"
              v-model="review"
            ></textarea>
            <span
              v-if="fieldErrors && fieldErrors.review"
              class="text-main-red"
            >
              {{ fieldErrors.review }}
            </span>
          </p>

          <p class="text-right">
            <input
              type="submit"
              value="Submit"
              class="bg-white h-7 sm:h-8 px-2 rounded text-lg text-main-dark cursor-pointer"
            />
          </p>
        </form>
      </div>

      <div
        v-else
        class="flex flex-col justify-center text-center grow self-center text-4xl"
      >
        <p>Thanks for leaving a review!</p>
      </div>
    </template>
  </TheModal>
</template>

<script setup>
import { ref } from 'vue';
import TheModal from '@/components/layout/TheModal.vue';
import { useMoviesStore } from '@/stores/movies.js';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close', 'newReview']);

const store = useMoviesStore();

const review = ref('');
const reviewSent = ref(false);
const fieldErrors = ref(null);
const error = ref(null);

async function submit() {
  const requestBody = JSON.stringify({
    review: review.value,
    userId: store.currentUser.id,
    movieId: props.movieId,
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/reviews`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: requestBody,
    },
  );

  const body = await response.json();

  if (response.status === 200) {
    fieldErrors.value = null;
  } else if (response.status === 400) {
    fieldErrors.value = {};
    body.forEach(e => fieldErrors.value[e.field] = e.message);
    return;
  }

  reviewSent.value = true;
  emit('newReview');

  if (!error.value) {
    setTimeout(() => {
      emit('close');
      review.value = '';
      reviewSent.value = false;
    }, 2000);
  }
}
</script>