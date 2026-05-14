import { supabase } from '../lib/supabaseClient';
import type { MenuInput } from '../types/menu';

export const obtenerPlatosDisponibles = async () => {
  try {
    const { data, error } = await supabase
      .from('platos')
      .select('*, ingredientes:platos_ingredientes(ingrediente_id, cantidad, unidad_medida)')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const crearMenu = async (menuInput: MenuInput) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: menu, error: errorMenu } = await supabase
      .from('menus')
      .insert([{
        nombre: menuInput.nombre,
        fecha: menuInput.fecha,
        notas: menuInput.notas,
        creado_por: user?.id,
        activo: false
      }])
      .select()
      .single();

    if (errorMenu) throw errorMenu;

    const menusPlatos = menuInput.platos.map((p) => ({
      menu_id: menu.id,
      plato_id: p.plato_id,
      servicio: p.servicio,
      orden: p.orden
    }));

    const { error: errorPlatos } = await supabase
      .from('menu_platos')
      .insert(menusPlatos);

    if (errorPlatos) throw errorPlatos;

    return { success: true, data: menu };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const obtenerMenus = async () => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select(`
        *,
        platos_rel:menu_platos(
          id,
          servicio,
          orden,
          plato:platos(*)
        )
      `)
      .order('fecha', { ascending: false });

    if (error) throw error;

    const menusFormateados = data.map((menu: any) => ({
      ...menu,
      platos: menu.platos_rel.map((p: any) => ({
        ...p.plato,
        servicio: p.servicio,
        orden: p.orden
      }))
    }));

    return { success: true, data: menusFormateados };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const eliminarMenu = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menus')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const activarMenu = async (id: string) => {
  try {
    // 1. Desactivar todos los menús
    await supabase
      .from('menus')
      .update({ activo: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // hack para actualizar todos sin where estricto si RLS lo permite

    // 2. Activar el menú seleccionado
    const { error } = await supabase
      .from('menus')
      .update({ activo: true })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const obtenerMenuActivo = async () => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select(`
        *,
        platos_rel:menu_platos(
          id,
          servicio,
          orden,
          plato:platos(*)
        )
      `)
      .eq('activo', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { success: true, data: null };

    const menuFormateado = {
      ...data,
      platos: data.platos_rel.map((p: any) => ({
        ...p.plato,
        servicio: p.servicio,
        orden: p.orden
      }))
    };

    return { success: true, data: menuFormateado };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const obtenerMenuPorId = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('menus')
      .select(`
        *,
        platos_rel:menu_platos(
          id,
          servicio,
          orden,
          plato:platos(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    const menuFormateado = {
      ...data,
      platos: data.platos_rel.map((p: any) => ({
        ...p.plato,
        servicio: p.servicio,
        orden: p.orden
      }))
    };

    return { success: true, data: menuFormateado };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const actualizarMenu = async (id: string, menuInput: MenuInput) => {
  try {
    // 1. Actualizar datos básicos del menú
    const { error: errorMenu } = await supabase
      .from('menus')
      .update({
        nombre: menuInput.nombre,
        fecha: menuInput.fecha,
        notas: menuInput.notas
      })
      .eq('id', id);

    if (errorMenu) throw errorMenu;

    // 2. Eliminar relaciones antiguas de platos
    const { error: errorDelete } = await supabase
      .from('menu_platos')
      .delete()
      .eq('menu_id', id);

    if (errorDelete) throw errorDelete;

    // 3. Insertar nuevas relaciones
    const menusPlatos = menuInput.platos.map((p) => ({
      menu_id: id,
      plato_id: p.plato_id,
      servicio: p.servicio,
      orden: p.orden
    }));

    const { error: errorPlatos } = await supabase
      .from('menu_platos')
      .insert(menusPlatos);

    if (errorPlatos) throw errorPlatos;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const desactivarMenu = async (id: string) => {
  try {
    const { error } = await supabase
      .from('menus')
      .update({ activo: false })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


