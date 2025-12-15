// src/pages/InmobilarioFormPage.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useInmobilario } from '../context/InmobilarioContext';

function InmobilarioFormPage() {
  const {
    createInmobilario,
    getInmobilario,
    updateInmobilario,
    updateInmobilarioNoUpdateImage,
    errors,
    loading,
  } = useInmobilario();

  const [currentImage, setCurrentImage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm();

  const navigate = useNavigate();
  const params = useParams();
  const isEdit = Boolean(params.id);

  // Cargar datos cuando se edita
  useEffect(() => {
    const loadInmo = async () => {
      if (isEdit) {
        const data = await getInmobilario(params.id);
        setValue('titulo', data.titulo);
        setValue('descripcion', data.descripcion);
        setValue('direccion', data.direccion);
        setValue('precio', data.precio);
        setValue('tipo', data.tipo);
        setValue('modalidad', data.modalidad);
        setValue('estado', data.estado);
        setCurrentImage(data.image || '');
      }
    };
    loadInmo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, params.id]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (isEdit) {
        const hasNewImage = values.image && values.image.length > 0;

        if (hasNewImage) {
          // EDITAR CAMBIANDO IMAGEN (Cloudinary)
          const formData = new FormData();
          formData.append('titulo', values.titulo);
          formData.append('descripcion', values.descripcion);
          formData.append('direccion', values.direccion);
          formData.append('precio', values.precio);
          formData.append('tipo', values.tipo || '');
          formData.append('modalidad', values.modalidad || '');
          formData.append('estado', values.estado || '');
          formData.append('image', values.image[0]);

          await updateInmobilario(params.id, formData);
        } else {
          // EDITAR SIN CAMBIAR IMAGEN (JSON)
          const payload = {
            titulo: values.titulo,
            descripcion: values.descripcion,
            direccion: values.direccion,
            precio: values.precio,
            tipo: values.tipo || '',
            modalidad: values.modalidad || '',
            estado: values.estado || '',
          };

          await updateInmobilarioNoUpdateImage(params.id, payload);
        }
      } else {
        // CREAR (imagen obligatoria, Cloudinary)
        const formData = new FormData();
        formData.append('titulo', values.titulo);
        formData.append('descripcion', values.descripcion);
        formData.append('direccion', values.direccion);
        formData.append('precio', values.precio);
        formData.append('tipo', values.tipo || '');
        formData.append('modalidad', values.modalidad || '');
        formData.append('estado', values.estado || '');

        if (!values.image || values.image.length === 0) {
          throw new Error('La imagen es obligatoria');
        }

        formData.append('image', values.image[0]);

        await createInmobilario(formData);
      }

      navigate('/inmobilarios');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-8 px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {isEdit ? 'Editar inmueble' : 'Agregar inmueble'}
        </h1>

        {/* Errores del contexto */}
        {errors.length > 0 && (
          <div className="mb-4">
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

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              {...register('titulo', { required: 'El título es obligatorio' })}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.titulo && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.titulo.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              rows="3"
              {...register('descripcion', {
                required: 'La descripción es obligatoria',
              })}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
            {formErrors.descripcion && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.descripcion.message}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              {...register('direccion', {
                required: 'La dirección es obligatoria',
              })}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.direccion && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.direccion.message}
              </p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              {...register('precio', { required: 'El precio es obligatorio' })}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formErrors.precio && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.precio.message}
              </p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo (casa, departamento, etc.)
            </label>
            <input
              type="text"
              {...register('tipo')}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Modalidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad (venta, renta)
            </label>
            <input
              type="text"
              {...register('modalidad')}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado (disponible, apartado)
            </label>
            <input
              type="text"
              {...register('estado')}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen del inmueble
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image', {
                validate: (value) => {
                  if (!isEdit && (!value || value.length === 0)) {
                    return 'La imagen es obligatoria';
                  }
                  return true;
                },
              })}
              className="w-full text-sm text-gray-900
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-600 file:text-white
                         hover:file:bg-indigo-700
                         cursor-pointer"
            />
            {formErrors.image && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.image.message}
              </p>
            )}

            {isEdit && currentImage && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Imagen actual:
                </p>
                <img
                  src={currentImage}
                  alt="Imagen actual"
                  className="h-24 w-auto rounded-md border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si no seleccionas una nueva imagen, se mantendrá la actual.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 rounded-md bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading
              ? 'Guardando...'
              : isEdit
              ? 'Guardar cambios'
              : 'Crear inmueble'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InmobilarioFormPage;
