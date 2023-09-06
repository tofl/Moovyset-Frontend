<template>
  <TheModal
    :show="show"
    @close="$emit('close')"
  >
    <template #default>
      <div
        v-if="!store.currentUser"
        class="grow flex flex-col justify-center w-3/4 lg:w-1/2 mx-auto transform -translate-y-1/4"
      >
        <h3 class="mb-6 text-4xl font-bold text-main-red">Log in</h3>

        <form @submit.prevent="submit">
          <p class="mb-6">
            <input
              type="text"
              v-model="identifier"
              placeholder="Username or email"
              class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
            />
          </p>
          <p class="mb-6">
            <input
              type="password"
              v-model="password"
              placeholder="Password"
              class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
            />
          </p>
          <p class="text-right">
            <span
              v-if="error"
              class="mr-4 text-main-red"
            >
              {{ error[0].message }}
            </span>

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
        <p>
          Welcome, <span class="text-main-red">{{ store.currentUser.username }}</span>!
        </p>
      </div>
    </template>
  </TheModal>
</template>

<script setup>
import { ref } from 'vue';
import TheModal from '@/components/layout/TheModal.vue';
import { useMoviesStore } from '@/stores/movies.js';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close']);

const store = useMoviesStore();

const identifier = ref('');
const password = ref('');
const error = ref(null);

async function submit() {
  error.value = await store.login(identifier.value, password.value);

  if (!error.value) {
    setTimeout(() => emit('close'), 2000);
  }
}
</script>