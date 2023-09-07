<template>
  <div class="fixed w-full z-40 text-main-red/90 pt-1 pb-2 select-none backdrop-brightness-50 bg-main-dark/30">
    <div class="container mx-auto px-4 sm:px-0">
      <div class="flex">
        <div class="grow-0">
          <TheBurger
            class="relative top-0.5 mr-2 sm:hidden cursor-pointer"
            @click="showMenu = !showMenu"
          />
        </div>

        <div class="grow flex flex-col sm:flex-row sm:justify-between relative top-1 sm:static sm:top-0">
          <h1 class="text-xl lg:text-2xl font-bold">Moovyset</h1>

          <div
            class="text-lg lg:text-xl sm:flex overflow-hidden sm:max-h-[400px] transition-[max-height] duration-500 ease-in-out"
            :class="{ 'max-h-[400px]': showMenu, 'max-h-0': !showMenu }"
          >
            <!-- Profile modal -->
            <div
              v-if="store.currentUser"
              class="sm:mr-6"
            >
              <button
                class="cursor-pointer"
                @click="showProfile = true"
              >
                Profile
              </button>
            </div>

            <!-- Log out modal -->
            <div v-if="store.currentUser">
              <button
                class="cursor-pointer"
                @click="store.logout"
              >
                Log out
              </button>
            </div>

            <!-- Login modal -->
            <div
              v-if="!store.currentUser"
              class="sm:mr-6"
            >
              <button
                class="cursor-pointer"
                @click="store.showLogin = true"
              >
                Login
              </button>
            </div>

            <!-- Sign up modal -->
            <div v-if="!store.currentUser">
              <button
                class="cursor-pointer"
                @click="showSignup = true"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LoginWindow
    :show="store.showLogin"
    @close="store.showLogin = false"
  />

  <SignupWindow
    :show="showSignup"
    @close="showSignup = false"
  />
</template>

<script setup>
import { ref } from 'vue';
import TheBurger from '@/components/ui/TheBurger.vue';
import LoginWindow from '@/components/layout/windows/LoginWindow.vue';
import SignupWindow from '@/components/layout/windows/SignupWindow.vue';
import { useMoviesStore } from '@/stores/movies.js';

const showMenu = ref(false);
const showSignup = ref(false);
const showProfile = ref(false);

const store = useMoviesStore();
</script>