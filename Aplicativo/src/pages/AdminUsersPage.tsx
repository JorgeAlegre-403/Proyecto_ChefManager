import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import * as userService from '../services/userService';
import type { Usuario } from '../types/usuario';
import {
  LuArrowLeft, LuPlus, LuTrash2, LuKey,
  LuCheck, LuX, LuBell, LuShieldAlert,
} from 'react-icons/lu';

interface SolicitudContrasena {
  id: string;
  usuario_id: string;
  email: string;
  estado: 'pendiente' | 'resuelta';
  created_at: string;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  // Solicitudes pendientes de cambio de contraseña
  const [solicitudes, setSolicitudes] = useState<SolicitudContrasena[]>([]);
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(true);

  // Estados para crear usuario
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [nuevoRol, setNuevoRol] = useState<'admin' | 'jefecocina' | 'cocinero'>('cocinero');
  const [creandoUsuario, setCreandoUsuario] = useState(false);

  // Estados para resetear contraseña
  const [usuarioReseteo, setUsuarioReseteo] = useState<string | null>(null);
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [cambiandoContraseña, setCambiandoContraseña] = useState(false);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    setLoading(true);
    await Promise.all([cargarUsuarios(), cargarSolicitudes()]);
    setLoading(false);
  };

  const cargarUsuarios = async () => {
    const resultado = await userService.obtenerUsuarios();
    if (resultado.success) {
      setUsuarios(resultado.data || []);
    } else {
      setMensajeError(resultado.error || 'Error al cargar usuarios');
    }
  };

  const cargarSolicitudes = async () => {
    const resultado = await userService.obtenerSolicitudesPendientes();
    if (resultado.success) {
      setSolicitudes(resultado.data || []);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!nuevoEmail || !nuevoPassword) {
      setMensajeError('Email y contraseña son requeridos');
      return;
    }
    if (nuevoPassword.length < 6) {
      setMensajeError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCreandoUsuario(true);
    const resultado = await userService.crearUsuario({
      email: nuevoEmail,
      password: nuevoPassword,
      role: nuevoRol,
    });

    if (resultado.success) {
      setMensajeExito(`Usuario ${nuevoEmail} creado exitosamente`);
      setNuevoEmail('');
      setNuevoPassword('');
      setNuevoRol('cocinero');
      setMostrarFormularioNuevo(false);
      cargarUsuarios();
    } else {
      setMensajeError(resultado.error || 'Error al crear usuario');
    }
    setCreandoUsuario(false);
  };

  const handleEliminarUsuario = async (userId: string, email: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${email}?`)) return;

    const resultado = await userService.eliminarUsuario(userId);
    if (resultado.success) {
      setMensajeExito(`Usuario ${email} eliminado`);
      cargarUsuarios();
    } else {
      setMensajeError(resultado.error || 'Error al eliminar usuario');
    }
  };

  const handleCambiarContraseña = async (userId: string, email: string) => {
    if (!nuevaContraseña) {
      setMensajeError('Ingresa una nueva contraseña');
      return;
    }
    if (nuevaContraseña.length < 6) {
      setMensajeError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCambiandoContraseña(true);
    const resultado = await userService.cambiarContraseñaUsuario(userId, nuevaContraseña);

    if (resultado.success) {
      // Resolver automáticamente la solicitud pendiente si la hay
      const tieneSolicitud = solicitudes.some(s => s.usuario_id === userId);
      if (tieneSolicitud) {
        await userService.resolverSolicitudesContrasena(userId);
        await cargarSolicitudes();
      }

      setMensajeExito(`Contraseña de ${email} actualizada`);
      setUsuarioReseteo(null);
      setNuevaContraseña('');
    } else {
      setMensajeError(resultado.error || 'Error al cambiar contraseña');
    }
    setCambiandoContraseña(false);
  };

  const handleCambiarRol = async (userId: string, nuevoRol: 'admin' | 'jefecocina' | 'cocinero') => {
    const resultado = await userService.actualizarRolUsuario(userId, nuevoRol);
    if (resultado.success) {
      setMensajeExito('Rol actualizado correctamente');
      cargarUsuarios();
    } else {
      setMensajeError(resultado.error || 'Error al actualizar rol');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente');

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
          >
            <LuArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Gestión de Usuarios</h1>

          {/* Badge de solicitudes en el título */}
          {solicitudesPendientes.length > 0 && (
            <button
              onClick={() => setMostrarSolicitudes(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-800 rounded-xl font-semibold text-sm transition-all"
            >
              <LuBell className="w-4 h-4 animate-pulse" />
              {solicitudesPendientes.length} solicitud{solicitudesPendientes.length > 1 ? 'es' : ''} pendiente{solicitudesPendientes.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* ─── BANNER DE SOLICITUDES PENDIENTES ─── */}
        {solicitudesPendientes.length > 0 && mostrarSolicitudes && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200 bg-amber-100/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-200 rounded-xl text-amber-700">
                  <LuShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-amber-900 text-base">Solicitudes de cambio de contraseña</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    Los siguientes usuarios han solicitado un cambio de contraseña. Usa el botón <span className="font-semibold">🔑</span> en la tabla para cambiársela.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMostrarSolicitudes(false)}
                className="p-1.5 hover:bg-amber-200 rounded-lg transition-all text-amber-600"
                title="Ocultar"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-amber-100">
              {solicitudesPendientes.map((sol) => (
                <div key={sol.id} className="flex items-center justify-between px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-900 font-medium text-sm">{sol.email}</span>
                    <span className="text-amber-600 text-xs">
                      · {new Date(sol.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const usuario = usuarios.find(u => u.id === sol.usuario_id);
                      if (usuario) setUsuarioReseteo(usuario.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <LuKey className="w-3.5 h-3.5" />
                    Cambiar contraseña
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {mensajeError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm">
            {mensajeError}
          </div>
        )}
        {mensajeExito && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm flex items-center gap-2">
            <LuCheck className="w-5 h-5" />
            {mensajeExito}
          </div>
        )}

        {/* Botón para crear nuevo usuario */}
        <div className="mb-8">
          <button
            onClick={() => setMostrarFormularioNuevo(!mostrarFormularioNuevo)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            <LuPlus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>

        {/* Formulario para crear usuario */}
        {mostrarFormularioNuevo && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Nuevo Usuario</h2>
            <form onSubmit={handleCrearUsuario} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={nuevoEmail}
                    onChange={(e) => setNuevoEmail(e.target.value)}
                    placeholder="usuario@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    placeholder="Contraseña segura"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value as 'admin' | 'jefecocina' | 'cocinero')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="cocinero">Cocinero</option>
                  <option value="jefecocina">Jefe de Cocina</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={creandoUsuario}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all"
                >
                  {creandoUsuario ? 'Creando...' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormularioNuevo(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rol</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Creado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Último acceso</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuarios.map((usuario) => {
                  const tieneSolicitud = solicitudesPendientes.some(s => s.usuario_id === usuario.id);
                  return (
                    <tr
                      key={usuario.id}
                      className={`hover:bg-gray-50 transition-colors ${tieneSolicitud ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {tieneSolicitud && (
                            <span
                              title="Solicitud de cambio de contraseña pendiente"
                              className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                            />
                          )}
                          {usuario.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={usuario.user_metadata?.role || 'cocinero'}
                          onChange={(e) =>
                            handleCambiarRol(usuario.id, e.target.value as 'admin' | 'jefecocina' | 'cocinero')
                          }
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="cocinero">Cocinero</option>
                          <option value="jefecocina">Jefe de Cocina</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {usuario.created_at
                          ? new Date(usuario.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {usuario.last_sign_in_at
                          ? new Date(usuario.last_sign_in_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setUsuarioReseteo(usuario.id)}
                            className={`p-2 rounded-lg transition-all ${
                              tieneSolicitud
                                ? 'text-amber-600 bg-amber-100 hover:bg-amber-200 ring-1 ring-amber-300'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title={tieneSolicitud ? 'Cambiar contraseña (solicitud pendiente)' : 'Cambiar contraseña'}
                          >
                            <LuKey size={18} />
                          </button>

                          <button
                            onClick={() => handleEliminarUsuario(usuario.id, usuario.email)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar usuario"
                          >
                            <LuTrash2 size={18} />
                          </button>
                        </div>

                        {/* Modal de cambio de contraseña */}
                        {usuarioReseteo === usuario.id && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                Cambiar contraseña
                              </h3>
                              {tieneSolicitud && (
                                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
                                  <LuBell className="w-4 h-4 shrink-0" />
                                  Este usuario ha solicitado un cambio de contraseña.
                                </div>
                              )}
                              <p className="text-gray-600 mb-4">
                                Para: <strong>{usuario.email}</strong>
                              </p>
                              <input
                                type="password"
                                value={nuevaContraseña}
                                onChange={(e) => setNuevaContraseña(e.target.value)}
                                placeholder="Nueva contraseña"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleCambiarContraseña(usuario.id, usuario.email)}
                                  disabled={cambiandoContraseña}
                                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                  <LuCheck size={18} />
                                  {cambiandoContraseña ? 'Cambiando...' : 'Cambiar'}
                                </button>
                                <button
                                  onClick={() => {
                                    setUsuarioReseteo(null);
                                    setNuevaContraseña('');
                                  }}
                                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                  <LuX size={18} />
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p>No hay usuarios creados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
