import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PanelIngredientes } from '../components/PanelIngredientes';
import { PanelPlato } from '../components/PanelPlato';
import * as platoService from '../services/platoService';
import type { IngredienteDisponible, IngredientePlato } from '../types/plato';
import AppHeader from '../components/AppHeader';
import { LuArrowLeft, LuSave, LuCheck, LuSparkles, LuX } from 'react-icons/lu';
import { sugerirPlatosPorIngredientes } from '../services/aiService';

export function GenerarPlatosPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const [ingredientes, setIngredientes] = useState<IngredienteDisponible[]>([]);
  const [loadingIngredientes, setLoadingIngredientes] = useState(true);
  const [nombrePlato, setNombrePlato] = useState('');
  const [descripcionPlato, setDescripcionPlato] = useState('');
  const [imagenPlato, setImagenPlato] = useState('');
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<IngredientePlato[]>([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cargandoEdicion, setCargandoEdicion] = useState(false);

  // Estados para la IA
  const [sugerenciaIA, setSugerenciaIA] = useState<any>(null);
  const [cargandoIA, setCargandoIA] = useState(false);
  const [mostrarModalIA, setMostrarModalIA] = useState(false);
  const [platosAñadidosIA, setPlatosAñadidosIA] = useState<number[]>([]);
  const [guardandoPlatoIA, setGuardandoPlatoIA] = useState<number | null>(null);

  useEffect(() => {
    cargarIngredientes();
    if (editId) cargarPlatoParaEditar(editId);
  }, [editId]);

  const cargarIngredientes = async () => {
    setLoadingIngredientes(true);
    const resultado = await platoService.obtenerIngredientesDisponibles();
    if (resultado.success) setIngredientes(resultado.data);
    else setMensajeError(resultado.error);
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
    setIngredientesSeleccionados([...ingredientesSeleccionados, nuevoIngrediente]);
    setMensajeError('');
  };

  const handleRemoverIngrediente = (ingredienteId: string) =>
    setIngredientesSeleccionados(ingredientesSeleccionados.filter((ing) => ing.id !== ingredienteId));

  const handleCantidadChange = (ingredienteId: string, cantidad: number) =>
    setIngredientesSeleccionados(ingredientesSeleccionados.map((ing) => ing.id === ingredienteId ? { ...ing, cantidad } : ing));

  const handleUnidadChange = (ingredienteId: string, unidad_medida: string) =>
    setIngredientesSeleccionados(ingredientesSeleccionados.map((ing) => ing.id === ingredienteId ? { ...ing, unidad_medida } : ing));

  const handleGuardarPlato = async () => {
    setMensajeError('');
    setMensajeExito('');
    if (!nombrePlato.trim()) { setMensajeError('El nombre del plato es requerido'); return; }
    if (ingredientesSeleccionados.length === 0) { setMensajeError('Debes agregar al menos un ingrediente al plato'); return; }
    if (ingredientesSeleccionados.some((ing) => ing.cantidad <= 0)) { setMensajeError('La cantidad de cada ingrediente debe ser mayor a 0'); return; }

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

    const resultado = editId
      ? await platoService.actualizarPlato(editId, platoInput)
      : await platoService.crearPlato(platoInput);

    setGuardando(false);

    if (resultado.success) {
      setMensajeExito(`Plato "${resultado.data.nombre}" ${editId ? 'actualizado' : 'creado'} exitosamente`);
      if (!editId) {
        setNombrePlato('');
        setDescripcionPlato('');
        setImagenPlato('');
        setIngredientesSeleccionados([]);
      }
      setTimeout(() => setMensajeExito(''), 2000);
    } else {
      setMensajeError(resultado.error);
    }
  };

  const handlePedirSugerenciaIA = async () => {
    setCargandoIA(true);
    setMostrarModalIA(true);
    setPlatosAñadidosIA([]); // Reiniciar añadidos al pedir nuevas sugerencias
    // Filtrar ingredientes que tienen cantidad mayor a 0 para pasarlos a la IA
    // Añadimos la unidad de medida para que la IA sepa en qué basar sus números
    const ingredientesDisponibles = ingredientes
      .filter(ing => ing.cantidad > 0)
      .map(ing => `${ing.nombre} (${ing.unidad_medida || 'unidades'})`);
      
    const resultado = await sugerirPlatosPorIngredientes(ingredientesDisponibles);
    
    if (resultado.success) {
      try {
        // Limpiamos el texto por si la IA devuelve etiquetas markdown o espacios
        const jsonStr = (resultado.data || '').replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);
        setSugerenciaIA(data);
      } catch (e) {
        setSugerenciaIA({ error: 'La respuesta no tiene el formato correcto.', raw: resultado.data });
      }
    } else {
      setSugerenciaIA({ error: resultado.error });
    }
    setCargandoIA(false);
  };

  const handleGuardarPlatoIA = async (plato: any, index: number) => {
    setGuardandoPlatoIA(index);
    
    // Si la IA detecta que faltan ingredientes, lo añadimos a la descripción como nota
    let descFinal = plato.descripcion;
    if (plato.faltan && plato.faltan.length > 0) {
      descFinal += `\n\nFaltan ingredientes: ${plato.faltan.join(', ')}`;
    }

    // Vincular los ingredientes que usó la IA con los de tu inventario
    const ingredientesParaGuardar: any[] = [];
    if (plato.ingredientes_usados && Array.isArray(plato.ingredientes_usados)) {
      plato.ingredientes_usados.forEach((item: any) => {
        // Soporte por si la IA devuelve un string antiguo o el nuevo objeto con cantidad
        const nombreUsado = typeof item === 'string' ? item : (item.nombre || '');
        const cantidadUsada = typeof item === 'string' ? 1 : (Number(item.cantidad) || 1);

        // Buscamos ignorando mayúsculas y espacios
        const encontrado = ingredientes.find(ing => 
          ing.nombre.toLowerCase().trim() === nombreUsado.toLowerCase().trim()
        );
        if (encontrado) {
          ingredientesParaGuardar.push({
            ingrediente_id: encontrado.id,
            cantidad: cantidadUsada, // Ya usamos la cantidad proporcionada por la IA
            unidad_medida: encontrado.unidad_medida || 'unidades'
          });
        }
      });
    }

    const resultado = await platoService.crearPlato({
      nombre: plato.nombre,
      descripcion: descFinal,
      ingredientes: ingredientesParaGuardar
    });

    if (resultado.success) {
      setPlatosAñadidosIA(prev => [...prev, index]);
    } else {
      alert("Error al guardar: " + resultado.error);
    }
    setGuardandoPlatoIA(null);
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
      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/platos')}
              className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm flex-shrink-0"
            >
              <LuArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {editId ? 'Editar Plato' : 'Generar Nuevo Plato'}
            </h1>
          </div>
          
          {/* Botón de IA */}
          <button
            onClick={handlePedirSugerenciaIA}
            disabled={loadingIngredientes || ingredientes.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuSparkles className="w-5 h-5" />
            Sugerencias con IA
          </button>
        </div>

        {mensajeError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">{mensajeError}</div>
        )}
        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm flex items-center gap-2">
            <LuCheck className="w-5 h-5" />
            {mensajeExito}
          </div>
        )}

        {/* Paneles: apilados en móvil, 2 columnas en desktop */}
        <div className="generar-platos-grid" style={{ display: 'grid', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <PanelIngredientes
              ingredientes={ingredientes}
              onAgregarClick={handleAgregarIngrediente}
              isLoading={loadingIngredientes}
            />
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
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

        {/* Botón guardar */}
        <div className="flex justify-center pb-6">
          <button
            onClick={handleGuardarPlato}
            disabled={guardando}
            className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/25 active:scale-[0.98]"
            style={{ width: '100%', maxWidth: '400px', justifyContent: 'center', fontSize: '16px' }}
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

      {/* Modal de IA */}
      {mostrarModalIA && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-purple-100">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                <LuSparkles className="w-6 h-6 text-purple-600" />
                Sugerencias del Chef IA
              </h3>
              <button 
                onClick={() => setMostrarModalIA(false)}
                className="p-2 hover:bg-white rounded-full text-gray-500 hover:text-gray-800 transition-colors"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto flex-grow bg-gray-50/50">
              {cargandoIA ? (
                <div className="flex flex-col items-center justify-center py-12 text-indigo-600">
                  <LuSparkles className="w-12 h-12 animate-pulse mb-4 text-purple-500" />
                  <p className="font-medium animate-pulse text-lg">Analizando tu inventario y creando recetas...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sugerenciaIA?.error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                      <p className="font-semibold">{sugerenciaIA.error}</p>
                      {sugerenciaIA.raw && <pre className="mt-2 text-xs opacity-70 bg-white p-2 rounded">{sugerenciaIA.raw}</pre>}
                    </div>
                  ) : sugerenciaIA?.platos ? (
                    sugerenciaIA.platos.map((plato: any, idx: number) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                        
                        <div className="pl-4">
                          <div className="flex justify-between items-start gap-4 mb-1">
                            <h4 className="text-lg font-bold text-gray-800">{plato.nombre}</h4>
                            <button
                              onClick={() => handleGuardarPlatoIA(plato, idx)}
                              disabled={platosAñadidosIA.includes(idx) || guardandoPlatoIA === idx}
                              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                platosAñadidosIA.includes(idx) 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 active:scale-95'
                              }`}
                            >
                              {platosAñadidosIA.includes(idx) ? (
                                <span className="flex items-center gap-1"><LuCheck className="w-3.5 h-3.5" /> Añadido</span>
                              ) : guardandoPlatoIA === idx ? (
                                'Guardando...'
                              ) : (
                                '+ Añadir'
                              )}
                            </button>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed pr-2">{plato.descripcion}</p>
                          
                          {plato.faltan && plato.faltan.length > 0 ? (
                            <div>
                              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1.5 block">Ingredientes faltantes:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {plato.faltan.map((f: string, i: number) => (
                                  <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium border border-orange-100">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100">
                                <LuCheck className="w-3.5 h-3.5" /> Tienes todo lo necesario
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : null}
                </div>
              )}
            </div>
            
            <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex justify-end">
              <button
                onClick={() => setMostrarModalIA(false)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .generar-platos-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 767px) {
          .generar-platos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
