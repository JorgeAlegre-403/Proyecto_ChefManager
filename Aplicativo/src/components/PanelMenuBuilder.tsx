import { LuTrash2, LuMenu, LuCalendar, LuFileText } from 'react-icons/lu';
import type { MenuPlatoRelacion } from '../types/menu';

interface PanelMenuBuilderProps {
  nombreMenu: string;
  fechaMenu: string;
  notasMenu: string;
  platosSeleccionados: MenuPlatoRelacion[];
  onNombreChange: (val: string) => void;
  onFechaChange: (val: string) => void;
  onNotasChange: (val: string) => void;
  onRemoverPlato: (id: string) => void;
  onServicioChange: (id: string, servicio: string) => void;
}

export function PanelMenuBuilder({
  nombreMenu,
  fechaMenu,
  notasMenu,
  platosSeleccionados,
  onNombreChange,
  onFechaChange,
  onNotasChange,
  onRemoverPlato,
  onServicioChange,
}: PanelMenuBuilderProps) {
  const serviciosDisponibles = ['Primero', 'Segundo', 'Postre', 'Entrante', 'Bebida', 'Otro'];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LuMenu className="text-orange-600" />
          Configuración del Menú
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
              Nombre del Menú
            </label>
            <input
              type="text"
              value={nombreMenu}
              onChange={(e) => onNombreChange(e.target.value)}
              placeholder="Ej: Menú Especial"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
              Fecha del Menú
            </label>
            <div className="relative">
              <LuCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={fechaMenu}
                onChange={(e) => onFechaChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1 flex items-center gap-2">
            <LuFileText className="w-4 h-4" />
            Notas / Observaciones
          </label>
          <textarea
            value={notasMenu}
            onChange={(e) => onNotasChange(e.target.value)}
            placeholder="Ej: Incluye pan, bebida y café..."
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all text-sm"
          />
        </div>
      </div>

      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
        Platos Seleccionados ({platosSeleccionados.length})
      </h3>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {platosSeleccionados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Añade platos para empezar</p>
          </div>
        ) : (
          platosSeleccionados.map((plato) => (
            <div
              key={plato.id}
              className="flex flex-col p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                    {platosSeleccionados.indexOf(plato) + 1}
                  </div>
                  <span className="font-bold text-gray-800">{plato.nombre}</span>
                </div>
                <button
                  onClick={() => onRemoverPlato(plato.id)}
                  className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase">Servicio:</span>
                <div className="flex flex-wrap gap-1.5">
                  {serviciosDisponibles.map((s) => (
                    <button
                      key={s}
                      onClick={() => onServicioChange(plato.id, s)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${plato.servicio === s
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
