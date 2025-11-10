import { Pool } from "pg";
import type { ReclamoConRelaciones } from "./supabaseClient";

// Create a connection pool using the DATABASE_URL or POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

/**
 * Fetch all reclamos with joined data from related tables
 */
export async function getAllReclamos(): Promise<ReclamoConRelaciones[]> {
  const client = await pool.connect();

  try {
    console.log("🔍 [DB] Fetching reclamos with JOINs...");

    const result = await client.query(`
      SELECT
        r.id::text,
        r.cliente_id::text,
        r.categoria_id::text,
        r.asignado_a::text,
        r.descripcion,
        r.fecha_reclamo::text,
        r.estado,
        r.created_at::text,
        json_build_object(
          'id', c.id::text,
          'nombre_completo', c.nombre_completo,
          'email', c.email,
          'direccion', c.direccion,
          'created_at', c.created_at::text
        ) as cliente,
        json_build_object(
          'id', cat.id::text,
          'nombre', cat.nombre
        ) as categoria,
        json_build_object(
          'id', e.id::text,
          'nombre_completo', e.nombre_completo,
          'email', e.email,
          'categoria_id', e.categoria_id::text,
          'created_at', e.created_at::text
        ) as empleado
      FROM reclamos r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN categorias cat ON r.categoria_id = cat.id
      LEFT JOIN empleados e ON r.asignado_a = e.id
      ORDER BY r.created_at DESC
    `);

    console.log(`✅ [DB] Fetched ${result.rows.length} reclamos`);

    return result.rows as ReclamoConRelaciones[];
  } catch (error) {
    console.error("❌ [DB] Error fetching reclamos:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Fetch basic reclamos data for statistics
 */
export async function getReclamosStats(): Promise<{
  id: string;
  estado: string;
  created_at: string;
  fecha_reclamo: string;
}[]> {
  const client = await pool.connect();

  try {
    console.log("📊 [DB] Fetching reclamos stats...");

    const result = await client.query(`
      SELECT
        id::text,
        estado,
        created_at::text,
        fecha_reclamo::text
      FROM reclamos
      ORDER BY created_at DESC
    `);

    console.log(`✅ [DB] Fetched ${result.rows.length} reclamos for stats`);

    return result.rows as any[];
  } catch (error) {
    console.error("❌ [DB] Error fetching reclamos stats:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test database connection
 */
export async function testConnection() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT NOW() as current_time");
    console.log("✅ [DB] Connection successful:", result.rows[0]);
    return true;
  } catch (error) {
    console.error("❌ [DB] Connection failed:", error);
    return false;
  } finally {
    client.release();
  }
}

/**
 * Get count of records in each table
 */
export async function getTableCounts() {
  const client = await pool.connect();

  try {
    const [clientes, categorias, empleados, reclamos] = await Promise.all([
      client.query("SELECT COUNT(*) as count FROM clientes"),
      client.query("SELECT COUNT(*) as count FROM categorias"),
      client.query("SELECT COUNT(*) as count FROM empleados"),
      client.query("SELECT COUNT(*) as count FROM reclamos"),
    ]);

    return {
      clientes: parseInt(clientes.rows[0].count),
      categorias: parseInt(categorias.rows[0].count),
      empleados: parseInt(empleados.rows[0].count),
      reclamos: parseInt(reclamos.rows[0].count),
    };
  } catch (error) {
    console.error("❌ [DB] Error getting table counts:", error);
    throw error;
  } finally {
    client.release();
  }
}
