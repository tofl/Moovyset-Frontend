<template>
  <Teleport to="#app">
    <dialog
      v-if="show"
      open
      class="fixed top-0 left-0 z-50 flex flex-col w-screen h-screen bg-main-dark text-white"
    >
      <div class="mx-3 sm:mx-6 mt-2">
        <div class="flex justify-between text-main-red font-bold">
          <h2 class="text-3xl">
            <slot name="header"></slot>
          </h2>

          <div>
            <CloseButton
              class="cursor-pointer"
              @click="$emit('close')"
            />
          </div>
        </div>
      </div>

      <slot name="default"></slot>
    </dialog>
  </Teleport>
</template>

<script setup>
import CloseButton from '@/components/ui/CloseButton.vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['close']);
</script>