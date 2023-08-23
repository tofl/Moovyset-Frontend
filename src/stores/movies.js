import { defineStore } from 'pinia';

export const useMoviesStore = defineStore('movies', {
    state: () => ({
        from: 0,
        decade: null,
        movies: [],
    }),

    actions: {
        async fetchMovies() {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/movies?from=${this.from}&count=10&decade=${this.decade}`,
            );
            const body = await response.json();
            this.movies.push(body);
        },
    },
});