import type { ReclamoConRelaciones } from "@/lib/supabaseClient";
import { mockReclamos } from "@/lib/mock/reclamos";
import { getAllReclamos } from "@/lib/db";

async function getReclamos(): Promise<ReclamoConRelaciones[]> {
  // Using mock data for testing while database is being built
  const USE_MOCK_DATA = false; // Set to true to use mock data

  if (USE_MOCK_DATA) {
    console.log("📋 [Reclamos List] Using mock data");
    return mockReclamos;
  }

  try {
    console.log("📋 [Reclamos List] Fetching from PostgreSQL with JOINs...");
    const reclamos = await getAllReclamos();

    console.log(`✅ [Reclamos List] Successfully fetched ${reclamos.length} reclamos`);
    console.log("✅ [Reclamos List] Sample data:", JSON.stringify(reclamos[0], null, 2));

    return reclamos;
  } catch (error) {
    console.error("❌ [Reclamos List] Error fetching reclamos:", error);
    return [];
  }
}

function getEstadoBadge(estado: string) {
  const styles = {
    pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
    en_proceso: "bg-blue-50 text-blue-700 border-blue-200",
    resuelto: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const labels = {
    pendiente: "Pendiente",
    en_proceso: "En Proceso",
    resuelto: "Resuelto",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
        styles[estado as keyof typeof styles] || styles.pendiente
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[estado as keyof typeof labels] || estado}
    </span>
  );
}

export default async function ReclamosPage() {
  const reclamos = await getReclamos();

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Todos los Reclamos
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Gestiona y revisa todos los reclamos del sistema
          </p>
        </div>
        {/*<button className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 whitespace-nowrap">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Reclamo
        </button>*/}
      </header>

      {/* Stats Summary */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {reclamos.length}
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-yellow-700"
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
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                Pendientes
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {reclamos.filter((r) => r.estado === "pendiente").length}
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-blue-700"
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
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                En Proceso
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {reclamos.filter((r) => r.estado === "en_proceso").length}
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-sm">
              <svg
                className="w-6 h-6 text-emerald-700"
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
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                Resueltos
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {reclamos.filter((r) => r.estado === "resuelto").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reclamos Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300">
        {/* Table Header with Search */}
        <div className="p-6 border-b border-gray-200/80 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              placeholder="Buscar por cliente, email o descripción..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all"
              disabled
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {reclamos.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 mb-6 shadow-sm">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              No hay reclamos
            </h3>
            <p className="text-sm text-gray-600 font-medium mb-6 max-w-sm mx-auto">
              Los reclamos aparecerán aquí cuando sean enviados al sistema
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
              Crear primer reclamo
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Fecha Reclamo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {reclamos.map((reclamo) => (
                  <tr
                    key={reclamo.id}
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {reclamo.cliente?.nombre_completo
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {reclamo.cliente?.nombre_completo || "Sin nombre"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {reclamo.cliente?.email || "Sin email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {reclamo.descripcion || "Sin descripción"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {reclamo.fecha_reclamo
                          ? new Date(reclamo.fecha_reclamo).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Sin fecha"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getEstadoBadge(reclamo.estado)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2.5 rounded-xl text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all active:scale-95 shadow-sm hover:shadow"
                          title="Ver detalles"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm hover:shadow"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 shadow-sm hover:shadow"
                          title="Eliminar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {reclamos.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300">
          <p className="text-sm text-gray-600 font-medium">
            Mostrando{" "}
            <span className="font-bold text-gray-900">{reclamos.length}</span>{" "}
            reclamo{reclamos.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled
            >
              Anterior
            </button>
            <button
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
