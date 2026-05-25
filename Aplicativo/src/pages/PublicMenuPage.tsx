import { useEffect, useState } from 'react'
import { LuChefHat, LuInfo, LuCalendar, LuMapPin } from 'react-icons/lu'
import { obtenerMenuActivo } from '../services/menuService'
import type { Menu } from '../types/menu'

export default function PublicMenuPage() {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActiveMenu = async () => {
      const result = await obtenerMenuActivo()
      console.log('Resultado de obtenerMenuActivo:', result)
      if (result.success) {
        setMenu(result.data)
      } else {
        console.error('Error cargando menú:', result.error)
      }
      setLoading(false)
    }
    fetchActiveMenu()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-500">
          <LuChefHat size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Menú no disponible</h1>
        <p className="text-slate-500 max-w-xs mx-auto">Lo sentimos, en este momento no hay un menú del día publicado. Por favor, consulta con nuestro personal.</p>
      </div>
    )
  }

  // Agrupar platos por servicio
  const servicios = ['Primero', 'Segundo', 'Postre', 'Bebida', 'Otro'];
  const platosPorServicio = servicios.map(servicio => ({
    nombre: servicio,
    platos: menu.platos.filter(p => p.servicio === servicio)
  })).filter(s => s.platos.length > 0);

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-slate-900 pb-12">
      {/* Hero / Header Section */}
      <div className="relative h-64 bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000"
            alt="Restaurant background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

        <div className="relative text-center px-4">
          <div className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-3 uppercase tracking-widest shadow-lg">
            Menú del Día
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
            {menu.nombre}
          </h1>
          <div className="flex items-center justify-center text-orange-200 gap-4 text-sm">
            <span className="flex items-center gap-1">
              <LuCalendar size={14} />
              {new Date(menu.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Menu Content */}
      <div className="max-w-2xl mx-auto -mt-10 px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">

          <div className="space-y-12">
            {platosPorServicio.map((servicio, sIdx) => (
              <div key={sIdx}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] flex-grow bg-orange-200"></div>
                  <h2 className="text-lg font-bold text-orange-600 uppercase tracking-widest text-center whitespace-nowrap">
                    {servicio.nombre}s
                  </h2>
                  <div className="h-[1px] flex-grow bg-orange-200"></div>
                </div>

                <div className="space-y-8">
                  {servicio.platos.map((plato, pIdx) => (
                    <div key={pIdx} className="text-center group">

                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
                        {plato.nombre}
                      </h3>
                      {plato.descripcion && (
                        <><p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto italic">
                          {plato.descripcion}
                        </p><br /></>
                      )}
                      {plato.imagen_url && (
                        <div className="mb-4 overflow-hidden rounded-2xl shadow-md">
                          <img
                            src={plato.imagen_url}
                            alt={plato.nombre}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      {/* Alérgenos si existieran (opcional) */}
                      {/* <div className="mt-3 flex justify-center gap-2">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">G</span>
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">L</span>
                      </div> */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {menu.notas && (
            <div className="mt-16 p-6 bg-orange-50/50 rounded-2xl border border-orange-100 text-center">
              <LuInfo className="text-orange-500 mx-auto mb-2" size={20} />
              <p className="text-slate-600 text-sm leading-relaxed">
                {menu.notas}
              </p>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-4">
              <LuMapPin size={14} />
              <span>TRAZAKITCHEN</span>
            </div>
            <p className="text-slate-300 text-xs uppercase tracking-widest font-semibold">
              ¡Que aproveche!
            </p>
          </div>
        </div>
      </div>

      {/* Floating Footer info */}
      <div className="mt-12 text-center text-slate-400 text-xs">
        <p>© {new Date().getFullYear()} TRAZAKITCHEN. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
