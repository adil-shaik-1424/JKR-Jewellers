import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

const PUBLIC_PREFIXES = ["/auth", "/products", "/categories", "/banners"];

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const isPublic = PUBLIC_PREFIXES.some((prefix) =>
            config.url.startsWith(prefix)
        );
        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            window.location.href = "/login";
        } else if (!error.response) {
            // network error / no response — tab idle for a long time, dropped connection, CORS, etc.
            console.error("API network error or no response:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;