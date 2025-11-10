import { Pool } from "pg";
import type { Reclamo } from "./supabaseClient";

// Create a connection pool using the DATABASE_URL or POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

/**
 * Fetch all reclamos from the simplified single table
 */
export async function getAllReclamos(): Promise<Reclamo[]> {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT
        id::text,
        nombre_completo,
        correo_cliente,
        descripcion,
        fecha_reclamo::text,
        categoria,
        estado,
        created_at::text
      FROM reclamos
      ORDER BY created_at DESC
    `);

    return result.rows as Reclamo[];
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
 * Get count of reclamos in the table
 */
export async function getTableCounts() {
  const client = await pool.connect();

  try {
    const result = await client.query("SELECT COUNT(*) as count FROM reclamos");

    return {
      reclamos: parseInt(result.rows[0].count),
    };
  } catch (error) {
    console.error("❌ [DB] Error getting table counts:", error);
    throw error;
  } finally {
    client.release();
  }
}
