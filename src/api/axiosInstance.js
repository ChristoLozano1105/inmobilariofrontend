import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});

// ✅ Interceptor: adjunta token en cada request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // <-- usa la MISMA key que guardas
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
