import axiosInstance from './axiosInstance';

// Obtener inmuebles del usuario
export const getInmobilariosRequest = () =>
  axiosInstance.get('/inmobilario');

// Crear inmueble (con imagen - Cloudinary)
export const createInmobilarioRequest = (formData) =>
  axiosInstance.post('/inmobilario', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Obtener un inmueble
export const getInmobilarioRequest = (id) =>
  axiosInstance.get(`/inmobilario/${id}`);

// actualizar SIN cambiar imagen
export const updateInmobilarioRequestNoUpdateImage = (id, inmobilario) =>
  axiosInstance.put(`/inmobilario/noimage/${id}`, inmobilario);

// actualizar CAMBIANDO imagen (Cloudinary)
export const updateInmobilarioRequest = (id, formData) =>
  axiosInstance.put(`/inmobilario/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Eliminar
export const deleteInmobilarioRequest = (id) =>
  axiosInstance.delete(`/inmobilario/${id}`);

// NUEVA petición para catálogo público
export const getInmobilariosPublicRequest = (params) =>
  axiosInstance.get("/inmobilario/public", { params });

export const getInmobilarioPublicByIdRequest = (id) =>
  axiosInstance.get(`/inmobilario/public/${id}`);
