import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import AppHeader from '../components/AppHeader'

export default function FormularioPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    fechaEntrada: '',
    fechaCaducidad: '',
    cantidad: '',
    unidadMedida: 'KG',
    numeroLote: '',
    zonaAlmacen: '',
  })
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'exito' | 'error'>('exito')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    if (!formData.nombre || !formData.categoria || !formData.fechaEntrada || !formData.fechaCaducidad || !formData.cantidad || !formData.unidadMedida || !formData.numeroLote || !formData.zonaAlmacen) {
      setTipoMensaje('error')
      setMensaje('Por favor completa todos los campos obligatorios')
      setLoading(false)
      setTimeout(() => setMensaje(''), 4000)
      return
    }

    try {
      const { error } = await supabase
        .from('ingredientes')
        .insert([{
          nombre: formData.nombre,
          categoria: formData.categoria,
          fecha_entrada: formData.fechaEntrada,
          fecha_caducidad: formData.fechaCaducidad,
          cantidad: parseFloat(formData.cantidad),
          unidad_medida: formData.unidadMedida,
          numero_lote: formData.numeroLote,
          zona_almacen: formData.zonaAlmacen,
          activo: true,
        }])

      if (error) {
        setTipoMensaje('error')
        setMensaje(`Error al guardar: ${error.message}`)
      } else {
        setTipoMensaje('exito')
        setMensaje(`Ingrediente "${formData.nombre}" agregado correctamente!`)
        setFormData({
          nombre: '',
          categoria: '',
          fechaEntrada: '',
          fechaCaducidad: '',
          cantidad: '',
          unidadMedida: 'KG',
          numeroLote: '',
          zonaAlmacen: '',
        })
      }
    } catch (err) {
      setTipoMensaje('error')
      setMensaje('Error inesperado al guardar el ingrediente')
    } finally {
      setLoading(false)
      setTimeout(() => setMensaje(''), 4000)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '16px', // 16px evita zoom automático en iOS
    backgroundColor: '#f9fafb',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <AppHeader />

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1.5rem 1rem',
      }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '0.4rem' }}>
              Agregar Nuevo Alimento
            </h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Completa los detalles para actualizar tu inventario</p>
          </div>

          {mensaje && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              backgroundColor: tipoMensaje === 'exito' ? '#ecfdf5' : '#fef2f2',
              color: tipoMensaje === 'exito' ? '#065f46' : '#991b1b',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              border: `1px solid ${tipoMensaje === 'exito' ? '#a7f3d0' : '#fee2e2'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <span>{mensaje}</span>
              {tipoMensaje === 'exito' && (
                <button
                  onClick={() => window.location.href = '/listado'}
                  style={{
                    backgroundColor: '#065f46',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  Ver Inventario
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{
            backgroundColor: 'white',
            padding: 'clamp(1.25rem, 5vw, 2.5rem)',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f3f4f6',
          }}>
            {/* Grid responsivo: 2 columnas en ≥768px, 1 en móvil */}
            <div className="form-grid">
              {/* Columna Izquierda */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label htmlFor="nombre" style={labelStyle}>
                    Nombre del Producto <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Filete de Ternera"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="categoria" style={labelStyle}>
                    Categoría <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Selecciona una categoria</option>
                    <option value="carnes">Carnes</option>
                    <option value="pescados">Pescados</option>
                    <option value="verduras">Verduras</option>
                    <option value="frutas">Frutas</option>
                    <option value="lacteos">Lácteos</option>
                    <option value="cereales">Cereales</option>
                    <option value="legumbres">Legumbres</option>
                    <option value="aceites">Aceites</option>
                    <option value="especias">Especias</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="congelados">Congelados</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                {/* Fechas: en móvil apiladas, en tablet+ lado a lado */}
                <div className="dates-grid">
                  <div>
                    <label htmlFor="fechaEntrada" style={labelStyle}>
                      Fecha Entrada <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="fechaEntrada"
                      type="date"
                      name="fechaEntrada"
                      value={formData.fechaEntrada}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="fechaCaducidad" style={labelStyle}>
                      Fecha Caducidad <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="fechaCaducidad"
                      type="date"
                      name="fechaCaducidad"
                      value={formData.fechaCaducidad}
                      onChange={handleChange}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label htmlFor="cantidad" style={labelStyle}>
                    Stock y Medida <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
                    <input
                      id="cantidad"
                      type="number"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleChange}
                      placeholder="Cantidad"
                      min="0"
                      step="0.01"
                      style={inputStyle}
                    />
                    <select
                      name="unidadMedida"
                      value={formData.unidadMedida}
                      onChange={handleChange}
                      style={{
                        ...inputStyle,
                        backgroundColor: '#f3f4f6',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="KG">KG</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="unidades">unidades</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="numeroLote" style={labelStyle}>
                    Número de Lote <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="numeroLote"
                    type="text"
                    name="numeroLote"
                    value={formData.numeroLote}
                    onChange={handleChange}
                    placeholder="Ej: LOT-2024-001"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="zonaAlmacen" style={labelStyle}>
                    Zona de Almacén <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    id="zonaAlmacen"
                    name="zonaAlmacen"
                    value={formData.zonaAlmacen}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Selecciona una zona</option>
                    <option value="frigorifico">Frigorífico</option>
                    <option value="congelador">Congelador</option>
                    <option value="despensa">Despensa</option>
                    <option value="bodega">Bodega</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: loading ? '#9ca3af' : '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  touchAction: 'manipulation',
                }}
              >
                {loading ? 'Guardando ingrediente...' : 'Guardar Ingrediente en Inventario'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .dates-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
          .dates-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
