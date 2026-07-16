import axios from "axios";

const adminApi = axios.create({

    baseURL: "http://localhost:8081/api/admin",

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

export default adminApi;