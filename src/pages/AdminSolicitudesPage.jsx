import { useEffect } from "react";
import { useSolicitud } from "../context/SolicitudContext";

function AdminSolicitudesPage() {
  const {
    solicitudesAll,
    getSolicitudesAll,
    aprobarSolicitud,
    cancelarSolicitudAdmin,
    loading,
    errors,
  } = useSolicitud();

  useEffect(() => {
    getSolicitudesAll();
  }, []);

  const handleAprobar = async (id, estado) => {
    if (estado !== "Pendiente") return;

    const ok = confirm("¿Aprobar esta solicitud? El inmueble quedará Ocupado.");
    if (!ok) return;

    await aprobarSolicitud(id);
  };

  const handleCancelar = async (id, estado) => {
    if (estado !== "Pendiente") return;

    const ok = confirm(
      "¿Cancelar esta solicitud? El inmueble volverá a estar Disponible."
    );
    if (!ok) return;

    await cancelarSolicitudAdmin(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Solicitudes (Admin)</h1>

      {loading && <p className="text-gray-300">Cargando...</p>}

      {errors?.length > 0 && (
        <div className="text-red-400 text-sm mb-4">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      {solicitudesAll.length === 0 ? (
        <p className="text-gray-400">No hay solicitudes.</p>
      ) : (
        <div className="space-y-3">
          {solicitudesAll.map((s) => (
            <div
              key={s._id}
              className="bg-zinc-800 rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                <div>
                  <p className="font-semibold">
                    {s.inmobilario?.titulo || "Inmueble"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {s.inmobilario?.direccion || "-"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Usuario: {s.usuario?.email || s.usuario?.correo || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fecha:{" "}
                    {s.fechaSolicitud
                      ? new Date(s.fechaSolicitud).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span className="px-3 py-1 rounded-full text-xs bg-zinc-900">
                    {s.estadoSolicitud}
                  </span>

                  <button
                    onClick={() => handleAprobar(s._id, s.estadoSolicitud)}
                    disabled={loading || s.estadoSolicitud !== "Pendiente"}
                    className={`px-3 py-2 rounded-md text-sm font-semibold ${
                      s.estadoSolicitud !== "Pendiente"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() => handleCancelar(s._id, s.estadoSolicitud)}
                    disabled={loading || s.estadoSolicitud !== "Pendiente"}
                    className={`px-3 py-2 rounded-md text-sm font-semibold ${
                      s.estadoSolicitud !== "Pendiente"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              {s.inmobilario?.image && (
                <img
                  src={
                    s.inmobilario.image.secure_url ||
                    s.inmobilario.image.url ||
                    s.inmobilario.image
                  }
                  alt={s.inmobilario?.titulo}
                  className="w-full max-h-56 object-cover rounded-md"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminSolicitudesPage;
