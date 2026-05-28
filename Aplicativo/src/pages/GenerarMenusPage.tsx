import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PanelPlatosSeleccionables } from '../components/PanelPlatosSeleccionables';
import { PanelMenuBuilder } from '../components/PanelMenuBuilder';
import * as menuService from '../services/menuService';
import type { Plato } from '../types/plato';
import type { MenuPlatoRelacion } from '../types/menu';
import AppHeader from '../components/AppHeader';
import { LuArrowLeft, LuSave, LuCheck, LuCircleAlert } from 'react-icons/lu';

export default function GenerarMenusPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [platos, setPlatos] = useState<Plato[]>([]);
  const [loadingPlatos, setLoadingPlatos] = useState(true);
  const [nombreMenu, setNombreMenu] = useState('');
  const [fechaMenu, setFechaMenu] = useState(new Date().toISOString().split('T')[0]);
  const [notasMenu, setNotasMenu] = useState('');
  const [platosSeleccionados, setPlatosSeleccionados] = useState<MenuPlatoRelacion[]>([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPlatos();
    if (editId) cargarDatosMenu(editId);
  }, [editId]);

  const cargarDatosMenu = async (id: string) => {
    const resultado = await menuService.obtenerMenuPorId(id);
    if (resultado.success && resultado.data) {
      const menu = resultado.data;
      setNombreMenu(menu.nombre);
      setFechaMenu(menu.fecha);
      setNotasMenu(menu.notas || '');
      setPlatosSeleccionados(menu.platos);
    } else {
      setMensajeError('Error al cargar los datos del menú');
    }
  };

  const cargarPlatos = async () => {
    setLoadingPlatos(true);
    const resultado = await menuService.obtenerPlatosDisponibles();
    if (resultado.success) setPlatos(resultado.data || []);
    else setMensajeError(resultado.error);
    setLoadingPlatos(false);
  };

  const handleAgregarPlato = (plato: Plato) => {
    if (platosSeleccionados.some((p) => p.id === plato.id)) {
      setMensajeError(`${plato.nombre} ya está en el menú`);
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }
    setPlatosSeleccionados([...platosSeleccionados, { ...plato, servicio: 'Primero', orden: platosSeleccionados.length }]);
    setMensajeError('');
  };

  const handleRemoverPlato = (id: string) =>
    setPlatosSeleccionados(platosSeleccionados.filter((p) => p.id !== id));

  const handleServicioChange = (id: string, servicio: string) =>
    setPlatosSeleccionados(platosSeleccionados.map((p) => (p.id === id ? { ...p, servicio } : p)));

  const handleGuardarMenu = async () => {
    if (!nombreMenu.trim()) { setMensajeError('El nombre del menú es requerido'); return; }
    if (!fechaMenu) { setMensajeError('La fecha del menú es obligatoria'); return; }
    if (platosSeleccionados.length === 0) { setMensajeError('Debes añadir al menos un plato al menú'); return; }

    setGuardando(true);
    setMensajeError('');

    const menuInput = {
      nombre: nombreMenu.trim(),
      fecha: fechaMenu,
      notas: notasMenu.trim(),
      platos: platosSeleccionados.map((p, index) => ({
        plato_id: p.id,
        servicio: p.servicio || 'Primero',
        orden: index,
      })),
    };

    const resultado = editId
      ? await menuService.actualizarMenu(editId, menuInput)
      : await menuService.crearMenu(menuInput);

    if (resultado.success) {
      setMensajeExito(`Menú "${nombreMenu}" ${editId ? 'actualizado' : 'guardado'} correctamente`);
      setTimeout(() => { setMensajeExito(''); navigate('/gestion-menus'); }, 2000);
    } else {
      setMensajeError(resultado.error);
    }
    setGuardando(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">

        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm flex-shrink-0"
            >
              <LuArrowLeft className="w-5 h-5" />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {editId ? 'Editar Menú' : 'Diseñar Menú'}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">
                {editId ? 'Modifica los platos y detalles de este menú' : 'Configura la oferta gastronómica para una fecha específica'}
              </p>
            </div>
          </div>

          {/* Botón guardar en cabecera (solo desktop) */}
          <button
            onClick={handleGuardarMenu}
            disabled={guardando}
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-[0.98] flex-shrink-0"
          >
            {guardando ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LuSave className="w-5 h-5" />
                {editId ? 'Actualizar Menú' : 'Guardar Menú'}
              </>
            )}
          </button>
        </div>

        {mensajeError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
            <LuCircleAlert className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{mensajeError}</span>
          </div>
        )}
        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3">
            <LuCheck className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{mensajeExito}</span>
          </div>
        )}

        {/* Paneles: apilados en móvil (scroll normal), 2 columnas en desktop */}
        <div className="generar-menus-grid" style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '350px' }}>
            <PanelPlatosSeleccionables
              platos={platos}
              onAgregarClick={handleAgregarPlato}
              isLoading={loadingPlatos}
            />
          </div>

          <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col" style={{ minHeight: '350px' }}>
            <PanelMenuBuilder
              nombreMenu={nombreMenu}
              fechaMenu={fechaMenu}
              notasMenu={notasMenu}
              platosSeleccionados={platosSeleccionados}
              onNombreChange={setNombreMenu}
              onFechaChange={setFechaMenu}
              onNotasChange={setNotasMenu}
              onRemoverPlato={handleRemoverPlato}
              onServicioChange={handleServicioChange}
            />
          </div>
        </div>

        {/* Botón guardar sticky en móvil */}
        <div className="sm:hidden sticky bottom-0 pb-4 pt-3" style={{ backgroundColor: '#f9fafb' }}>
          <button
            onClick={handleGuardarMenu}
            disabled={guardando}
            className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-[0.98]"
            style={{ fontSize: '16px' }}
          >
            {guardando ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LuSave className="w-5 h-5" />
                {editId ? 'Actualizar Menú' : 'Guardar Menú'}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .generar-menus-grid {
          grid-template-columns: 5fr 7fr;
        }
        @media (max-width: 767px) {
          .generar-menus-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
