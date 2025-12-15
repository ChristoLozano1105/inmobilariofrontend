import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // 🔥 DEBUG: para comprobar que SI está leyendo token
  console.log("[AXIOS]", config.method?.toUpperCase(), config.url, "token:", token);

  if (token) config.headers.Authorization = `Bearer ${token}`;

  // 🔥 DEBUG: para comprobar que SI lo mete al header
  console.log("[AXIOS] Authorization:", config.headers.Authorization);

  return config;
});

export default instance;
