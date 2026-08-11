import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
    withCredentials: true,
})

// Intercept 401s to clear stale auth state gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)
