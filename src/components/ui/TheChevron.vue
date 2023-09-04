<template>
  <svg class="fill-white inline" :class="[rotation]" xmlns="http://www.w3.org/2000/svg" :height="size" :width="size" viewBox="0 -960 960 960">
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  direction: {
    type: String,
    default: 'right',
  },
  size: {
    type: Number,
    default: 30,
  },
});

const rotation = computed(() => {
  if (props.direction === 'up') { return '-rotate-90' }
  else if (props.direction === 'down') { return 'rotate-90' }
  else if (props.direction === 'left') { return 'rotate-180' }
  return 'rotate-0';
});
</script>