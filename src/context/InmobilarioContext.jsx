// src/context/InmobilarioContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getInmobilariosRequest,
  createInmobilarioRequest,
  deleteInmobilarioRequest,
  getInmobilarioRequest,
  updateInmobilarioRequest,
  updateInmobilarioRequestNoUpdateImage,
  getInmobilariosPublicRequest
} from '../api/inmobilario';

const InmobilarioContext = createContext();

// Hook para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useInmobilario = () => {
  const context = useContext(InmobilarioContext);
  if (!context) {
    throw new Error(
      'useInmobilario debe usarse dentro de InmobilarioProvider'
    );
  }
  return context;
};

export const InmobilarioProvider = ({ children }) => {
  const [inmobilarios, setInmobilarios] = useState([]);
  const [publicInmobilarios, setPublicInmobilarios] = useState([]); // Cliente
  const [selectedInmobilario, setSelectedInmobilario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // limpia mensajes de error después de 4s
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const normalizeError = (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Error inesperado';
    return Array.isArray(msg) ? msg : [msg];
  };

  // Obtener inmuebles del usuario autenticado
  const getInmobilarios = async () => {
    try {
      setLoading(true);
      const res = await getInmobilariosRequest();
      setInmobilarios(res.data);
    } catch (error) {
      console.error(error);
      setErrors(normalizeError(error));
    } finally {
      setLoading(false);
    }
  };

  // Crear inmueble (con imagen → Cloudinary)
  const createInmobilario = async (formData) => {
    try {
      setLoading(true);
      const res = await createInmobilarioRequest(formData);
      setInmobilarios((prev) => [...prev, res.data]);
      return res;
    } catch (error) {
      console.error(error);
      setErrors(normalizeError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener un inmueble por id
  const getInmobilario = async (id) => {
    try {
      setLoading(true);
      const res = await getInmobilarioRequest(id);
      setSelectedInmobilario(res.data);
      return res.data;
    } catch (error) {
      console.error(error);
      setErrors(normalizeError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar SIN cambiar la imagen (JSON)
  const updateInmobilarioNoUpdateImage = async (id, data) => {
    try {
      setLoading(true);
      const res = await updateInmobilarioRequestNoUpdateImage(id, data);

      setInmobilarios((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );

      return res;
    } catch (error) {
      console.error(error);
      setErrors(normalizeError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar CAMBIANDO la imagen (FormData + Cloudinary)
  const updateInmobilario = async (id, formData) => {
    try {
      setLoading(true);
      const res = await updateInmobilarioRequest(id, formData);

      setInmobilarios((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );

      return res;
    } catch (error) {
      console.error(error);
      setErrors(normalizeError(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInmobilariosPublic = async (filters = {}) => {
    try {
      const res = await getInmobilariosPublicRequest(filters);
      setPublicInmobilarios(res.data);
    } catch (error) {
      console.error(error);
      setErrors(error.response?.data || ["Error al obtener catálogo de inmuebles"]);
    }
  };

  // Eliminar inmueble
  const deleteInmobilario = async (id) => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este inmueble?'
    );
    if (!confirmar) return;

    try {
      setLoading(true);
      await deleteInmobilarioRequest(id);
      setInmobilarios((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      setErrors(normalizeError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <InmobilarioContext.Provider
      value={{
        inmobilarios,
        selectedInmobilario,
        loading,
        errors,
        getInmobilarios,
        createInmobilario,
        getInmobilario,
        updateInmobilario,             
        updateInmobilarioNoUpdateImage, 
        deleteInmobilario,
        
        getInmobilariosPublic,
        publicInmobilarios
      }}
    >
      {children}
    </InmobilarioContext.Provider>
  );
};
