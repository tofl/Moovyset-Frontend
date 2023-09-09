<template>
  <TheModal
    :show="show"
    @close="$emit('close')"
  >
    <template #header>My profile</template>

    <template #default>
      <div class="px-6 lg:px-12 mt-12 overflow-y-scroll">
        <div class="flex flex-col xl:flex-row items-start">
          <div class="flex justify-evenly w-full mb-6 xl:mr-4">
            <div class="mr-4">
              <img
                class="rounded-full"
                :src="profileWindowUser.gravatar"
                :alt="profileWindowUser.username"
              />
            </div>
            <div class="flex flex-col justify-evenly">
              <p
                class="text-3xl"
                v-if="profileWindowUser.firstname && profileWindowUser.lastname"
              >
                {{ profileWindowUser.firstname }} {{ profileWindowUser.lastname }}
              </p>

              <p class="text-xl">@{{ profileWindowUser.username }}</p>

              <p
                class="text-xl"
                v-if="profileWindowUser.email"
              >
                {{ profileWindowUser.email }}
              </p>
            </div>
          </div>

          <div class="w-full break-words">
            <h3 class="text-2xl mb-4 font-bold text-main-red">Reviews</h3>

            <div v-if="reviews">
              <div
                v-for="r in reviews"
                class="mb-8"
              >
                <p
                  class="text-main-red cursor-pointer"
                  @click="gotoMovie(r.movie.slug)"
                >
                  {{ r.movie.name }}
                </p>
                <p class="text-justify">{{ r.review }}</p>
              </div>
            </div>

            <p v-else>No reviews to show</p>
          </div>
        </div>
      </div>
    </template>
  </TheModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies.js';
import TheModal from '@/components/layout/TheModal.vue';

const store = useMoviesStore();
const { profileWindowUser } = storeToRefs(store);

const router = useRouter();

const reviews = ref(null);

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

watch(profileWindowUser, async () => {
  if (profileWindowUser) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reviews?from=0&count=100&userId=${profileWindowUser.value.id}`);
    reviews.value = await response.json();
  }
});

function gotoMovie(slug) {
  emit('close');
  router.push(`/m/${slug}`);
}
</script>