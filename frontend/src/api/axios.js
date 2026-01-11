import axios from "axios";

const api = axios.create({
    // ✅ Use the full URL of your Spring Boot backend
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
});

export default api;