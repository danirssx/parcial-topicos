import { supabase } from "@/lib/supabaseClient";
import type { Reclamo } from "@/lib/supabaseClient";

async function getStats() {
  const { data, error } = await supabase
    .from("reclamos")
    .select("id, estado, created_at, fecha_reclamo");

  if (error) {
    console.error("Error fetching reclamos:", error);
    return {
      total: 0,
      pendientes: 0,
      resueltos: 0,
      enProceso: 0,
      reclamosRecientes: [],
    };
  }

  const reclamos = data || [];
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
      const reclamoDate = r.fecha_reclamo?.split("T")[0] || r.created_at?.split("T")[0];
      return reclamoDate === dateStr;
    }).length;
    return {
      date: date.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
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
    day: "numeric"
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Bienvenido, Grupo 1</h2>
        <p className="text-sm text-gray-500">
          Estadísticas de Reclamos — {currentDate}
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - KPIs and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* User Profiles Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Clientes Únicos</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">{stats.total > 0 ? stats.total : "N/A"}</p>
                <p className="text-xs text-gray-500">clientes este mes</p>
              </div>
            </div>

            {/* Monthly Expenses Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Resueltos</span>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stats.total > 0 ? `${Math.round((stats.resueltos / stats.total) * 100)}%` : "0%"}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-gray-900">{stats.resueltos}</p>
                <p className="text-xs text-gray-500">reclamos resueltos</p>
              </div>
            </div>
          </div>

          {/* Asset Utilization Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-gray-900">Actividad de Reclamos</h3>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg">
                  Últimos 7 días
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-3 h-48">
                {stats.reclamosRecientes.map((item, index) => {
                  const maxCount = Math.max(...stats.reclamosRecientes.map((i) => i.count), 1);
                  const height = (item.count / maxCount) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3">
                      <div className="relative w-full flex items-end justify-center h-40 group">
                        <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.count} reclamo{item.count !== 1 ? "s" : ""}
                        </div>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all hover:from-indigo-600 hover:to-indigo-500"
                          style={{ height: `${height}%`, minHeight: item.count > 0 ? "12px" : "4px" }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{item.date}</p>
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
                  Promedio: {stats.total > 0 ? Math.round(stats.total / 7) : 0}/día
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="space-y-4">
            {/* Areas to Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Estado de Reclamos</h3>
              <div className="space-y-3">
                {/* Pendientes */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{stats.pendientes} Pendientes</p>
                    <p className="text-sm font-semibold text-gray-900">Requieren atención</p>
                  </div>
                </div>

                {/* En Proceso */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{stats.enProceso} En Proceso</p>
                    <p className="text-sm font-semibold text-gray-900">En revisión</p>
                  </div>
                </div>

                {/* Resueltos */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{stats.resueltos} Completados</p>
                    <p className="text-sm font-semibold text-gray-900">Finalizados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium opacity-90">Total de Reclamos</p>
                <p className="text-4xl font-bold">{stats.total}</p>
                <p className="text-xs opacity-75">en el sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Ver Todos los Reclamos</h3>
            <p className="text-sm text-gray-500">Accede a la lista completa con detalles de cada reclamo</p>
          </div>
          <a
            href="/dashboard/reclamos"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            Ver Lista Completa
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
