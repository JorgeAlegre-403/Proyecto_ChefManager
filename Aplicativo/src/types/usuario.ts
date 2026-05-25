export interface Usuario {
  id: string;
  email: string;
  user_metadata?: {
    role?: 'admin' | 'jefecocina' | 'cocinero';
    nombre?: string;
  };
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

export interface CreateUsuarioInput {
  email: string;
  password: string;
  role: 'admin' | 'jefecocina' | 'cocinero';
}

export interface RestablecerContraseñaInput {
  email: string;
  nuevaContraseña: string;
  token: string;
}
