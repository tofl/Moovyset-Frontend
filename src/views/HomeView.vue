<template>
  <div
    class="flex bg-amber-200 overflow-hidden min-h-full touch-none"
    ref="movieView"
    @wheel="scroll"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <div
      class="min-w-full"
      v-for="movie in movies.movies"
      :key="movie.slug"
    >
      {{ movie.name }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMoviesStore } from '@/stores/movies.js';

const movies = useMoviesStore();
const movieView = ref(null);
let elementInViewPort = ref(null);

// Find out which film is currently in view
onMounted(() => {
  const observer = new MutationObserver(() => {
    for (const childDiv of movieView.value.children) {
      const rect = childDiv.getBoundingClientRect();
      if (rect.x < movieView.value.offsetWidth) {
        elementInViewPort = childDiv;
      }
    }
  });
  observer.observe(movieView.value, { childList: true });
});

function shiftScreen(direction) {
  if (direction === 'left' && elementInViewPort.previousSibling && elementInViewPort.previousSibling.nodeType === 1) {
    elementInViewPort.previousSibling.scrollIntoView({ behavior: 'smooth', block: 'start' });
    elementInViewPort = elementInViewPort.previousSibling;
  } else if (direction === 'right' && elementInViewPort.nextSibling && elementInViewPort.nextSibling.nodeType === 1) {
    elementInViewPort.nextSibling.scrollIntoView({ behavior: 'smooth', block: 'start' });
    elementInViewPort = elementInViewPort.nextSibling;
  }
}

// Handle scroll
let scrollHasOccurred = false;
let lastDeltaY = 0;
let lastPositiveScrollEvent = Date.now() - 1000;
function scroll(e) {
  if (lastDeltaY - e.deltaY < 0 && !scrollHasOccurred && Date.now() - lastPositiveScrollEvent > 600) {
    const scrollDirection = e.deltaY < 0 ? 'left' : 'right';
    shiftScreen(scrollDirection);

    scrollHasOccurred = true;
    lastPositiveScrollEvent = Date.now();
  }

  if (lastDeltaY - e.deltaY > 0) {
    scrollHasOccurred = false;
  }

  lastDeltaY = e.deltaY;

  e.preventDefault();
}

// Handle swipe (mobile)
let totalScroll = 0;
let previousX = 0;

// Shift the screen as the user swipes with his finger
function touchMove(e) {
  if (previousX !== 0) {
    const x = Math.floor(previousX - e.changedTouches[0].clientX);
    totalScroll += x;
    movieView.value.scrollLeft += x;
  }

  previousX = e.changedTouches[0].clientX;
}

// Ran when the user lifts his finger up
function touchEnd() {
  if (totalScroll > -30 && totalScroll < 30) {
    elementInViewPort.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    const direction = totalScroll < 0 ? 'left' : 'right';
    shiftScreen(direction);
  }
  totalScroll = 0;
  previousX = 0;
}
</script>