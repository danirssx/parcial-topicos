import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions matching the new simplified database schema
export type Reclamo = {
  id: string;
  nombre_completo: string | null;
  correo_cliente: string | null;
  descripcion: string;
  fecha_reclamo: string;
  categoria: string | null;
  estado: "nuevo" | "clasificado" | "asignado" | "en_progreso" | "resuelto" | "cerrado";
  created_at: string;
};

// Alias for backward compatibility
export type ReclamoConRelaciones = Reclamo;
