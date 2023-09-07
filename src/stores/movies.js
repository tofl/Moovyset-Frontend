import { defineStore } from 'pinia';

export const useMoviesStore = defineStore('movies', {
    state: () => ({
        from: 0,
        decade: null,
        movies: [],
        currentUser: null,
        showLogin: false,
    }),

    actions: {
        async fetchMovies() {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/movies?from=${this.from}&count=10&decade=${this.decade}`,
            );
            const body = await response.json();
            const slugs = this.movies.map(m => m.slug);
            body.forEach((m) => {
                if (!slugs.includes(m.slug)) {
                    this.movies.push(m);
                }
            });
        },

        async login(identifier, password) {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ identifier, password }),
                },
            );
            const body = await response.json();

            if (response.status === 200) {
                this.currentUser = body;
                return;
            }
            return body;
        },

        async signup(firstname, lastname, username, email, password) {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/signup`,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ firstname, lastname, username, email, password }),
                },
            );
            const body = await response.json();

            if (response.status === 200) {
                this.currentUser = body;
                return;
            }

            return { status: response.status, errors: body };
        },

        async getCurrentUser() {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/me`,
                {
                    method: 'get',
                    credentials: 'include',
                }
            );
            const body = await response.text();
            this.currentUser = body.length ? JSON.parse(body) : null;
        },

        async logout() {
            await fetch(
                `${import.meta.env.VITE_API_URL}/logout`,
                {
                    method: 'post',
                    credentials: 'include',
                },
            );
            this.currentUser = null;
        },
    },
});