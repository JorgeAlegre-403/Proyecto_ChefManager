import { useState, useMemo } from 'react';
import type { IngredienteDisponible } from '../types/plato';

interface PanelIngredientesProps {
  ingredientes: IngredienteDisponible[];
  onAgregarClick: (ingrediente: IngredienteDisponible) => void;
  isLoading: boolean;
}

export function PanelIngredientes({
  ingredientes,
  onAgregarClick,
  isLoading,
}: PanelIngredientesProps) {
  const [filtro, setFiltro] = useState('');

  const ingredientesFiltrados = useMemo(() => {
    if (!filtro.trim()) return ingredientes;
    return ingredientes.filter((ing) =>
      ing.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [ingredientes, filtro]);

  return (
    <div className="border-r border-gray-300 pr-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Ingredientes Disponibles
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar ingrediente..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando ingredientes...</p>
          </div>
        ) : ingredientesFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {filtro.trim() ? 'No se encontraron ingredientes' : 'No hay ingredientes disponibles'}
            </p>
          </div>
        ) : (
          ingredientesFiltrados.map((ingrediente) => (
            <div
              key={ingrediente.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {ingrediente.nombre}
                </p>
                <p className="text-sm text-gray-600">
                  Disponible: {ingrediente.cantidad.toFixed(2)} kg
                </p>
              </div>
              <button
                onClick={() => onAgregarClick(ingrediente)}
                className="ml-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                Agregar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
