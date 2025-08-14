import axios from 'axios';

// Default to '/api/v1' so Nginx can proxy to backend in Docker;
// allow override via env for local dev.
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const api = axios.create({ baseURL });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.detail || err.message || 'Request failed';
    console.error('API error:', msg);
    return Promise.reject(err);
  }
);

