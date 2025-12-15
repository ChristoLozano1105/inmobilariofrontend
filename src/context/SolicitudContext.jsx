import { createContext, useContext, useState } from "react";
import {
  createSolicitudForInmobilarioRequest,
  getMisSolicitudesRequest,
  cancelarSolicitudRequest,
  cancelarSolicitudAdminRequest,
  getSolicitudesAllRequest,
  aprobarSolicitudRequest,
} from "/api/solicitud";

const SolicitudContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSolicitud = () => {
  const context = useContext(SolicitudContext);
  if (!context) throw new Error("useSolicitud debe usarse dentro de SolicitudProvider");
  return context;
};

export function SolicitudProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  //user
  const [misSolicitudes, setMisSolicitudes] = useState([]);

  //admin
    const [solicitudesAll, setSolicitudesAll] = useState([]);

  const crearSolicitudParaInmobilario = async (inmobilarioId) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await createSolicitudForInmobilarioRequest(inmobilarioId);
      return res.data;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || ["Error al crear la solicitud"];
      setErrors(Array.isArray(msg) ? msg : [msg.message || msg]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMisSolicitudes = async () => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await getMisSolicitudesRequest();
      setMisSolicitudes(res.data);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || ["Error al obtener solicitudes"];
      setErrors(Array.isArray(msg) ? msg : [msg.message || msg]);
    } finally {
      setLoading(false);
    }
  };

  const cancelarSolicitud = async (solicitudId) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await cancelarSolicitudRequest(solicitudId);

      // Refrescar lista local
      setMisSolicitudes((prev) =>
        prev.map((s) => (s._id === solicitudId ? res.data : s))
      );

      return res.data;
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || ["Error al cancelar la solicitud"];
      setErrors(Array.isArray(msg) ? msg : [msg.message || msg]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

    // obtener todas
  const getSolicitudesAll = async () => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await getSolicitudesAllRequest();
      setSolicitudesAll(res.data);
    } catch (error) {
      const msg = error.response?.data || ["Error al obtener solicitudes (admin)"];
      setErrors(Array.isArray(msg) ? msg : [msg.message || msg]);
    } finally {
      setLoading(false);
    }
  };

  //  aprobar
  const aprobarSolicitud = async (id) => {
    try {
      setLoading(true);
      setErrors([]);
      const res = await aprobarSolicitudRequest(id);

      // refrescar lista (o actualizar local)
      await getSolicitudesAll();

      return res.data;
    } catch (error) {
      const msg = error.response?.data || ["Error al aprobar solicitud"];
      setErrors(Array.isArray(msg) ? msg : [msg.message || msg]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelarSolicitudAdmin = async (id) => {
  try {
    setLoading(true);
    setErrors([]);
    const res = await cancelarSolicitudAdminRequest(id);
    await getSolicitudesAll();
    return res.data;
  } catch (error) {
    const msg = error.response?.data || ["Error al cancelar solicitud (admin)"];
    setErrors(Array.isArray(msg) ? msg : [msg.message || msg]);
    throw error;
  } finally {
    setLoading(false);
  }
};


  return (
    <SolicitudContext.Provider
      value={{
        loading,
        errors,

        //user
        misSolicitudes,
        crearSolicitudParaInmobilario,
        getMisSolicitudes,
        cancelarSolicitud,

        //admin
        solicitudesAll,
        getSolicitudesAll,
        aprobarSolicitud,
        cancelarSolicitudAdmin
      }}
    >
      {children}
    </SolicitudContext.Provider>
  );
}
