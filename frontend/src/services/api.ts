import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';
import { getData } from '../offline/offlineStorage';

// Update this with your computer's IP address for mobile testing
// For mobile devices, use your computer's IP address instead of localhost
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.7:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await getData(STORAGE_KEYS.USER_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error for debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });

        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - could trigger logout
                    console.warn('Unauthorized access - token may be invalid');
                    break;
                case 403:
                    console.warn('Forbidden - insufficient permissions');
                    break;
                case 404:
                    console.warn('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
            }

            // Return formatted error
            return Promise.reject({
                message: data?.message || 'An error occurred',
                status,
                data
            });
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'Network error - please check your connection',
                isNetworkError: true
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An unexpected error occurred'
            });
        }
    }
);

export default api;
