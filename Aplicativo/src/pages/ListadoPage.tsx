import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import AppHeader from '../components/AppHeader'

interface Ingrediente {
  id: string
  nombre: string
  categoria: string
  fecha_entrada: string
  fecha_caducidad: string
  cantidad: number
  numero_lote: string
  zona_almacen: string
  activo: boolean
  created_at: string
}

export default function ListadoPage() {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Ingrediente>>({})

  const fetchIngredientes = async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (error) {
      setError(`Error al cargar los ingredientes: ${error.message}`)
    } else {
      setIngredientes(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchIngredientes()
  }, [])

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) return

    const { error } = await supabase
      .from('ingredientes')
      .update({ activo: false })
      .eq('id', id)

    if (error) {
      setError(`Error al eliminar: ${error.message}`)
      setTimeout(() => setError(''), 4000)
    } else {
      setIngredientes(prev => prev.filter(i => i.id !== id))
    }
  }

  const startEditing = (ingrediente: Ingrediente) => {
    setEditingId(ingrediente.id)
    setEditFormData({ ...ingrediente })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditFormData({})
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseFloat(value) : value
    }))
  }

  const saveEdit = async () => {
    if (!editingId) return
    
    setLoading(true)
    const { error } = await supabase
      .from('ingredientes')
      .update({
        nombre: editFormData.nombre,
        categoria: editFormData.categoria,
        fecha_entrada: editFormData.fecha_entrada,
        fecha_caducidad: editFormData.fecha_caducidad,
        cantidad: editFormData.cantidad,
        numero_lote: editFormData.numero_lote,
        zona_almacen: editFormData.zona_almacen
      })
      .eq('id', editingId)

    if (error) {
      setError(`Error al actualizar: ${error.message}`)
    } else {
      setIngredientes(prev => prev.map(i => i.id === editingId ? { ...i, ...editFormData } as Ingrediente : i))
      setEditingId(null)
      setEditFormData({})
    }
    setLoading(false)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getCategoriaLabel = (cat: string) => {
    const labels: Record<string, string> = {
      lacteo: 'Lacteo',
      carne: 'Carne',
      frutas: 'Frutas',
      verduras: 'Verduras',
      pescado: 'Pescado',
      bebidas: 'Bebidas',
      cereales: 'Cereales',
      condimentos: 'Condimentos',
      otros: 'Otros',
    }
    return labels[cat] || cat
  }

  const getZonaLabel = (zona: string) => {
    const labels: Record<string, string> = {
      frigorifico: 'Frigorifico',
      congelador: 'Congelador',
      despensa: 'Despensa',
      bodega: 'Bodega',
      otro: 'Otro',
    }
    return labels[zona] || zona
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <AppHeader />

      <div style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1.5rem' }}>Listado de Ingredientes</h2>

          {error && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              fontSize: '13px',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}

          {loading && !editingId ? (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>Cargando ingredientes...</p>
            </div>
          ) : ingredientes.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                No hay ingredientes registrados. Agrega uno para empezar!
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>Nombre</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>Categoria</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>F. Entrada</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>F. Caducidad</th>
                      <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>Cantidad</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>N. Lote</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>Zona</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientes.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: editingId === item.id ? '#fdf2f2' : 'transparent' }}>
                        {editingId === item.id ? (
                          <>
                            <td style={{ padding: '0.5rem' }}>
                              <input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }} />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <select name="categoria" value={editFormData.categoria} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }}>
                                <option value="lacteo">Lacteo</option>
                                <option value="carne">Carne</option>
                                <option value="frutas">Frutas</option>
                                <option value="verduras">Verduras</option>
                                <option value="pescado">Pescado</option>
                                <option value="bebidas">Bebidas</option>
                                <option value="cereales">Cereales</option>
                                <option value="condimentos">Condimentos</option>
                                <option value="otros">Otros</option>
                              </select>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <input type="date" name="fecha_entrada" value={editFormData.fecha_entrada} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }} />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <input type="date" name="fecha_caducidad" value={editFormData.fecha_caducidad} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }} />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <input type="number" name="cantidad" value={editFormData.cantidad} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px', textAlign: 'right' }} />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <input type="text" name="numero_lote" value={editFormData.numero_lote} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }} />
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <select name="zona_almacen" value={editFormData.zona_almacen} onChange={handleEditChange} style={{ width: '100%', padding: '0.4rem', fontSize: '12px' }}>
                                <option value="frigorifico">Frigorifico</option>
                                <option value="congelador">Congelador</option>
                                <option value="despensa">Despensa</option>
                                <option value="bodega">Bodega</option>
                                <option value="otro">Otro</option>
                              </select>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button onClick={saveEdit} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '0.5rem' }}>Guardar</button>
                              <button onClick={cancelEditing} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancelar</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '1rem', fontSize: '14px', fontWeight: '500' }}>{item.nombre}</td>
                            <td style={{ padding: '1rem', fontSize: '14px' }}>
                              <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{getCategoriaLabel(item.categoria)}</span>
                            </td>
                            <td style={{ padding: '1rem', fontSize: '14px' }}>{formatDate(item.fecha_entrada)}</td>
                            <td style={{ padding: '1rem', fontSize: '14px' }}>{formatDate(item.fecha_caducidad)}</td>
                            <td style={{ padding: '1rem', fontSize: '14px', textAlign: 'right' }}>{item.cantidad}</td>
                            <td style={{ padding: '1rem', fontSize: '14px' }}>
                              <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '12px' }}>{item.numero_lote}</code>
                            </td>
                            <td style={{ padding: '1rem', fontSize: '14px' }}>
                              <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{getZonaLabel(item.zona_almacen)}</span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                              <button
                                onClick={() => startEditing(item)}
                                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fbbf24', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', marginRight: '0.5rem' }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleEliminar(item.id)}
                                style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
                              >
                                Eliminar
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                textAlign: 'right',
                fontSize: '14px',
                color: '#6b7280',
                borderTop: '1px solid #e5e7eb'
              }}>
                Total: <strong>{ingredientes.length}</strong> ingrediente(s)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
