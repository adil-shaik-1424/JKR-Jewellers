import axios from "axios";

const adminApi = axios.create({

    baseURL: `${import.meta.env.VITE_API_BASE_URL}/admin`,

    headers: {
        "Content-Type": "application/json",
    }

});

adminApi.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

adminApi.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401 || error.response?.status === 403) {

            localStorage.removeItem("token");
            localStorage.removeItem("adminEmail");
            localStorage.removeItem("adminRole");

            window.location.href = "/admin/login";

        } else if (!error.response) {

            // network error / no response — tab idle for a long time, dropped connection, CORS, etc.
            console.error("Admin API network error or no response:", error.message);

        }

        return Promise.reject(error);

    }

);

export default adminApi;