import type { Reclamo } from "@/lib/supabaseClient";
import { mockReclamos } from "@/lib/mock/reclamos";
import { getReclamosStats } from "@/lib/db";
import ReclamosChart from "./components/ReclamosChart";

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

      console.log(`✅ [Dashboard Stats] Successfully fetched ${reclamos.length} reclamos`);
      console.log("✅ [Dashboard Stats] Sample data:", reclamos.slice(0, 2));
    } catch (error) {
      console.error("❌ [Dashboard Stats] Error fetching reclamos:", error);
      return {
        total: 0,
        nuevos: 0,
        resueltos: 0,
        enProceso: 0,
        reclamos: [],
      };
    }
  }
  const total = reclamos.length;
  const nuevos = reclamos.filter((r) => r.estado === "nuevo" || r.estado === "clasificado").length;
  const resueltos = reclamos.filter((r) => r.estado === "resuelto" || r.estado === "cerrado").length;
  const enProceso = reclamos.filter((r) => r.estado === "en_progreso" || r.estado === "asignado").length;

  return { total, nuevos, resueltos, enProceso, reclamos };
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
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido, Grupo 1</h2>
        <p className="text-sm text-gray-600 font-medium">Estadísticas de Reclamos — {currentDate}</p>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - KPIs and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-1">
            {/* User Profiles Card */}
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">Clientes Únicos</span>
                </div>
                <button className="text-gray-400 hover:text-orange-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1.5">
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  {stats.total > 0 ? stats.total : "N/A"}
                </p>
                <p className="text-xs text-gray-500 font-medium">clientes este mes</p>
              </div>
            </div>
          </div>

          {/* Chart Component */}
          <ReclamosChart reclamos={stats.reclamos} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="space-y-5">
            {/* Areas to Address */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-6 transition-all duration-300">
              <h3 className="text-base font-bold text-gray-900 mb-5">Estado de Reclamos</h3>
              <div className="space-y-3">
                {/* Nuevos */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-yellow-50/50 border border-yellow-200/60 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 font-semibold mb-0.5">{stats.nuevos} Nuevos</p>
                    <p className="text-sm font-bold text-gray-900 p-4">Requieren atención</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Summary Card */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl shadow-lg hover:shadow-xl text-white transition-all p-4 duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <p className="text-sm font-bold opacity-90">Total de Reclamos</p>
                <p className="text-5xl font-bold tracking-tight">{stats.total}</p>
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Ver Todos los Reclamos</h3>
            <p className="text-sm text-gray-600 font-medium">Accede a la lista completa con detalles de cada reclamo</p>
          </div>
          <a
            href="/dashboard/reclamos"
            className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            Ver Lista Completa
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
