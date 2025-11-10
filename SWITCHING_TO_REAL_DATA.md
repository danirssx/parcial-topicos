# Switching from Mock Data to Real Database

Your dashboard is currently using **mock data** to display reclamos while you build your database. Once your database is ready, follow these simple steps to connect it:

## Step 1: Ensure Database is Set Up

Make sure you've run the `schemadb.sql` file in your Supabase database to create all the necessary tables:
- `clientes`
- `categorias`
- `empleados`
- `reclamos`

## Step 2: Verify Environment Variables

Confirm that your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Switch to Real Data

Update the `USE_MOCK_DATA` flag to `false` in these two files:

### File 1: `app/dashboard/page.tsx`

Change line 8 from:
```typescript
const USE_MOCK_DATA = true;
```
to:
```typescript
const USE_MOCK_DATA = false;
```

### File 2: `app/dashboard/reclamos/page.tsx`

Change line 8 from:
```typescript
const USE_MOCK_DATA = true;
```
to:
```typescript
const USE_MOCK_DATA = false;
```

## Done!

That's it! Your dashboard will now fetch real data from Supabase with proper JOINs across all related tables.

## Database Structure

The queries are already configured to fetch:
- **Reclamo** data from the `reclamos` table
- **Cliente** data (nombre_completo, email) via JOIN on `cliente_id`
- **Categoría** data (nombre) via JOIN on `categoria_id`
- **Empleado** data (nombre_completo, email) via JOIN on `asignado_a`

All relationships are properly set up and ready to go!
