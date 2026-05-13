import { useState, useMemo } from 'react';
import type { Plato } from '../types/plato';

interface PanelPlatosSeleccionablesProps {
  platos: Plato[];
  onAgregarClick: (plato: Plato) => void;
  isLoading: boolean;
}

export function PanelPlatosSeleccionables({
  platos,
  onAgregarClick,
  isLoading,
}: PanelPlatosSeleccionablesProps) {
  const [filtro, setFiltro] = useState('');

  const platosFiltrados = useMemo(() => {
    if (!filtro.trim()) return platos;
    return platos.filter((p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [platos, filtro]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Platos Disponibles
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar plato..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando platos...</p>
          </div>
        ) : platosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">
              {filtro.trim() ? 'No se encontraron platos' : 'No hay platos creados aún'}
            </p>
          </div>
        ) : (
          platosFiltrados.map((plato) => (
            <div
              key={plato.id}
              className="group flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-white hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onAgregarClick(plato)}
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                  {plato.nombre}
                </p>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {plato.descripcion || 'Sin descripción'}
                </p>
                <div className="flex gap-1 mt-1">
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold uppercase">
                    {plato.ingredientes.length} ing.
                  </span>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all text-sm shadow-sm"
              >
                Añadir
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
