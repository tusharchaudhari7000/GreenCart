import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/authSlice';

// Create axios instance with base URL pointing to API Gateway
<<<<<<< HEAD
const getBaseURL = () => {
    if (process.env.REACT_APP_API_BASE_URL) {
        return process.env.REACT_APP_API_BASE_URL;
    }
    if (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return `${window.location.protocol}//${window.location.hostname}:8080`;
    }
    return 'http://localhost:8080';
};

const api = axios.create({
    baseURL: getBaseURL(),
=======
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
>>>>>>> 1fdb9a5 (feat: Fix API gateway routing for admin service, resolve EF Core mapping errors, implement forgot password workflow, and fix session persistence on refresh)
    withCredentials: true
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        let token = state.auth?.token;
        let tokenExpiry = state.auth?.tokenExpiry;

        // Fallback to localStorage if state doesn't have token
        if (!token) {
            try {
                const savedState = localStorage.getItem('authState');
                if (savedState) {
                    const parsed = JSON.parse(savedState);
                    token = parsed?.token;
                    tokenExpiry = parsed?.tokenExpiry;
                }
            } catch (e) {
                console.error("Error reading token from storage", e);
            }
        }

        // Check if token is expired
        if (tokenExpiry && Date.now() > tokenExpiry) {
            console.warn('⚠️ Token expired, clearing session...');
            localStorage.removeItem('authState');
            store.dispatch(logout());
            return Promise.reject(new Error('Token expired'));
        }

        // Add token to Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('❌ 401 Unauthorized - Token invalid or expired');
            localStorage.removeItem('authState');
        }
        return Promise.reject(error);
    }
);

export default api;
