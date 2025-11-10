// Script to insert sample data into Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bfnayhhospmoaukljmnq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbmF5aGhvc3Btb2F1a2xqbW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NTg4NTQsImV4cCI6MjA3ODMzNDg1NH0.bBaNm0ejNxn4uNro1rQ61cZwtW-CveDCzgnAh7elAuI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertSampleData() {
  console.log('📝 Inserting sample data into Supabase...\n');

  // 1. Insert Categorías
  console.log('📋 Inserting categorías...');
  const { data: categorias, error: catError } = await supabase
    .from('categorias')
    .insert([
      { nombre: 'Producto Dañado' },
      { nombre: 'Envío Incorrecto' },
      { nombre: 'Problema de Calidad' },
      { nombre: 'Error de Facturación' },
      { nombre: 'Retraso en Entrega' }
    ])
    .select();

  if (catError) {
    console.error('❌ Error inserting categorías:', catError);
    return;
  }
  console.log(`✅ Inserted ${categorias.length} categorías`);

  // 2. Insert Clientes
  console.log('\n📋 Inserting clientes...');
  const { data: clientes, error: cliError } = await supabase
    .from('clientes')
    .insert([
      { nombre_completo: 'Juan Pérez', email: 'juan.perez@email.com', direccion: 'Calle Principal 123' },
      { nombre_completo: 'María González', email: 'maria.gonzalez@email.com', direccion: 'Avenida Central 456' },
      { nombre_completo: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', direccion: 'Plaza Mayor 789' },
      { nombre_completo: 'Ana Martínez', email: 'ana.martinez@email.com', direccion: 'Calle Secundaria 321' },
      { nombre_completo: 'Luis Fernández', email: 'luis.fernandez@email.com', direccion: null },
      { nombre_completo: 'Elena Torres', email: 'elena.torres@email.com', direccion: 'Urbanización Norte 654' }
    ])
    .select();

  if (cliError) {
    console.error('❌ Error inserting clientes:', cliError);
    return;
  }
  console.log(`✅ Inserted ${clientes.length} clientes`);

  // 3. Insert Empleados
  console.log('\n📋 Inserting empleados...');
  const { data: empleados, error: empError } = await supabase
    .from('empleados')
    .insert([
      { nombre_completo: 'Pedro Admin', email: 'pedro.admin@empresa.com', categoria_id: categorias[0].id },
      { nombre_completo: 'Sofía Soporte', email: 'sofia.soporte@empresa.com', categoria_id: categorias[1].id },
      { nombre_completo: 'Roberto Gestor', email: 'roberto.gestor@empresa.com', categoria_id: categorias[2].id }
    ])
    .select();

  if (empError) {
    console.error('❌ Error inserting empleados:', empError);
    return;
  }
  console.log(`✅ Inserted ${empleados.length} empleados`);

  // 4. Insert Reclamos
  console.log('\n📋 Inserting reclamos...');
  const { data: reclamos, error: recError } = await supabase
    .from('reclamos')
    .insert([
      {
        cliente_id: clientes[0].id,
        categoria_id: categorias[0].id,
        asignado_a: empleados[0].id,
        descripcion: 'El producto llegó dañado y no coincide con la descripción del sitio web.',
        fecha_reclamo: '2025-11-08T10:30:00Z',
        estado: 'pendiente'
      },
      {
        cliente_id: clientes[1].id,
        categoria_id: categorias[1].id,
        asignado_a: empleados[1].id,
        descripcion: 'Nunca recibí mi pedido a pesar de que el tracking dice que fue entregado.',
        fecha_reclamo: '2025-11-07T14:20:00Z',
        estado: 'en_proceso'
      },
      {
        cliente_id: clientes[2].id,
        categoria_id: categorias[1].id,
        asignado_a: empleados[1].id,
        descripcion: 'La talla del producto no es la correcta. Pedí una talla L y me enviaron una M.',
        fecha_reclamo: '2025-11-06T09:15:00Z',
        estado: 'resuelto'
      },
      {
        cliente_id: clientes[3].id,
        categoria_id: categorias[2].id,
        asignado_a: null,
        descripcion: 'El color del artículo no coincide con las fotos mostradas en el sitio.',
        fecha_reclamo: '2025-11-09T16:45:00Z',
        estado: 'pendiente'
      },
      {
        cliente_id: clientes[4].id,
        categoria_id: categorias[2].id,
        asignado_a: empleados[2].id,
        descripcion: 'El producto tiene defectos de fabricación. La cremallera está rota.',
        fecha_reclamo: '2025-11-05T11:00:00Z',
        estado: 'resuelto'
      },
      {
        cliente_id: clientes[5].id,
        categoria_id: categorias[1].id,
        asignado_a: empleados[1].id,
        descripcion: 'Mi pedido llegó incompleto. Faltan 2 artículos de los 5 que ordené.',
        fecha_reclamo: '2025-11-08T13:30:00Z',
        estado: 'en_proceso'
      }
    ])
    .select();

  if (recError) {
    console.error('❌ Error inserting reclamos:', recError);
    return;
  }
  console.log(`✅ Inserted ${reclamos.length} reclamos`);

  console.log('\n🎉 Sample data inserted successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${categorias.length} categorías`);
  console.log(`  - ${clientes.length} clientes`);
  console.log(`  - ${empleados.length} empleados`);
  console.log(`  - ${reclamos.length} reclamos`);
}

insertSampleData().then(() => {
  console.log('\n✅ Done! You can now refresh your dashboard to see the data.');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Failed:', error);
  process.exit(1);
});
