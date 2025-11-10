

## 2️⃣ Instalar Supabase (y opcionalmente gráficos)

```bash
npm install @supabase/supabase-js
# opcional para gráficas:
npm install recharts
```

---

## 3️⃣ Configurar las env vars de Supabase

En `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
```

(Estos los sacas del panel de Supabase → Project Settings → API.)

---

## 4️⃣ Cliente de Supabase (reutilizable)

Crea `src/lib/supabaseClient.ts`:

```ts
// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 5️⃣ Layout base del dashboard

Asumiendo que usarás la carpeta `app/`, crea un layout general con un mini sidebar.

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Reclamos",
  description: "Dashboard conectado a Supabase + n8n",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 p-4">
            <h1 className="text-xl font-bold mb-6">Panel</h1>
            <nav className="space-y-2 text-sm">
              <a href="/dashboard" className="block hover:text-sky-400">
                Resumen
              </a>
              <a href="/dashboard/reclamos" className="block hover:text-sky-400">
                Reclamos
              </a>
              {/* más links si quieres */}
            </nav>
          </aside>

          {/* Contenido */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
```

---

## 6️⃣ Página principal del dashboard (con Supabase)

Supongamos que tienes una tabla `reclamos` con columnas:

* `id`
* `estado` (por ejemplo: `"pendiente" | "en_proceso" | "resuelto"`)
* `created_at`

Creamos `/dashboard` como **Server Component** que lee directo de Supabase:

`src/app/dashboard/page.tsx`:

```tsx
import { supabase } from "@/lib/supabaseClient";

type Reclamo = {
  id: number;
  estado: string;
  created_at: string;
};

async function getStats() {
  const { data, error } = await supabase
    .from<Reclamo>("reclamos")
    .select("id, estado, created_at");

  if (error) {
    console.error(error);
    return {
      total: 0,
      pendientes: 0,
      resueltos: 0,
      enProceso: 0,
    };
  }

  const total = data.length;
  const pendientes = data.filter((r) => r.estado === "pendiente").length;
  const resueltos = data.filter((r) => r.estado === "resuelto").length;
  const enProceso = data.filter((r) => r.estado === "en_proceso").length;

  return { total, pendientes, resueltos, enProceso };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Resumen general</h2>
        <p className="text-slate-400 text-sm">
          Métricas generadas a partir de los datos que llegan desde n8n.
        </p>
      </header>

      {/* Tarjetas de métricas */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-800 p-4">
          <p className="text-xs uppercase text-slate-400">Total reclamos</p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="rounded-xl border border-slate-800 p-4">
          <p className="text-xs uppercase text-slate-400">Pendientes</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">
            {stats.pendientes}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 p-4">
          <p className="text-xs uppercase text-slate-400">En proceso</p>
          <p className="mt-2 text-2xl font-bold text-sky-400">
            {stats.enProceso}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 p-4">
          <p className="text-xs uppercase text-slate-400">Resueltos</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {stats.resueltos}
          </p>
        </div>
      </section>
    </div>
  );
}
```

Con eso ya tienes:

* Proyecto Next 14 con `app/`.
* Layout con sidebar.
* Página `/dashboard` que **lee de Supabase** y muestra KPIs básicos.

---

## 7️⃣ Probar el build

```bash
npm run dev
# y abre http://localhost:3000/dashboard
```

---

Si quieres, en el siguiente mensaje te puedo:

* Añadir una página `app/dashboard/reclamos/page.tsx` con una **tabla** paginada.
* O integrar **Recharts** para meter una gráfica de reclamos por día/estado.
