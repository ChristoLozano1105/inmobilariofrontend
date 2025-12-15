import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // o "react-router-dom"
import { getInmobilarioPublicByIdRequest } from "../api/inmobilario";
import { useAuth } from "../context/AuthContext";
import { useSolicitud } from "../context/SolicitudContext";

function InmuebleDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { crearSolicitudParaInmobilario, loading, errors } = useSolicitud();

  const [inmueble, setInmueble] = useState(null);
  const [loadingInmueble, setLoadingInmueble] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar los datos del inmueble al entrar
  useEffect(() => {
    const loadInmueble = async () => {
      try {
        const res = await getInmobilarioPublicByIdRequest(id);
        setInmueble(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInmueble(false);
      }
    };

    loadInmueble();
  }, [id]);

  const handleApartar = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setSuccessMsg("");

      // Crear la solicitud en el backend
      const data = await crearSolicitudParaInmobilario(inmueble._id);

      // Si el backend regresa el inmueble actualizado, úsalo
      const updatedInmueble = data.inmobilario || data.inmueble || null;
      if (updatedInmueble) {
        setInmueble(updatedInmueble);
      } else {
        // Fallback: al menos marcarlo como Ocupado en el estado local
        setInmueble({ ...inmueble, estado: "Ocupado" });
      }

      setSuccessMsg("Solicitud creada correctamente");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // El contexto ya llenó `errors`, aquí solo quitamos el mensaje de éxito
      setSuccessMsg("");
    }
  };

  if (loadingInmueble) {
    return <div className="p-4">Cargando inmueble...</div>;
  }

  if (!inmueble) {
    return <div className="p-4">Inmueble no encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg">
        {inmueble.image && (
          <img
            src={
              inmueble.image.secure_url ||
              inmueble.image.url ||
              inmueble.image
            }
            alt={inmueble.titulo}
            className="w-full h-72 object-cover"
          />
        )}

        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{inmueble.titulo}</h1>

          <p className="text-gray-300">{inmueble.descripcion}</p>

          <div className="text-sm text-gray-400 space-y-1">
            <p>{inmueble.direccion}</p>
            <p>
              Tipo: {inmueble.tipo} · Modalidad: {inmueble.modalidad}
            </p>
          </div>

          <p className="text-xl font-bold">
            ${Number(inmueble.precio).toLocaleString()}
          </p>

          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-zinc-900 text-xs">
              Estado: {inmueble.estado}
            </span>

            <button
              disabled={loading || inmueble.estado !== "Disponible"}
              onClick={handleApartar}
              className={`px-4 py-2 rounded-md font-semibold text-sm ${
                inmueble.estado !== "Disponible"
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {inmueble.estado !== "Disponible"
                ? "No disponible"
                : loading
                ? "Procesando..."
                : "Apartar inmueble"}
            </button>
          </div>

          {/* Errores al crear la solicitud */}
          {errors && errors.length > 0 && (
            <div className="text-red-400 text-sm mt-2">
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}

          {/* Mensaje de éxito SOLO en este inmueble */}
          {successMsg && (
            <div className="text-emerald-400 text-sm mt-2">
              {successMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InmuebleDetallePage;
