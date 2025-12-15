import axios from './axiosInstance';

//request para registrar usuarios
export const registerRequest = user =>axios.post('/register', user);
//request para iniciar sesion
export const loginRequst = user => axios.post('/login', user);

// para salir
export const logoutRequest = () => axios.post("/logout");

// para mantener sesión (si tu ruta es /verify)
export const verifyTokenRequest = () => axios.get("/profile");