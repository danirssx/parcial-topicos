import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions matching the actual database schema

export type Cliente = {
  id: string;
  nombre_completo: string;
  email: string;
  direccion: string | null;
  created_at: string;
};

export type Categoria = {
  id: string;
  nombre: string;
};

export type Empleado = {
  id: string;
  nombre_completo: string;
  email: string;
  categoria_id: string;
  created_at: string;
};

export type Reclamo = {
  id: string;
  cliente_id: string;
  categoria_id: string | null;
  asignado_a: string | null;
  descripcion: string;
  fecha_reclamo: string;
  estado: "nuevo" | "pendiente" | "en_proceso" | "resuelto";
  created_at: string;
};

// Extended type with joined data for display
export type ReclamoConRelaciones = Reclamo & {
  cliente: Cliente;
  categoria: Categoria | null;
  empleado: Empleado | null;
};
