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
        <div>
          <h3 class="mb-6 text-4xl font-bold text-main-red">Sign up</h3>

          <form @submit.prevent="submit">
            <div class="flex flex-col sm:flex-row mb-6">
              <p class="grow sm:pr-1 mb-6 sm:mb-0">
                <input
                  type="text"
                  v-model="firstname"
                  placeholder="Firstname"
                  class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
                />
                <span
                  v-if="error && error.firstname"
                  class="text-main-red"
                >
                {{ error.firstname }}
              </span>
              </p>
              <p class="grow sm:pl-1">
                <input
                  type="text"
                  v-model="lastname"
                  placeholder="Lastname"
                  class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
                />
                <span
                  v-if="error && error.lastname"
                  class="text-main-red"
                >
                {{ error.lastname }}
              </span>
              </p>
            </div>

            <p class="mb-6">
              <input
                type="text"
                v-model="username"
                placeholder="Username"
                class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
              />
              <span
                v-if="error && error.username"
                class="text-main-red"
              >
                {{ error.username }}
              </span>
            </p>

            <p class="mb-6">
              <input
                type="email"
                v-model="email"
                placeholder="Email address"
                class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
              />
              <span
                v-if="error && error.email"
                class="text-main-red"
              >
                {{ error.email }}
              </span>
            </p>

            <p class="mb-6">
              <input
                type="password"
                v-model="password"
                placeholder="Password"
                class="w-full h-7 sm:h-8 lg:h-9 px-2 rounded text-lg text-main-dark"
              />
              <span
                v-if="error && error.password"
                class="text-main-red"
              >
                {{ error.password }}
              </span>
            </p>

            <p class="text-right">
              <span
                v-if="httpStatus === 403 && error"
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

const firstname = ref('');
const lastname = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const httpStatus = ref(0);
const error = ref(null);

async function submit() {
  const e = await store.signup(firstname.value, lastname.value, username.value, email.value, password.value);

  if (!e) {
    setTimeout(() => emit('close'), 2000);
    firstname.value = '';
    lastname.value = '';
    username.value = '';
    email.value = '';
    password.value = '';
  } else if (e.status === 400) {
    httpStatus.value = e.status;
    error.value = {};
    e.errors.forEach(err => error.value[err.field] = err.message);
  } else {
    httpStatus.value = e.status;
    error.value = e.errors;
  }
}
</script>