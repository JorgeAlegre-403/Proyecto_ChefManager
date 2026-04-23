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

        if (!formData.nombre || !formData.categoria || !formData.fechaEntrada || !formData.fechaCaducidad || !formData.cantidad || !formData.numeroLote || !formData.zonaAlmacen) {
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            <AppHeader />

            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                overflow: 'hidden'
            }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Agregar Ingrediente</h2>

                    {mensaje && (
                        <div style={{
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            backgroundColor: tipoMensaje === 'exito' ? '#dcfce7' : '#fee2e2',
                            color: tipoMensaje === 'exito' ? '#166534' : '#991b1b',
                            borderRadius: '4px',
                            fontSize: '13px',
                            border: `1px solid ${tipoMensaje === 'exito' ? '#86efac' : '#fca5a5'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>{mensaje}</span>
                            {tipoMensaje === 'exito' && (
                                <button
                                    onClick={() => window.location.href = '/listado'}
                                    style={{
                                        backgroundColor: '#166534',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        marginLeft: '1rem'
                                    }}
                                >
                                    Ver en listado
                                </button>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        maxHeight: 'calc(100vh - 200px)',
                        overflow: 'auto'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="nombre" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                Nombre <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Tomate, Pollo, Leche..."
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                    fontSize: '13px'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="categoria" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                Categoria <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                    fontSize: '13px'
                                }}
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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label htmlFor="fechaEntrada" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                    Fecha Entrada <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    id="fechaEntrada"
                                    type="date"
                                    name="fechaEntrada"
                                    value={formData.fechaEntrada}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="fechaCaducidad" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                    Fecha Caducidad <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    id="fechaCaducidad"
                                    type="date"
                                    name="fechaCaducidad"
                                    value={formData.fechaCaducidad}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label htmlFor="cantidad" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                    Cantidad <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    id="cantidad"
                                    type="number"
                                    name="cantidad"
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    placeholder="Ej: 10"
                                    min="0"
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="numeroLote" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                    Numero de Lote <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    id="numeroLote"
                                    type="text"
                                    name="numeroLote"
                                    value={formData.numeroLote}
                                    onChange={handleChange}
                                    placeholder="Ej: LOT-2024-001"
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        boxSizing: 'border-box',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label htmlFor="zonaAlmacen" style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500', fontSize: '13px' }}>
                                Zona de Almacen <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                id="zonaAlmacen"
                                name="zonaAlmacen"
                                value={formData.zonaAlmacen}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box',
                                    fontSize: '13px'
                                }}
                            >
                                <option value="">Selecciona una zona</option>
                                <option value="frigorifico">Frigorifico</option>
                                <option value="congelador">Congelador</option>
                                <option value="despensa">Despensa</option>
                                <option value="bodega">Bodega</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Agregando...' : 'Agregar Ingrediente'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
