import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as platoService from '../services/platoService';
import type { Plato } from '../types/plato';
import AppHeader from '../components/AppHeader';
import { LuPlus, LuPencil, LuTrash2, LuEye, LuX, LuInfo, LuTriangleAlert } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlatosPage() {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [platoVerIngredientes, setPlatoVerIngredientes] = useState<Plato | null>(null);
  const [idPlatoAEliminar, setIdPlatoAEliminar] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPlatos();
  }, []);

  const cargarPlatos = async () => {
    setLoading(true);
    const resultado = await platoService.obtenerPlatos();
    if (resultado.success) {
      setPlatos(resultado.data);
    }
    setLoading(false);
  };

  const handleEliminarPlato = async () => {
    if (!idPlatoAEliminar) return;

    const resultado = await platoService.eliminarPlato(idPlatoAEliminar);
    if (resultado.success) {
      setMensaje({ texto: 'Plato eliminado exitosamente', tipo: 'success' });
      cargarPlatos();
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } else {
      setMensaje({ texto: resultado.error, tipo: 'error' });
    }
    setIdPlatoAEliminar(null);
  };

  const handleEditarPlato = (platoId: string) => {
    navigate(`/generar-platos?edit=${platoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Platos Guardados</h1>
            <p className="text-gray-500 mt-1">Gestiona tus recetas y consulta sus ingredientes</p>
          </div>
          <button
            onClick={() => navigate('/generar-platos')}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-orange-600/20"
          >
            <LuPlus className="w-5 h-5" />
            Nuevo Plato
          </button>
        </div>

        {mensaje.texto && (
          <div className={`mb-6 p-4 rounded-xl border ${mensaje.tipo === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
            {mensaje.texto}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              Cargando platos...
            </div>
          ) : platos.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No se han encontrado platos creados.</p>
              <button
                onClick={() => navigate('/generar-platos')}
                className="mt-4 text-orange-600 font-medium hover:underline"
              >
                Crea tu primer plato aquí
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ingredientes</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {platos.map((plato) => (
                    <tr key={plato.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{plato.nombre}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{plato.descripcion || 'Sin descripción'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setPlatoVerIngredientes(plato)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg text-xs font-bold transition-colors group"
                        >
                          <LuEye className="w-3.5 h-3.5" />
                          Ver {plato.ingredientes.length} ingredientes
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditarPlato(plato.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <LuPencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setIdPlatoAEliminar(plato.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <LuTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Ingredientes */}
      <AnimatePresence>
        {platoVerIngredientes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50/30">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{platoVerIngredientes.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Lista de ingredientes necesarios</p>
                </div>
                <button
                  onClick={() => setPlatoVerIngredientes(null)}
                  className="p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <LuX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {platoVerIngredientes.ingredientes.length > 0 ? (
                    platoVerIngredientes.ingredientes.map((ing, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-800">{ing.nombre}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-sm font-bold text-orange-600">
                            {ing.cantidad}
                          </span>
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {ing.unidad_medida}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <LuInfo className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Este plato no tiene ingredientes registrados.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => setPlatoVerIngredientes(null)}
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                  >
                    Cerrar ventana
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {idPlatoAEliminar && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-red-100"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                  <LuTriangleAlert className="w-10 h-10" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
                <p className="text-gray-500 mb-8 px-2">
                  Esta acción eliminará el plato de forma permanente. No podrás recuperar esta receta después.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleEliminarPlato}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
                  >
                    Sí, eliminar plato
                  </button>
                  <button
                    onClick={() => setIdPlatoAEliminar(null)}
                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    No, mantener plato
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
