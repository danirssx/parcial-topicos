// Quick script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bfnayhhospmoaukljmnq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbmF5aGhvc3Btb2F1a2xqbW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NTg4NTQsImV4cCI6MjA3ODMzNDg1NH0.bBaNm0ejNxn4uNro1rQ61cZwtW-CveDCzgnAh7elAuI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Test 1: Check clientes table
  console.log('📋 Checking clientes table:');
  const { data: clientes, error: clientesError } = await supabase
    .from('clientes')
    .select('*')
    .limit(3);

  if (clientesError) {
    console.error('❌ Error:', clientesError);
  } else {
    console.log(`✅ Found ${clientes?.length || 0} clientes`);
    console.log(JSON.stringify(clientes, null, 2));
  }

  console.log('\n📋 Checking reclamos table:');
  const { data: reclamos, error: reclamosError } = await supabase
    .from('reclamos')
    .select('*')
    .limit(3);

  if (reclamosError) {
    console.error('❌ Error:', reclamosError);
  } else {
    console.log(`✅ Found ${reclamos?.length || 0} reclamos`);
    console.log(JSON.stringify(reclamos, null, 2));
  }

  console.log('\n📋 Testing JOIN query:');
  const { data: joined, error: joinError } = await supabase
    .from('reclamos')
    .select(`
      *,
      cliente:clientes!cliente_id (
        id,
        nombre_completo,
        email
      ),
      categoria:categorias!categoria_id (
        id,
        nombre
      )
    `)
    .limit(2);

  if (joinError) {
    console.error('❌ Error:', joinError);
  } else {
    console.log(`✅ Found ${joined?.length || 0} reclamos with relations`);
    console.log(JSON.stringify(joined, null, 2));
  }
}

testConnection().then(() => {
  console.log('\n✅ Test complete!');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
