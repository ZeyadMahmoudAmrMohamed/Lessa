import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getDailySummary } from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { SkeletonCard } from "@/components/ui-bits";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/supervisor/summary")({
  head: () => ({ meta: [{ title: "الملخص اليومي — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["supervisor"]}>
      <DailySummary />
    </ProtectedRoute>
  ),
});

const PIE_COLORS = ["#16A34A", "#F59E0B", "#DC2626"];

function DailySummary() {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const { data, isLoading } = useQuery({
    queryKey: ["daily-summary", date],
    queryFn: () => getDailySummary(date),
  });

  return (
    <DashboardShell role="supervisor">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">{t("daily_summary")}</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        />
      </div>

      {isLoading && <SkeletonCard className="h-32" />}
      {data && (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["issued", data.stats.issued],
              ["served", data.stats.served],
              ["skipped", data.stats.skipped],
              ["no_shows", data.stats.no_show],
              ["avg_wait", `${data.stats.avg_wait_minutes}${t("minutes")[0]}`],
              ["peak_hour", data.stats.peak_hour],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">{t(k as any)}</p>
                <p className="mt-1 text-xl font-black text-[#1E3A5F]">{v as any}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="mb-4 text-sm font-bold text-[#1E3A5F]">{t("hourly_volume")}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.hourly}>
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0F766E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-[#1E3A5F]">{t("outcome_breakdown")}</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: t("served"), value: data.stats.served },
                      { name: t("skipped"), value: data.stats.skipped },
                      { name: t("no_shows"), value: data.stats.no_show },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PIE_COLORS.map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="mb-3 text-sm font-bold text-[#1E3A5F]">{t("by_service")}</h3>
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-start">{t("service")}</th>
                    <th className="px-4 py-3">{t("issued")}</th>
                    <th className="px-4 py-3">{t("served")}</th>
                    <th className="px-4 py-3">{t("no_shows")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.by_service.map((s) => (
                    <tr key={s.service_name_ar} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">{s.service_name_ar}</td>
                      <td className="px-4 py-3 text-center font-mono">{s.issued}</td>
                      <td className="px-4 py-3 text-center font-mono text-green-700">{s.served}</td>
                      <td className="px-4 py-3 text-center font-mono text-red-700">{s.no_show}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </DashboardShell>
  );
}
