import axios from 'axios';

const baseURL = 'http://localhost:4000/api';

export const api = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
});

export function withUser(email: string) {
    return axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': email,
        },
    });
}
