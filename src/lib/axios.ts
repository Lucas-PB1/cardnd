import axios from 'axios';

/**
 * Configured axios instance for API requests.
 */
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
