import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for the reclamos table
export type Reclamo = {
  id: number;
  nombre_cliente: string;
  email: string;
  descripcion: string;
  fecha_reclamo: string;
  estado: "pendiente" | "en_proceso" | "resuelto";
  created_at: string;
};
