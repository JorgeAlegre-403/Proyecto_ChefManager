import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PanelIngredientes } from '../components/PanelIngredientes';
import { PanelPlato } from '../components/PanelPlato';
import * as platoService from '../services/platoService';
import type { IngredienteDisponible, IngredientePlato } from '../types/plato';
import AppHeader from '../components/AppHeader';
import { LuArrowLeft, LuSave, LuCheck } from 'react-icons/lu';

export function GenerarPlatosPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const [ingredientes, setIngredientes] = useState<IngredienteDisponible[]>([]);
  const [loadingIngredientes, setLoadingIngredientes] = useState(true);

  const [nombrePlato, setNombrePlato] = useState('');
  const [descripcionPlato, setDescripcionPlato] = useState('');
  const [imagenPlato, setImagenPlato] = useState('');
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<
    IngredientePlato[]
  >([]);

  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cargandoEdicion, setCargandoEdicion] = useState(false);

  useEffect(() => {
    cargarIngredientes();
    if (editId) {
      cargarPlatoParaEditar(editId);
    }
  }, [editId]);

  const cargarIngredientes = async () => {
    setLoadingIngredientes(true);
    const resultado = await platoService.obtenerIngredientesDisponibles();
    if (resultado.success) {
      setIngredientes(resultado.data);
    } else {
      setMensajeError(resultado.error);
    }
    setLoadingIngredientes(false);
  };

  const cargarPlatoParaEditar = async (id: string) => {
    setCargandoEdicion(true);
    const resultado = await platoService.obtenerPlatoById(id);
    if (resultado.success) {
      const plato = resultado.data;
      setNombrePlato(plato.nombre);
      setDescripcionPlato(plato.descripcion);
      setImagenPlato(plato.imagen_url || '');
      setIngredientesSeleccionados(plato.ingredientes);
    } else {
      setMensajeError('No se pudo cargar el plato para editar');
    }
    setCargandoEdicion(false);
  };

  const handleAgregarIngrediente = (ingrediente: IngredienteDisponible) => {
    if (ingredientesSeleccionados.some((ing) => ing.id === ingrediente.id)) {
      setMensajeError(`${ingrediente.nombre} ya está agregado al plato`);
      return;
    }

    const nuevoIngrediente: IngredientePlato = {
      id: ingrediente.id,
      nombre: ingrediente.nombre,
      cantidad: 1,
      unidad_medida: ingrediente.unidad_medida || 'kg',
      cantidad_disponible: ingrediente.cantidad,
      unidad_medida_stock: ingrediente.unidad_medida,
      categoria: ingrediente.categoria,
    };

    setIngredientesSeleccionados([
      ...ingredientesSeleccionados,
      nuevoIngrediente,
    ]);

    setMensajeError('');
  };

  const handleRemoverIngrediente = (ingredienteId: string) => {
    setIngredientesSeleccionados(
      ingredientesSeleccionados.filter((ing) => ing.id !== ingredienteId)
    );
  };

  const handleCantidadChange = (ingredienteId: string, cantidad: number) => {
    setIngredientesSeleccionados(
      ingredientesSeleccionados.map((ing) =>
        ing.id === ingredienteId ? { ...ing, cantidad } : ing
      )
    );
  };

  const handleUnidadChange = (ingredienteId: string, unidad_medida: string) => {
    setIngredientesSeleccionados(
      ingredientesSeleccionados.map((ing) =>
        ing.id === ingredienteId ? { ...ing, unidad_medida } : ing
      )
    );
  };

  const handleGuardarPlato = async () => {
    setMensajeError('');
    setMensajeExito('');

    if (!nombrePlato.trim()) {
      setMensajeError('El nombre del plato es requerido');
      return;
    }

    if (ingredientesSeleccionados.length === 0) {
      setMensajeError('Debes agregar al menos un ingrediente al plato');
      return;
    }

    if (
      ingredientesSeleccionados.some((ing) => ing.cantidad <= 0)
    ) {
      setMensajeError('La cantidad de cada ingrediente debe ser mayor a 0');
      return;
    }

    // Nueva validación de stock antes de enviar al servidor
    for (const ing of ingredientesSeleccionados) {
      if (ing.cantidad_disponible !== undefined) {
        const cantidadNormalizada = platoService.normalizarCantidad(ing.cantidad, ing.unidad_medida);
        if (cantidadNormalizada > ing.cantidad_disponible) {
          const unidadBase = platoService.obtenerUnidadBase(ing.categoria, ing.unidad_medida_stock);
          setMensajeError(`No hay suficiente stock de ${ing.nombre}. Disponible: ${ing.cantidad_disponible} ${unidadBase}`);
          return;
        }
      }
    }

    setGuardando(true);

    const platoInput = {
      nombre: nombrePlato.trim(),
      descripcion: descripcionPlato.trim(),
      imagen_url: imagenPlato,
      ingredientes: ingredientesSeleccionados.map((ing) => ({
        ingrediente_id: ing.id,
        cantidad: ing.cantidad,
        unidad_medida: ing.unidad_medida,
      })),
    };

    let resultado;
    if (editId) {
      resultado = await platoService.actualizarPlato(editId, platoInput);
    } else {
      resultado = await platoService.crearPlato(platoInput);
    }

    setGuardando(false);

    if (resultado.success) {
      setMensajeExito(`Plato "${resultado.data.nombre}" ${editId ? 'actualizado' : 'creado'} exitosamente`);

      if (!editId) {
        setNombrePlato('');
        setDescripcionPlato('');
        setImagenPlato('');
        setIngredientesSeleccionados([]);
      }

      setTimeout(() => {
        setMensajeExito('');
      }, 2000);
    } else {
      setMensajeError(resultado.error);
    }
  };

  if (cargandoEdicion) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Cargando datos del plato...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/platos')}
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
          >
            <LuArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {editId ? 'Editar Plato' : 'Generar Nuevo Plato'}
          </h1>
        </div>

        {mensajeError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
            {mensajeError}
          </div>
        )}
        {mensajeExito && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm flex items-center gap-2">
            <LuCheck className="w-5 h-5" />
            {mensajeExito}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <PanelIngredientes
              ingredientes={ingredientes}
              onAgregarClick={handleAgregarIngrediente}
              isLoading={loadingIngredientes}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <PanelPlato
              nombrePlato={nombrePlato}
              descripcionPlato={descripcionPlato}
              imagenPlato={imagenPlato}
              ingredientesSeleccionados={ingredientesSeleccionados}
              onNombreChange={setNombrePlato}
              onDescripcionChange={setDescripcionPlato}
              onImagenChange={setImagenPlato}
              onRemoverIngrediente={handleRemoverIngrediente}
              onCantidadChange={handleCantidadChange}
              onUnidadChange={handleUnidadChange}
            />
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleGuardarPlato}
            disabled={guardando}
            className="flex items-center gap-2 px-10 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            {guardando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <LuSave className="w-5 h-5" />
                {editId ? 'Actualizar Plato' : 'Guardar Plato'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
