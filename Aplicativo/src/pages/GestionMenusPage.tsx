import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuChevronLeft, LuCalendar, LuCircleCheck, LuExternalLink, LuTrash2, LuChefHat, LuTriangleAlert, LuPencil, LuBan } from 'react-icons/lu'
import { obtenerMenus, activarMenu, eliminarMenu, desactivarMenu } from '../services/menuService'
import type { Menu } from '../types/menu'
import AppHeader from '../components/AppHeader'
import { motion, AnimatePresence } from 'framer-motion'

export default function GestionMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuAEliminar, setMenuAEliminar] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const navigate = useNavigate()

  const cargarMenus = async () => {
    setLoading(true)
    const result = await obtenerMenus()
    if (result.success) {
      setMenus(result.data || [])
    } else {
      setError(result.error || 'Error al cargar menús')
    }
    setLoading(false)
  }

  useEffect(() => {
    cargarMenus()
  }, [])

  const handleActivar = async (id: string) => {
    const result = await activarMenu(id)
    if (result.success) {
      setMensaje({ texto: 'Menú diario actualizado correctamente', tipo: 'success' })
      cargarMenus()
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000)
    } else {
      setMensaje({ texto: 'Error al activar menú: ' + result.error, tipo: 'error' })
    }
  }

  const handleConfirmarEliminar = async () => {
    if (!menuAEliminar) return
    const result = await eliminarMenu(menuAEliminar)
    if (result.success) {
      setMensaje({ texto: 'Menú eliminado correctamente', tipo: 'success' })
      cargarMenus()
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000)
    } else {
      setMensaje({ texto: 'Error al eliminar menú: ' + result.error, tipo: 'error' })
    }
    setMenuAEliminar(null)
  }

  const handleEditar = (id: string) => {
    navigate(`/generar-menus?edit=${id}`)
  }

  const handleDesactivar = async (id: string) => {
    const result = await desactivarMenu(id)
    if (result.success) {
      setMensaje({ texto: 'Menú desactivado correctamente', tipo: 'success' })
      cargarMenus()
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000)
    } else {
      setMensaje({ texto: 'Error al desactivar menú: ' + result.error, tipo: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
              <LuChevronLeft className="mr-1" /> Volver
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Gestión de Menús</h1>
            <p className="text-slate-500 text-sm md:text-base">Administra tus menús y selecciona cuál mostrar a tus clientes.</p>
          </div>

          <button
            onClick={() => navigate('/generar-menus')}
            className="px-4 py-2.5 md:px-6 md:py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center gap-2"
            style={{ fontSize: '14px', flexShrink: 0 }}
          >
            <LuChefHat size={18} /> Crear Menú
          </button>
        </div>

        {mensaje.texto && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border ${
              mensaje.tipo === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {mensaje.texto}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        ) : menus.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuChefHat size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No hay menús creados</h3>
            <p className="text-slate-500 mb-6">Empieza creando tu primer menú para poder activarlo como menú diario.</p>
            <button
              onClick={() => navigate('/generar-menus')}
              className="text-orange-500 font-semibold hover:underline"
            >
              Crear mi primer menú &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className={`group bg-white rounded-2xl border-2 transition-all overflow-hidden shadow-sm hover:shadow-md ${menu.activo
                  ? 'border-orange-500 ring-4 ring-orange-50'
                  : 'border-slate-100 hover:border-slate-200'
                  }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${menu.activo
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-slate-100 text-slate-500'
                      }`}>
                      {menu.activo ? 'Menú Diario Activo' : 'Borrador'}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditar(menu.id)}
                        className="text-slate-300 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                        title="Editar menú"
                      >
                        <LuPencil size={18} />
                      </button>
                      <button
                        onClick={() => setMenuAEliminar(menu.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Eliminar menú"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {menu.nombre}
                  </h3>

                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <LuCalendar size={14} className="mr-1" />
                    {new Date(menu.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-medium text-slate-700">Contenido del menú:</div>
                    <div className="flex flex-wrap gap-2">
                      {menu.platos.slice(0, 3).map((plato, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md border border-slate-100">
                          {plato.nombre}
                        </span>
                      ))}
                      {menu.platos.length > 3 && (
                        <span className="text-slate-400 text-xs flex items-center">
                          +{menu.platos.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!menu.activo ? (
                      <button
                        onClick={() => handleActivar(menu.id)}
                        className="flex-grow py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <LuCircleCheck size={18} /> Activar como Diario
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDesactivar(menu.id)}
                        className="flex-grow py-2.5 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        title="Hacer clic para desactivar"
                      >
                        <LuBan size={18} /> Desactivar
                      </button>
                    )}

                    <a
                      href="/menu-diario"
                      target="_blank"
                      className="p-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Ver vista pública"
                    >
                      <LuExternalLink size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {menuAEliminar && (
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
                  Esta acción eliminará el menú de forma permanente. No podrás recuperar estos datos después.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConfirmarEliminar}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
                  >
                    Sí, eliminar menú
                  </button>
                  <button
                    onClick={() => setMenuAEliminar(null)}
                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    No, mantener menú
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
