export interface IngredienteDisponible {
    id: string;
    nombre: string;
    cantidad: number;
    categoria: string;
    unidad_medida?: string;
}

export interface IngredientePlato {
    id: string;
    nombre: string;
    cantidad: number;
    unidad_medida: string;
    cantidad_disponible?: number;
    categoria?: string;
    unidad_medida_stock?: string;
}

export interface Plato {
    id: string;
    nombre: string;
    descripcion: string;
    ingredientes: IngredientePlato[];
    activo: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreatePlatoInput {
    nombre: string;
    descripcion: string;
    ingredientes: {
        ingrediente_id: string;
        cantidad: number;
        unidad_medida: string;
    }[];
}

export interface SuccessResponse<T> {
    success: true;
    data: T;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;