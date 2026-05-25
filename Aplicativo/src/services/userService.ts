import { supabase } from '../lib/supabaseClient';
import { supabaseAdmin } from '../lib/supabaseAdmin';
import type { Usuario, CreateUsuarioInput } from '../types/usuario';

export interface UsuarioResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Obtener todos los usuarios
export async function obtenerUsuarios(): Promise<UsuarioResponse> {
  try {
    const { data: { user: adminUser } } = await supabase.auth.getUser();
    
    if (!adminUser) {
      return { success: false, error: 'No autenticado' };
    }

    // Obtener usuarios desde tabla en base de datos (en lugar de admin API)
    const { data, error } = await supabase
      .from('usuarios_app')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error accediendo tabla usuarios:', error);
      return { 
        success: false, 
        error: 'No tienes permisos para gestionar usuarios. Contacta al administrador.' 
      };
    }

    const usuarios: Usuario[] = (data || []).map(user => ({
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata || { role: user.role },
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
    }));

    return { success: true, data: usuarios };
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return { 
      success: false, 
      error: 'Error al obtener usuarios. Verifica que tengas permisos de administrador.' 
    };
  }
}

// Crear nuevo usuario
export async function crearUsuario(input: CreateUsuarioInput): Promise<UsuarioResponse> {
  try {
    let userData: any = null;
    let userId: string = '';

    // Primero intenta con admin API (si tiene permisos)
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          role: input.role,
        },
      });

      if (!error) {
        userData = data;
        userId = data.user.id;
      }
    } catch (_e) {
      // Si falla admin, intenta con signUp
    }

    // Si admin API falló, usar signUp
    if (!userData) {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            role: input.role,
          },
        },
      });

      if (error) throw error;
      userData = data;
      userId = data.user?.id || '';
    }

    // Guardar en tabla usuarios_app
    if (userId) {
      const { error: dbError } = await supabase
        .from('usuarios_app')
        .insert({
          id: userId,
          email: input.email,
          role: input.role,
          user_metadata: { role: input.role },
          created_at: new Date(),
          updated_at: new Date(),
        });

      if (dbError) {
        console.warn('Advertencia: Usuario creado pero no guardado en tabla:', dbError);
      }
    }

    return { 
      success: true, 
      data: {
        id: userId,
        email: input.email,
        role: input.role,
      }
    };
  } catch (error: any) {
    console.error('Error al crear usuario:', error);
    if (error.message?.includes('already registered')) {
      return { success: false, error: 'El email ya está registrado' };
    }
    return { success: false, error: error.message || 'Error al crear usuario' };
  }
}

// Actualizar rol de usuario
export async function actualizarRolUsuario(userId: string, nuevoRol: 'admin' | 'jefecocina' | 'cocinero'): Promise<UsuarioResponse> {
  try {
    // Actualizar solo en tabla usuarios_app (no necesita permisos especiales)
    const { data, error } = await supabase
      .from('usuarios_app')
      .update({ 
        role: nuevoRol,
        user_metadata: { role: nuevoRol }
      })
      .eq('id', userId)
      .select();

    if (error) throw error;

    return { 
      success: true, 
      data: {
        id: userId,
        role: nuevoRol,
      }
    };
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    return { success: false, error: 'Error al actualizar rol del usuario' };
  }
}

// Eliminar usuario
export async function eliminarUsuario(userId: string): Promise<UsuarioResponse> {
  try {
    // Eliminar solo de tabla usuarios_app
    const { error } = await supabase
      .from('usuarios_app')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    return { success: true, data: { message: 'Usuario eliminado correctamente' } };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return { success: false, error: 'Error al eliminar usuario' };
  }
}

// Enviar email de reseteo de contraseña
export async function enviarEmailReseteoContraseña(email: string): Promise<UsuarioResponse> {
  try {
    // Usar el endpoint de resetPasswordForEmail que funciona con email públicamente
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-contrasena`,
    });

    if (error) throw error;

    return { success: true, data: { message: 'Email de reseteo enviado' } };
  } catch (error: any) {
    console.error('Error al enviar email de reseteo:', error);
    // Si falla, mostrar mensaje genérico
    return { success: true, data: { message: 'Si el email existe, recibirá un enlace de reseteo' } };
  }
}

// Cambiar contraseña de un usuario (como admin)
// Usa supabaseAdmin (service_role key) para tener permisos de modificar otros usuarios.
export async function cambiarContraseñaUsuario(userId: string, nuevaContraseña: string): Promise<UsuarioResponse> {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: nuevaContraseña,
    });

    if (error) throw error;

    return { success: true, data: { message: 'Contraseña actualizada correctamente' } };
  } catch (error: any) {
    console.error('Error al cambiar contraseña:', error);
    return { success: false, error: error?.message || 'Error al cambiar contraseña del usuario' };
  }
}

// Obtener usuario actual
export async function obtenerUsuarioActual(): Promise<UsuarioResponse> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) throw error;

    return { 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'admin',
      }
    };
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return { success: false, error: 'Error al obtener usuario actual' };
  }
}
