"use client";

import { useState } from "react";

type TimeRange = "7days" | "30days" | "3months";

interface ReclamoData {
  estado: string;
  created_at: string;
  fecha_reclamo: string;
}

interface ReclamosChartProps {
  reclamos: ReclamoData[];
}

export default function ReclamosChart({ reclamos }: ReclamosChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7days");

  const calculateChartData = (range: TimeRange) => {
    const today = new Date();
    let days = 7;
    let groupBy: "day" | "week" | "month" = "day";

    switch (range) {
      case "7days":
        days = 7;
        groupBy = "day";
        break;
      case "30days":
        days = 30;
        groupBy = "day";
        break;
      case "3months":
        days = 90;
        groupBy = "week";
        break;
    }

    if (groupBy === "day") {
      return Array.from({ length: days }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toISOString().split("T")[0];

        const count = reclamos.filter((r) => {
          const reclamoDate = r.fecha_reclamo || r.created_at;
          if (!reclamoDate) return false;

          const reclamoDateStr = reclamoDate.split("T")[0];
          return reclamoDateStr === dateStr;
        }).length;

        return {
          date: date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: range === "30days" ? "short" : "short",
          }),
          count,
        };
      });
    } else {
      // Agrupar por semanas para 3 meses
      const weeks = 12;
      return Array.from({ length: weeks }, (_, i) => {
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);

        const count = reclamos.filter((r) => {
          const reclamoDate = r.fecha_reclamo || r.created_at;
          if (!reclamoDate) return false;

          const recDate = new Date(reclamoDate);

          return recDate >= weekStart && recDate <= weekEnd;
        }).length;

        return {
          date: weekStart.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          }),
          count,
        };
      }).reverse();
    }
  };

  const chartData = calculateChartData(timeRange);
  const maxCount = Math.max(...chartData.map((i) => i.count), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/80 p-7 transition-all duration-300">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-lg font-bold text-gray-900">Actividad de Reclamos</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange("7days")}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 ${
              timeRange === "7days" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            7 días
          </button>
          <button
            onClick={() => setTimeRange("30days")}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 ${
              timeRange === "30days" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            30 días
          </button>
          <button
            onClick={() => setTimeRange("3months")}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 ${
              timeRange === "3months" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            3 meses
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-3 h-48 overflow-x-auto">
          {chartData.map((item, index) => {
            const height = (item.count / maxCount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-3 min-w-[30px]">
                <div className="relative w-full flex items-end justify-center h-40 group">
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
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
                <p className="text-xs text-gray-500 font-medium text-center">{item.date}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs text-gray-600">Reclamos</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Total: {chartData.reduce((sum, item) => sum + item.count, 0)} reclamos
          </p>
        </div>
      </div>
    </div>
  );
}
