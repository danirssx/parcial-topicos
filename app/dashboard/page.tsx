import type { Reclamo } from "@/lib/supabaseClient";
import { mockReclamos } from "@/lib/mock/reclamos";
import { getReclamosStats } from "@/lib/db";

async function getStats() {
  // Using mock data for testing while database is being built
  const USE_MOCK_DATA = false; // Set to true to use mock data

  let reclamos: any[] = [];

  if (USE_MOCK_DATA) {
    console.log("📊 [Dashboard Stats] Using mock data");
    reclamos = mockReclamos;
  } else {
    try {
      console.log("📊 [Dashboard Stats] Fetching from PostgreSQL...");

      reclamos = await getReclamosStats();

      console.log(
        `✅ [Dashboard Stats] Successfully fetched ${reclamos.length} reclamos`,
      );
      console.log("✅ [Dashboard Stats] Sample data:", reclamos.slice(0, 2));
    } catch (error) {
      console.error("❌ [Dashboard Stats] Error fetching reclamos:", error);
      return {
        total: 0,
        pendientes: 0,
        resueltos: 0,
        enProceso: 0,
        reclamosRecientes: [],
      };
    }
  }
  const total = reclamos.length;
  const pendientes = reclamos.filter((r) => r.estado === "pendiente").length;
  const resueltos = reclamos.filter((r) => r.estado === "resuelto").length;
  const enProceso = reclamos.filter((r) => r.estado === "en_proceso").length;

  // Get last 7 days for the chart
  const today = new Date();
  const reclamosRecientes = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    const count = reclamos.filter((r) => {
      // Handle both Date objects from PostgreSQL and string dates
      let reclamoDate = r.fecha_reclamo || r.created_at;
      if (!reclamoDate) return false;

      // Convert to string if it's a Date object
      if (reclamoDate instanceof Date) {
        reclamoDate = reclamoDate.toISOString();
      }

      const reclamoDateStr = typeof reclamoDate === 'string' ? reclamoDate.split("T")[0] : null;
      return reclamoDateStr === dateStr;
    }).length;
    return {
      date: date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      }),
      count,
    };
  });

  return { total, pendientes, resueltos, enProceso, reclamosRecientes };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Bienvenido, Grupo 1
        </h2>
        <p className="text-sm text-gray-600 font-medium">
          Estadísticas de Reclamos — {currentDate}
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - KPIs and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* User Profiles Card */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    Clientes Únicos
                  </span>
                </div>
                <button className="text-gray-400 hover:text-orange-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-1.5">
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {stats.total > 0 ? stats.total : "N/A"}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  clientes este mes
                </p>
              </div>
            </div>

            {/* Monthly Expenses Card */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center shadow-sm">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    Resueltos
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  {stats.total > 0
                    ? `${Math.round((stats.resueltos / stats.total) * 100)}%`
                    : "0%"}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {stats.resueltos}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  reclamos resueltos
                </p>
              </div>
            </div>
          </div>

          {/* Asset Utilization Chart */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-7 transition-all duration-300">
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-lg font-bold text-gray-900">
                Actividad de Reclamos
              </h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-xs font-bold bg-gray-900 text-white rounded-xl shadow-sm hover:bg-gray-800 transition-all active:scale-95">
                  Últimos 7 días
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-3 h-48">
                {stats.reclamosRecientes.map((item, index) => {
                  const maxCount = Math.max(
                    ...stats.reclamosRecientes.map((i) => i.count),
                    1,
                  );
                  const height = (item.count / maxCount) * 100;
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-3"
                    >
                      <div className="relative w-full flex items-end justify-center h-40 group">
                        <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.count} reclamo{item.count !== 1 ? "s" : ""}
                        </div>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all hover:from-indigo-600 hover:to-indigo-500"
                          style={{
                            height: `${height}%`,
                            minHeight: item.count > 0 ? "12px" : "4px",
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        {item.date}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-xs text-gray-600">Reclamos</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Promedio: {stats.total > 0 ? Math.round(stats.total / 7) : 0}
                  /día
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="space-y-5">
            {/* Areas to Address */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-6 transition-all duration-300">
              <h3 className="text-base font-bold text-gray-900 mb-5">
                Estado de Reclamos
              </h3>
              <div className="space-y-3">
                {/* Pendientes */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-50/50 border border-yellow-200/60 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      className="w-5 h-5 text-yellow-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-semibold mb-0.5">
                      {stats.pendientes} Pendientes
                    </p>
                    <p className="text-sm font-bold text-gray-900 p-4">
                      Requieren atención
                    </p>
                  </div>
                </div>

                {/* En Proceso */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200/60 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      className="w-5 h-5 text-blue-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-semibold mb-0.5">
                      {stats.enProceso} En Proceso
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      En revisión
                    </p>
                  </div>
                </div>

                {/* Resueltos */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-50/50 border border-emerald-200/60 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg
                      className="w-5 h-5 text-emerald-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-semibold mb-0.5">
                      {stats.resueltos} Completados
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      Finalizados
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary Card */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl shadow-lg hover:shadow-xl text-white transition-all p-4 duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold opacity-90">
                  Total de Reclamos
                </p>
                <p className="text-5xl font-bold tracking-tight">
                  {stats.total}
                </p>
                <p className="text-xs font-medium opacity-80">en el sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-7 transition-all duration-300">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Ver Todos los Reclamos
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              Accede a la lista completa con detalles de cada reclamo
            </p>
          </div>
          <a
            href="/dashboard/reclamos"
            className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            Ver Lista Completa
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
