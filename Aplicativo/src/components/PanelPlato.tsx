import type { IngredientePlato } from '../types/plato';
import { normalizarCantidad, obtenerUnidadBase } from '../services/platoService';
import { LuTrash2 } from 'react-icons/lu';

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
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Quitar ingrediente"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
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
                      className={`w-full px-3 py-2 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                        ingrediente.cantidad_disponible !== undefined && 
                        normalizarCantidad(ingrediente.cantidad, ingrediente.unidad_medida) > ingrediente.cantidad_disponible
                          ? 'border-red-500 bg-red-50 focus:ring-red-200'
                          : 'border-gray-200 bg-white focus:ring-orange-200 focus:border-orange-500'
                      }`}
                    />
                    {ingrediente.cantidad_disponible !== undefined && (
                      <p className={`text-[10px] mt-1.5 font-bold px-1 ${
                        normalizarCantidad(ingrediente.cantidad, ingrediente.unidad_medida) > (ingrediente.cantidad_disponible || 0)
                          ? 'text-red-600' 
                          : 'text-slate-400'
                      }`}>
                        Stock: {ingrediente.cantidad_disponible} {ingrediente.unidad_medida_stock || obtenerUnidadBase(ingrediente.categoria)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Unidad
                    </label>
                    <select
                      value={ingrediente.unidad_medida}
                      onChange={(e) =>
                        onUnidadChange(ingrediente.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
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
