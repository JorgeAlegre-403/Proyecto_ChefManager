import type { Plato } from './plato';

export interface Menu {
  id: string;
  nombre: string;
  fecha: string;
  visible: boolean;
  notas: string;
  platos: MenuPlatoRelacion[];
  activo: boolean;
  created_at?: string;
  creado_por?: string;
}

export interface MenuPlatoRelacion extends Plato {
  servicio?: string;
  orden?: number;
}

export interface MenuInput {
  nombre: string;
  fecha: string;
  notas: string;
  platos: {
    plato_id: string;
    servicio: string;
    orden: number;
  }[];
}
