<template>
  <div
    class="flex overflow-hidden min-h-full touch-none"
    ref="movieView"
    @wheel="scroll"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <div
      class="flex flex-col min-w-full"
      v-for="movie in movies.movies"
      :key="movie.slug"
    >
      <TheMovie :movie="movie" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useMoviesStore } from '@/stores/movies.js';
import TheMovie from '@/components/TheMovie.vue';

const movies = useMoviesStore();
const movieView = ref(null);
let elementInViewPort = null;

function setElementInViewport() {
  for (const childDiv of movieView.value.children) {
    const rect = childDiv.getBoundingClientRect();
    if (rect.x < movieView.value.offsetWidth) {
      elementInViewPort = childDiv;
    }
  }
}

// Find out which movie is currently in view
onMounted(async () => {
  setElementInViewport();

  const observer = new MutationObserver(() => {
    setElementInViewport();
  });
  observer.observe(movieView.value, { childList: true, subtree: true });
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
  if (window.location.pathname !== '/') {
    return;
  }

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
  if (previousX !== 0 && window.location.pathname === '/') {
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