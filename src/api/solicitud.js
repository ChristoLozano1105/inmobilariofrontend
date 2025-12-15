import axiosInstance from './axiosInstance';

export const getMisSolicitudesRequest = () => axiosInstance.get("/solicitudes/mias");

export const cancelarSolicitudRequest = (id) =>
  axiosInstance.patch(`/solicitudes/${id}/cancelar`);

export const createSolicitudForInmobilarioRequest = (inmobilarioId) =>
  axiosInstance.post(`/inmobilario/${inmobilarioId}/solicitudes`);

// Admin: ver todas
export const getSolicitudesAllRequest = () => axiosInstance.get("/solicitudes/all");

// Admin: aprobar
export const aprobarSolicitudRequest = (id) =>
  axiosInstance.patch(`/solicitudes/${id}/aprobar`);

export const cancelarSolicitudAdminRequest = (id) =>
  axiosInstance.patch(`/solicitudes/${id}/cancelar-admin`);


