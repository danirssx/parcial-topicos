import pg from "pg";
import { config } from "dotenv";

const { Pool } = pg;

// Load environment variables from .env.local
config({ path: ".env.local" });

console.log("🔧 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Loaded" : "❌ Not found");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testPostgresConnection() {
  console.log("\n🔍 Testing PostgreSQL connection via Transaction Pooler...\n");

  const client = await pool.connect();

  try {
    // Test 1: Check connection
    console.log("📋 Test 1: Testing connection...");
    const timeResult = await client.query("SELECT NOW() as current_time");
    console.log("✅ Connection successful!");
    console.log("   Current time:", timeResult.rows[0].current_time);

    // Test 2: Count records in each table
    console.log("\n📋 Test 2: Counting records in tables...");
    const [clientes, categorias, empleados, reclamos] = await Promise.all([
      client.query("SELECT COUNT(*) as count FROM clientes"),
      client.query("SELECT COUNT(*) as count FROM categorias"),
      client.query("SELECT COUNT(*) as count FROM empleados"),
      client.query("SELECT COUNT(*) as count FROM reclamos"),
    ]);

    console.log("✅ Table counts:");
    console.log(`   - Clientes: ${clientes.rows[0].count}`);
    console.log(`   - Categorías: ${categorias.rows[0].count}`);
    console.log(`   - Empleados: ${empleados.rows[0].count}`);
    console.log(`   - Reclamos: ${reclamos.rows[0].count}`);

    // Test 3: Fetch reclamos with JOINs
    console.log("\n📋 Test 3: Fetching reclamos with JOINs...");
    const result = await client.query(`
      SELECT
        r.*,
        json_build_object(
          'id', c.id,
          'nombre_completo', c.nombre_completo,
          'email', c.email
        ) as cliente,
        json_build_object(
          'id', cat.id,
          'nombre', cat.nombre
        ) as categoria
      FROM reclamos r
      LEFT JOIN clientes c ON r.cliente_id = c.id
      LEFT JOIN categorias cat ON r.categoria_id = cat.id
      ORDER BY r.created_at DESC
      LIMIT 3
    `);

    console.log(`✅ Fetched ${result.rows.length} reclamos`);
    if (result.rows.length > 0) {
      console.log("\n📊 Sample reclamo:");
      console.log(JSON.stringify(result.rows[0], null, 2));
    }

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

testPostgresConnection();
