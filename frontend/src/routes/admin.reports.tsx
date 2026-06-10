import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getAdminReports } from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { SkeletonCard } from "@/components/ui-bits";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "التقارير — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Reports />
    </ProtectedRoute>
  ),
});

function Reports() {
  const { t } = useTranslation();
  const [start, setStart] = useState("2026-06-01");
  const [end, setEnd] = useState("2026-06-09");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports", start, end],
    queryFn: () => getAdminReports(start, end),
  });

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">{t("reports")}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <DateInput label={t("start_date")} value={start} onChange={setStart} />
          <DateInput label={t("end_date")} value={end} onChange={setEnd} />
          <button
            type="button"
            onClick={() => toast.success(t("export_csv"))}
            className="inline-flex items-center gap-1 rounded-xl border border-teal-600 px-3 py-2 text-sm font-bold text-teal-600 hover:bg-teal-50"
          >
            <Download className="h-4 w-4" />
            {t("export_csv")}
          </button>
        </div>
      </div>

      {isLoading && <SkeletonCard className="h-48" />}

      {data && (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi label={t("total_transactions")} value={data.summary.total_transactions} />
            <Kpi label={t("avg_wait")} value={`${data.summary.avg_wait_minutes} ${t("minutes")}`} />
            <Kpi label={t("no_show_rate")} value={`${Math.round(data.summary.no_show_rate * 100)}%`} />
            <Kpi label={t("peak_day")} value={data.summary.peak_day} />
          </section>

          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-[#1E3A5F]">{t("daily_volume")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#0F766E"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#0F766E" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-[#1E3A5F]">
              {t("no_show_rate")} — {t("by_service")}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.no_show_by_service.map((s) => ({ ...s, pct: Math.round(s.rate * 100) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="service_name_ar" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} unit="%" />
                <Tooltip />
                <Bar dataKey="pct" fill="#DC2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </>
      )}
    </DashboardShell>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
      {label}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
      />
    </label>
  );
}

function Kpi({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#1E3A5F]">{value}</p>
    </div>
  );
}
