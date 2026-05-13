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
        creado_por: user?.id
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
