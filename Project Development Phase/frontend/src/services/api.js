import axios from "axios";

const api = axios.create({
    baseURL: "https://ai-powered-debt-relief-financial-3z1x.onrender.com"
});

// Request interceptor: attach JWT token from localStorage or sessionStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
// Only redirect if we're NOT on the login or register page
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath === "/" || currentPath === "/register";

            if (!isAuthPage) {
                // Session expired — clear both storages and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;