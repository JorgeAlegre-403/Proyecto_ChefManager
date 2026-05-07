import { supabase } from '../lib/supabaseClient';
import type {
  IngredienteDisponible,
  Plato,
  CreatePlatoInput,
  ApiResponse,
  IngredientePlato,
} from '../types/plato';

export async function obtenerIngredientesDisponibles(): Promise<
  ApiResponse<IngredienteDisponible[]>
> {
  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('id, nombre, cantidad, categoria')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) throw error;

    const ingredientes: IngredienteDisponible[] = (data || []).map((item) => ({
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      categoria: item.categoria,
    }));

    return { success: true, data: ingredientes };
  } catch (error) {
    console.error('Error al obtener ingredientes:', error);
    return {
      success: false,
      error: 'No se pudieron cargar los ingredientes disponibles',
    };
  }
}

export async function validarCantidadDisponible(
  ingredienteId: string,
  cantidadRequerida: number
): Promise<ApiResponse<boolean>> {
  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('cantidad')
      .eq('id', ingredienteId)
      .eq('activo', true)
      .single();

    if (error) throw error;

    if (!data) {
      return { success: false, error: 'Ingrediente no encontrado' };
    }

    const hayStock = data.cantidad >= cantidadRequerida;
    return { success: true, data: hayStock };
  } catch (error) {
    console.error('Error al validar cantidad:', error);
    return {
      success: false,
      error: 'Error al validar disponibilidad de ingrediente',
    };
  }
}

async function obtenerNombreIngrediente(ingredienteId: string): Promise<string> {
  try {
    const { data } = await supabase
      .from('ingredientes')
      .select('nombre')
      .eq('id', ingredienteId)
      .single();

    return data?.nombre || 'Ingrediente desconocido';
  } catch {
    return 'Ingrediente desconocido';
  }
}

export async function crearPlato(
  platoInput: CreatePlatoInput
): Promise<ApiResponse<Plato>> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('=== CREAR PLATO - USUARIO AUTENTICADO ===');
    console.log('Usuario:', user?.email || 'No autenticado');
    console.log('ID Usuario:', user?.id || 'N/A');
    console.log('Error auth:', userError);

    if (!platoInput.ingredientes || platoInput.ingredientes.length === 0) {
      return {
        success: false,
        error: 'El plato debe tener al menos un ingrediente',
      };
    }

    if (!platoInput.nombre.trim()) {
      return { success: false, error: 'El nombre del plato es requerido' };
    }

    console.log('Datos del plato a crear:', {
      nombre: platoInput.nombre,
      descripcion: platoInput.descripcion,
      ingredientes: platoInput.ingredientes,
    });

    for (const ing of platoInput.ingredientes) {
      const validacion = await validarCantidadDisponible(
        ing.ingrediente_id,
        ing.cantidad
      );

      if (!validacion.success || !validacion.data) {
        const { data: ingrediente } = await supabase
          .from('ingredientes')
          .select('nombre, cantidad')
          .eq('id', ing.ingrediente_id)
          .single();

        const cantidadDisponible = ingrediente?.cantidad || 0;
        const nombreIng = ingrediente?.nombre || 'Ingrediente desconocido';

        return {
          success: false,
          error: `Cantidad insuficiente de ${nombreIng}. Disponible: ${cantidadDisponible}, Requerido: ${ing.cantidad}`,
        };
      }
    }

    console.log('Intentando insertar plato...');
    const { data: platoCreado, error: errorPlato } = await supabase
      .from('platos')
      .insert([
        {
          nombre: platoInput.nombre.trim(),
          descripcion: platoInput.descripcion?.trim() || '',
          activo: true,
        },
      ])
      .select()
      .single();

    console.log('Respuesta insert platos:', {
      data: platoCreado,
      error: errorPlato,
      errorCode: (errorPlato as any)?.code,
      errorMessage: (errorPlato as any)?.message,
      errorDetails: (errorPlato as any)?.details,
    });

    if (errorPlato) throw errorPlato;

    const ingredientesParaInsertar = platoInput.ingredientes.map((ing) => ({
      plato_id: platoCreado.id,
      ingrediente_id: ing.ingrediente_id,
      cantidad: ing.cantidad,
      unidad_medida: ing.unidad_medida,
    }));

    console.log('Intentando insertar ingredientes:', ingredientesParaInsertar);
    const { error: errorIngredientes } = await supabase
      .from('platos_ingredientes')
      .insert(ingredientesParaInsertar);

    console.log('Respuesta insert platos_ingredientes:', {
      error: errorIngredientes,
      errorCode: (errorIngredientes as any)?.code,
      errorMessage: (errorIngredientes as any)?.message,
    });

    if (errorIngredientes) throw errorIngredientes;

    const ingredientesFormato: IngredientePlato[] = [];

    for (const ing of platoInput.ingredientes) {
      const nombre = await obtenerNombreIngrediente(ing.ingrediente_id);
      ingredientesFormato.push({
        id: ing.ingrediente_id,
        nombre,
        cantidad: ing.cantidad,
        unidad_medida: ing.unidad_medida,
      });
    }

    const platoRespuesta: Plato = {
      id: platoCreado.id,
      nombre: platoCreado.nombre,
      descripcion: platoCreado.descripcion,
      ingredientes: ingredientesFormato,
      activo: platoCreado.activo,
      created_at: platoCreado.created_at,
      updated_at: platoCreado.updated_at,
    };

    console.log('=== PLATO CREADO EXITOSAMENTE ===', platoRespuesta);
    return { success: true, data: platoRespuesta };
  } catch (error) {
    console.error('=== ERROR AL CREAR PLATO ===');
    console.error('Error objeto:', error);
    console.error('Error tipo:', typeof error);
    if (error instanceof Error) {
      console.error('Error mensaje:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.error('Error JSON:', JSON.stringify(error, null, 2));
    return {
      success: false,
      error: 'Error al crear el plato. Intenta nuevamente.',
    };
  }
}

export async function obtenerPlatos(): Promise<ApiResponse<Plato[]>> {
  try {
    const { data: platos, error: errorPlatos } = await supabase
      .from('platos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (errorPlatos) throw errorPlatos;

    const platosConIngredientes: Plato[] = [];

    for (const plato of platos || []) {
      const { data: ingredientes, error: errorIngredientes } = await supabase
        .from('platos_ingredientes')
        .select('ingrediente_id, cantidad, unidad_medida, ingredientes(nombre)')
        .eq('plato_id', plato.id);

      if (errorIngredientes) throw errorIngredientes;

      const ingredientesFormato: IngredientePlato[] = (ingredientes || []).map(
        (item: any) => ({
          id: item.ingrediente_id,
          nombre: item.ingredientes?.nombre || '',
          cantidad: item.cantidad,
          unidad_medida: item.unidad_medida,
        })
      );

      platosConIngredientes.push({
        id: plato.id,
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        ingredientes: ingredientesFormato,
        activo: plato.activo,
        created_at: plato.created_at,
        updated_at: plato.updated_at,
      });
    }

    return { success: true, data: platosConIngredientes };
  } catch (error) {
    console.error('Error al obtener platos:', error);
    return {
      success: false,
      error: 'Error al cargar los platos',
    };
  }
}

export async function obtenerPlatoById(id: string): Promise<ApiResponse<Plato>> {
  try {
    const { data: plato, error: errorPlato } = await supabase
      .from('platos')
      .select('*')
      .eq('id', id)
      .single();

    if (errorPlato) throw errorPlato;

    const { data: ingredientes, error: errorIngredientes } = await supabase
      .from('platos_ingredientes')
      .select('ingrediente_id, cantidad, unidad_medida, ingredientes(nombre)')
      .eq('plato_id', id);

    if (errorIngredientes) throw errorIngredientes;

    const ingredientesFormato: IngredientePlato[] = (ingredientes || []).map(
      (item: any) => ({
        id: item.ingrediente_id,
        nombre: item.ingredientes?.nombre || '',
        cantidad: item.cantidad,
        unidad_medida: item.unidad_medida,
      })
    );

    return {
      success: true,
      data: {
        id: plato.id,
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        ingredientes: ingredientesFormato,
        activo: plato.activo,
        created_at: plato.created_at,
        updated_at: plato.updated_at,
      },
    };
  } catch (error) {
    console.error('Error al obtener plato:', error);
    return {
      success: false,
      error: 'Error al cargar el plato',
    };
  }
}

export async function eliminarPlato(id: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('platos')
      .update({ activo: false })
      .eq('id', id);

    if (error) throw error;

    return { success: true, data: true };
  } catch (error) {
    console.error('Error al eliminar plato:', error);
    return {
      success: false,
      error: 'Error al eliminar el plato',
    };
  }
}

export async function actualizarPlato(
  id: string,
  platoInput: CreatePlatoInput
): Promise<ApiResponse<Plato>> {
  try {
    // 1. Actualizar datos básicos del plato
    const { error: errorPlato } = await supabase
      .from('platos')
      .update({
        nombre: platoInput.nombre.trim(),
        descripcion: platoInput.descripcion?.trim() || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (errorPlato) throw errorPlato;

    // 2. Eliminar ingredientes anteriores
    const { error: errorDelete } = await supabase
      .from('platos_ingredientes')
      .delete()
      .eq('plato_id', id);

    if (errorDelete) throw errorDelete;

    // 3. Insertar nuevos ingredientes
    const ingredientesParaInsertar = platoInput.ingredientes.map((ing) => ({
      plato_id: id,
      ingrediente_id: ing.ingrediente_id,
      cantidad: ing.cantidad,
      unidad_medida: ing.unidad_medida,
    }));

    const { error: errorIngredientes } = await supabase
      .from('platos_ingredientes')
      .insert(ingredientesParaInsertar);

    if (errorIngredientes) throw errorIngredientes;

    // 4. Retornar el plato actualizado
    return obtenerPlatoById(id);
  } catch (error) {
    console.error('Error al actualizar plato:', error);
    return {
      success: false,
      error: 'Error al actualizar el plato',
    };
  }
}
