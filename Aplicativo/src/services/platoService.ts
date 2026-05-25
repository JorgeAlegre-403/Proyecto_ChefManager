import { supabase } from '../lib/supabaseClient';
import type {
  IngredienteDisponible,
  Plato,
  CreatePlatoInput,
  ApiResponse,
  IngredientePlato,
} from '../types/plato';

// Función para cargar imagen a Supabase Storage
async function cargarImagenPlato(imagenBase64: string, platoId: string): Promise<string | null> {
  try {
    if (!imagenBase64) return null;

    // Convertir base64 a blob
    const base64Data = imagenBase64.split(',')[1] || imagenBase64;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });

    // Generar nombre único para la imagen
    const timestamp = Date.now();
    const nombreArchivo = `plato_${platoId}_${timestamp}.jpg`;

    // Cargar a Supabase Storage
    const { error } = await supabase.storage
      .from('platos-imagenes')
      .upload(nombreArchivo, blob, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('platos-imagenes')
      .getPublicUrl(nombreArchivo);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error al cargar imagen:', error);
    return null;
  }
}

export async function obtenerIngredientesDisponibles(): Promise<
  ApiResponse<IngredienteDisponible[]>
> {
  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('id, nombre, cantidad, categoria, unidad_medida')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) throw error;

    const ingredientes: IngredienteDisponible[] = (data || []).map((item) => ({
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      categoria: item.categoria,
      unidad_medida: item.unidad_medida,
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

export function normalizarCantidad(cantidad: number, unidad: string): number {
  const u = unidad.toLowerCase();
  switch (u) {
    case 'g': return cantidad / 1000;
    case 'kg': return cantidad;
    case 'ml': return cantidad / 1000;
    case 'l': return cantidad;
    case 'taza': return cantidad * 0.250;
    case 'cda': return cantidad * 0.015;
    case 'cdt': return cantidad * 0.005;
    case 'unidad': return cantidad * 1;
    default:
      return cantidad;
  }
}

// Obtener la unidad base (prioriza la unidad guardada, si no, usa la categoría)
export function obtenerUnidadBase(categoria?: string, unidadGuardada?: string): string {
  if (unidadGuardada) return unidadGuardada;
  if (!categoria) return 'unidades';
  const c = categoria.toLowerCase();

  if (['carnes', 'pescados', 'verduras', 'frutas', 'cereales', 'legumbres', 'congelados'].includes(c)) {
    return 'KG';
  }
  if (['aceites', 'bebidas', 'lacteos'].includes(c)) {
    return 'L';
  }
  if (['especias'].includes(c)) {
    return 'g';
  }
  return 'unidades';
}

export async function validarCantidadDisponible(
  ingredienteId: string,
  cantidadRequerida: number,
  unidad: string
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

    const cantidadNormalizada = normalizarCantidad(cantidadRequerida, unidad);
    const hayStock = data.cantidad >= cantidadNormalizada;
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
        ing.cantidad,
        ing.unidad_medida
      );

      if (!validacion.success || !validacion.data) {
        const { data: ingrediente } = await supabase
          .from('ingredientes')
          .select('nombre, cantidad, categoria, unidad_medida')
          .eq('id', ing.ingrediente_id)
          .single();

        const cantidadDisponible = ingrediente?.cantidad || 0;
        const nombreIng = ingrediente?.nombre || 'Ingrediente desconocido';
        const unidadBase = obtenerUnidadBase(ingrediente?.categoria, ingrediente?.unidad_medida);

        return {
          success: false,
          error: `Cantidad insuficiente de ${nombreIng}. Disponible: ${cantidadDisponible} ${unidadBase}, Requerido: ${ing.cantidad} ${ing.unidad_medida}`,
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
          imagen_url: null,
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

    // Cargar imagen si existe
    if (platoInput.imagen_url) {
      const imagenUrl = await cargarImagenPlato(platoInput.imagen_url, platoCreado.id);
      if (imagenUrl) {
        const { error: errorActualizar } = await supabase
          .from('platos')
          .update({ imagen_url: imagenUrl })
          .eq('id', platoCreado.id);
        
        if (errorActualizar) {
          console.error('Error al actualizar URL de imagen:', errorActualizar);
        }
        platoCreado.imagen_url = imagenUrl;
      }
    }

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
      imagen_url: platoCreado.imagen_url,
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
        .select('ingrediente_id, cantidad, unidad_medida, ingredientes(nombre, cantidad, categoria, unidad_medida)')
        .eq('plato_id', plato.id);

      if (errorIngredientes) throw errorIngredientes;

      const ingredientesFormato: IngredientePlato[] = (ingredientes || []).map(
        (item: any) => ({
          id: item.ingrediente_id,
          nombre: item.ingredientes?.nombre || '',
          cantidad: item.cantidad,
          unidad_medida: item.unidad_medida,
          cantidad_disponible: item.ingredientes?.cantidad || 0,
          categoria: item.ingredientes?.categoria || 'otros',
          unidad_medida_stock: item.ingredientes?.unidad_medida || '',
        })
      );

      platosConIngredientes.push({
        id: plato.id,
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        ingredientes: ingredientesFormato,
        imagen_url: plato.imagen_url,
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
      .select('ingrediente_id, cantidad, unidad_medida, ingredientes(nombre, cantidad, categoria, unidad_medida)')
      .eq('plato_id', id);

    if (errorIngredientes) throw errorIngredientes;

    const ingredientesFormato: IngredientePlato[] = (ingredientes || []).map(
      (item: any) => ({
        id: item.ingrediente_id,
        nombre: item.ingredientes?.nombre || '',
        cantidad: item.cantidad,
        unidad_medida: item.unidad_medida,
        cantidad_disponible: item.ingredientes?.cantidad || 0,
        categoria: item.ingredientes?.categoria || 'otros',
        unidad_medida_stock: item.ingredientes?.unidad_medida || '',
      })
    );

    return {
      success: true,
      data: {
        id: plato.id,
        nombre: plato.nombre,
        descripcion: plato.descripcion,
        ingredientes: ingredientesFormato,
        imagen_url: plato.imagen_url,
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
    // Cargar imagen si existe
    let imagenUrl: string | null = null;
    if (platoInput.imagen_url && platoInput.imagen_url.startsWith('data:')) {
      imagenUrl = await cargarImagenPlato(platoInput.imagen_url, id);
    } else if (platoInput.imagen_url) {
      // Si ya es una URL, mantenerla
      imagenUrl = platoInput.imagen_url;
    }

    // 1. Actualizar datos básicos del plato
    const actualizacion: any = {
      nombre: platoInput.nombre.trim(),
      descripcion: platoInput.descripcion?.trim() || '',
      updated_at: new Date().toISOString(),
    };

    if (imagenUrl) {
      actualizacion.imagen_url = imagenUrl;
    }

    const { error: errorPlato } = await supabase
      .from('platos')
      .update(actualizacion)
      .eq('id', id);

    if (errorPlato) throw errorPlato;

    // 1.5 Validar stock de los nuevos ingredientes
    for (const ing of platoInput.ingredientes) {
      const validacion = await validarCantidadDisponible(
        ing.ingrediente_id,
        ing.cantidad,
        ing.unidad_medida
      );

      if (!validacion.success || !validacion.data) {
        const { data: ingrediente } = await supabase
          .from('ingredientes')
          .select('nombre, cantidad, categoria, unidad_medida')
          .eq('id', ing.ingrediente_id)
          .single();

        const cantidadDisponible = ingrediente?.cantidad || 0;
        const nombreIng = ingrediente?.nombre || 'Ingrediente desconocido';
        const unidadBase = obtenerUnidadBase(ingrediente?.categoria, ingrediente?.unidad_medida);

        return {
          success: false,
          error: `Cantidad insuficiente de ${nombreIng}. Disponible: ${cantidadDisponible} ${unidadBase}, Requerido: ${ing.cantidad} ${ing.unidad_medida}`,
        };
      }
    }

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
