import { useEffect, useState } from "react";
import { useInmobilario } from "../context/InmobilarioContext";
import { Link } from "react-router";


function CatalogPage() {
  const { publicInmobilarios, getInmobilariosPublic } = useInmobilario();

  const [filters, setFilters] = useState({
    search: "",
    modalidad: "",
    tipo: "",
    minPrecio: "",
    maxPrecio: "",
  });

  useEffect(() => {
    // Cargar catálogo al entrar
    getInmobilariosPublic();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    getInmobilariosPublic(filters);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Catálogo de inmuebles</h1>

      {/* Filtros */}
      <form
        onSubmit={handleFilterSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-zinc-800 p-4 rounded-md"
      >
        <input
          type="text"
          name="search"
          placeholder="Buscar por título o dirección"
          value={filters.search}
          onChange={handleChange}
          className="px-3 py-2 rounded-md bg-zinc-900 text-sm outline-none"
        />

        <select
          name="modalidad"
          value={filters.modalidad}
          onChange={handleChange}
          className="px-3 py-2 rounded-md bg-zinc-900 text-sm outline-none"
        >
          <option value="">Modalidad</option>
          <option value="renta">Renta</option>
          <option value="venta">Venta</option>
        </select>

        <input
          type="text"
          name="tipo"
          placeholder="Tipo (Casa, Depto...)"
          value={filters.tipo}
          onChange={handleChange}
          className="px-3 py-2 rounded-md bg-zinc-900 text-sm outline-none"
        />

        <input
          type="number"
          name="minPrecio"
          placeholder="Precio mínimo"
          value={filters.minPrecio}
          onChange={handleChange}
          className="px-3 py-2 rounded-md bg-zinc-900 text-sm outline-none"
        />

        <input
          type="number"
          name="maxPrecio"
          placeholder="Precio máximo"
          value={filters.maxPrecio}
          onChange={handleChange}
          className="px-3 py-2 rounded-md bg-zinc-900 text-sm outline-none"
        />

        <button
          type="submit"
          className="md:col-span-5 bg-emerald-600 hover:bg-emerald-700 transition-colors px-4 py-2 rounded-md font-semibold text-sm"
        >
          Aplicar filtros
        </button>
      </form>

      {/* Listado */}
      {publicInmobilarios.length === 0 ? (
        <p className="text-center text-gray-400">
          No hay inmuebles disponibles con los filtros seleccionados.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicInmobilarios.map((inm) => (
            <div
              key={inm._id}
              className="bg-zinc-800 rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              {inm.image && (
                <img
                  src={inm.image.secure_url || inm.image.url || inm.image}
                  alt={inm.titulo}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4 flex flex-col gap-2 flex-1">
                <h2 className="font-semibold text-lg">{inm.titulo}</h2>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {inm.descripcion}
                </p>
                <p className="text-sm text-gray-400">{inm.direccion}</p>

<div className="flex justify-between items-center mt-2 text-sm">
  <div className="flex flex-col">
    <span className="font-bold">
      ${Number(inm.precio).toLocaleString()}
    </span>

    <Link
      to={`/inmueble/${inm._id}`}
      className="text-xs text-emerald-400 hover:underline mt-1"
    >
      Ver detalles
    </Link>
  </div>

  <span className="px-2 py-1 rounded-full text-xs bg-zinc-900 uppercase">
    {inm.modalidad}
  </span>
</div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
