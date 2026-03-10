import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000') + '/api';

export const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export function withUser(email: string) {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': email,
        },
    });
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    return instance;
}
