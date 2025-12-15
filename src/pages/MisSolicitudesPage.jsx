import { useEffect } from "react";
import { useSolicitud } from "../context/SolicitudContext";
//import { useNavigate } from "react-router";


function MisSolicitudesPage() {
  const { misSolicitudes, getMisSolicitudes, cancelarSolicitud, loading, errors } =
    useSolicitud();

  useEffect(() => {
    getMisSolicitudes();
  }, []);

  //const navigate = useNavigate();
  

const handleCancelar = async (id, estado) => {
  if (estado === "Cancelada" || estado === "Rechazada") return;

  const ok = confirm("¿Seguro que quieres cancelar esta solicitud?");
  if (!ok) return;

  await cancelarSolicitud(id);

};

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis solicitudes</h1>

      {loading && <p className="text-gray-300">Cargando...</p>}

      {errors?.length > 0 && (
        <div className="text-red-400 text-sm mb-4">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      {misSolicitudes.length === 0 ? (
        <p className="text-gray-400">No tienes solicitudes aún.</p>
      ) : (
        <div className="space-y-3">
          {misSolicitudes.map((s) => (
            <div
              key={s._id}
              className="bg-zinc-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="flex gap-3">
                {s.inmobilario?.image && (
                  <img
                    src={
                      s.inmobilario.image.secure_url ||
                      s.inmobilario.image.url ||
                      s.inmobilario.image
                    }
                    alt={s.inmobilario?.titulo}
                    className="w-24 h-16 object-cover rounded-md"
                  />
                )}

                <div>
                  <p className="font-semibold">{s.inmobilario?.titulo || "Inmueble"}</p>
                  <p className="text-sm text-gray-400">
                    {s.inmobilario?.direccion}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fecha: {s.fechaSolicitud ? new Date(s.fechaSolicitud).toLocaleString() : "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between md:justify-end">
                <span className="px-3 py-1 rounded-full text-xs bg-zinc-900">
                  {s.estadoSolicitud}
                </span>

                <button
                  onClick={() => handleCancelar(s._id, s.estadoSolicitud)}
                  disabled={loading || s.estadoSolicitud === "Cancelada" || s.estadoSolicitud === "Rechazada"}
                  className={`px-3 py-2 rounded-md text-sm font-semibold ${
                    s.estadoSolicitud === "Cancelada" || s.estadoSolicitud === "Rechazada"
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisSolicitudesPage;
