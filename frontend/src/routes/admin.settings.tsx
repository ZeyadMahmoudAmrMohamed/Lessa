import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "الإعدادات — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminSettings />
    </ProtectedRoute>
  ),
});

function AdminSettings() {
  const { t } = useTranslation();
  return (
    <DashboardShell role="admin">
      <h1 className="mb-6 text-2xl font-bold text-[#1E3A5F]">{t("settings")}</h1>
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-500">
          {t("ai_coming_soon")} — branch hours, holidays, notification templates, etc.
        </p>
      </div>
    </DashboardShell>
  );
}
