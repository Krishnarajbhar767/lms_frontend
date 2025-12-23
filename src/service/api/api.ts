import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AuthEndpoints } from '../endpoints';

// Create default axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If no response or not 401, reject immediately
        if (!error.response || error.response.status !== 401 || !originalRequest) {
            return Promise.reject(error);
        }

        // Prevent infinite loops and unnecessary retries
        // Don't retry if:
        // 1. It's already a retry
        // 2. The request was for login, register, or refresh (these shouldn't trigger a refresh)
        const isAuthEndpoint = [
            AuthEndpoints.login,
            AuthEndpoints.register,
            AuthEndpoints.refresh
        ].includes(originalRequest.url || '');

        if (originalRequest._retry || isAuthEndpoint) {
            // If the refresh token request itself failed, force logout
            if (originalRequest.url === AuthEndpoints.refresh) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // Attempt to refresh the token
            const response = await axiosInstance.post(AuthEndpoints.refresh);
            const newToken = response.data?.data?.accessToken;

            if (newToken) {
                localStorage.setItem("token", newToken);
                // Update the header for the original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // Retry the original request
                return axiosInstance(originalRequest);
            }
        } catch (refreshError) {
            // If refresh fails, clear token and redirect
            localStorage.removeItem("token");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;


export type ApiResponse<T> = {
    data: T;
    message: string;
    success: boolean;
} 