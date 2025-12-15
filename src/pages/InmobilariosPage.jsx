// src/pages/InmobilariosPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInmobilario } from '../context/InmobilarioContext';
import { useAuth } from '../context/AuthContext';

function InmobilariosPage() {
  const {
    inmobilarios,
    loading,
    errors,
    getInmobilarios,
    deleteInmobilario,
  } = useInmobilario();

  const { isAdmin } = useAuth(); 

  useEffect(() => {
    getInmobilarios();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Mis inmuebles
        </h1>

        {/* BOTONES ADMIN */}
        <div className="flex gap-2">
          {/* Agregar inmueble */}
          <Link
            to="/add-inmobilario"
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            + Agregar inmueble
          </Link>

          {/* Ver solicitudes (solo admin) */}
          {isAdmin && (
            <Link
              to="/admin/solicitudes"
              className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Ver solicitudes
            </Link>
          )}
        </div>
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <div className="w-full max-w-5xl mb-4">
          {errors.map((err, idx) => (
            <div
              key={idx}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-sm"
            >
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Contenido */}
      <div className="w-full max-w-5xl">
        {loading ? (
          <p className="text-gray-600">Cargando inmuebles...</p>
        ) : inmobilarios.length === 0 ? (
          <p className="text-gray-600">
            Aún no tienes inmuebles registrados.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inmobilarios.map((inmo) => (
              <div
                key={inmo._id}
                className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                {inmo.image && (
                  <img
                    src={inmo.image}
                    alt={inmo.titulo}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {inmo.titulo}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {inmo.direccion}
                  </p>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                    {inmo.descripcion}
                  </p>
                  <p className="text-indigo-600 font-bold mb-2">
                    ${inmo.precio}
                  </p>
                  <div className="mt-auto flex justify-between items-center gap-2">
                    <Link
                      to={`/inmobilario/${inmo._id}`}
                      className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteInmobilario(inmo._id)}
                      className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InmobilariosPage;
