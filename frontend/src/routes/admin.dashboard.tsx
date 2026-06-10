import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { SkeletonCard } from "@/components/ui-bits";
import { Boxes, Users, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "لوحة المسؤول — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});

function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  return (
    <DashboardShell role="admin">
      <h1 className="mb-6 text-2xl font-bold text-[#1E3A5F]">{t("admin_dashboard")}</h1>

      {isLoading && <SkeletonCard className="h-32" />}
      {data && (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label={t("total_users")} value={data.stats.total_users} />
            <Stat label={t("active_services")} value={data.stats.active_services} />
            <Stat label={t("todays_tickets")} value={data.stats.todays_tickets} />
            <Stat label={t("no_show_rate")} value={`${Math.round(data.stats.no_show_rate * 100)}%`} />
          </section>

          <section className="mt-6 grid gap-3 sm:grid-cols-3">
            <QuickLink to="/admin/reports" icon={FileBarChart} label={t("view_reports")} />
            <QuickLink to="/admin/users" icon={Users} label={t("add_user")} />
            <QuickLink to="/admin/services" icon={Boxes} label={t("add_service")} />
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-[#1E3A5F]">{t("recent_activity")}</h2>
            <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-sm">
              {data.activity.map((a) => (
                <li key={a.id} className="flex items-center justify-between p-4">
                  <span className="text-sm text-slate-700">
                    {i18n.language === "ar" ? a.text_ar : a.text_en}
                  </span>
                  <span className="text-xs text-slate-400">{a.at}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#1E3A5F]">{value}</p>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-teal-600 hover:bg-teal-50"
    >
      <div className="rounded-xl bg-teal-100 p-2 text-teal-700">
        <Icon className="h-5 w-5" />
      </div>
      <span className="font-semibold text-[#1E3A5F]">{label}</span>
    </Link>
  );
}
