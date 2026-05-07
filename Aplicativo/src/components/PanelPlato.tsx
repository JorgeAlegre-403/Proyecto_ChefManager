import type { IngredientePlato } from '../types/plato';
import { normalizarCantidad, obtenerUnidadBase } from '../services/platoService';

interface PanelPlatoProps {
  nombrePlato: string;
  descripcionPlato: string;
  ingredientesSeleccionados: IngredientePlato[];
  onNombreChange: (nombre: string) => void;
  onDescripcionChange: (descripcion: string) => void;
  onRemoverIngrediente: (ingredienteId: string) => void;
  onCantidadChange: (ingredienteId: string, cantidad: number) => void;
  onUnidadChange: (ingredienteId: string, unidad_medida: string) => void;
}

export function PanelPlato({
  nombrePlato,
  descripcionPlato,
  ingredientesSeleccionados,
  onNombreChange,
  onDescripcionChange,
  onRemoverIngrediente,
  onCantidadChange,
  onUnidadChange,
}: PanelPlatoProps) {
  return (
    <div className="pl-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Plato</h2>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Nombre del Plato *
        </label>
        <input
          type="text"
          value={nombrePlato}
          onChange={(e) => onNombreChange(e.target.value)}
          placeholder="ej: Ensalada César"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcionPlato}
          onChange={(e) => onDescripcionChange(e.target.value)}
          placeholder="ej: Ensalada fresca con pollo a la parrilla..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Ingredientes del Plato ({ingredientesSeleccionados.length})
        </h3>

        {ingredientesSeleccionados.length === 0 ? (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <p>Selecciona ingredientes desde el panel izquierdo</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
            {ingredientesSeleccionados.map((ingrediente) => (
              <div
                key={ingrediente.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800">
                    {ingrediente.nombre}
                  </p>
                  <button
                    onClick={() => onRemoverIngrediente(ingrediente.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={ingrediente.cantidad || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        onCantidadChange(ingrediente.id, val);
                      }}
                      className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 ${
                        ingrediente.cantidad_disponible !== undefined && 
                        normalizarCantidad(ingrediente.cantidad, ingrediente.unidad_medida) > ingrediente.cantidad_disponible
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {ingrediente.cantidad_disponible !== undefined && (
                      <p className={`text-[10px] mt-1 font-medium ${
                        normalizarCantidad(ingrediente.cantidad, ingrediente.unidad_medida) > ingrediente.cantidad_disponible 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}>
                        Stock: {ingrediente.cantidad_disponible} {obtenerUnidadBase(ingrediente.categoria, ingrediente.unidad_medida_stock)}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Unidad
                    </label>
                    <select
                      value={ingrediente.unidad_medida}
                      onChange={(e) =>
                        onUnidadChange(ingrediente.id, e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="unidad">unidad</option>
                      <option value="taza">taza</option>
                      <option value="cda">cda</option>
                      <option value="cdt">cdt</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
