import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSupervisorDashboard,
  setWindowStatus,
  assignWindowStaff,
} from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { SkeletonCard, StatusChip, ConfirmModal } from "@/components/ui-bits";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/supervisor/dashboard")({
  head: () => ({ meta: [{ title: "لوحة المشرف — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["supervisor"]}>
      <SupervisorDashboard />
    </ProtectedRoute>
  ),
});

const STAFF_OPTIONS = [
  { id: "staff-001", name: "مريم علي" },
  { id: "staff-002", name: "كريم سالم" },
  { id: "staff-003", name: "أحمد حسن" },
];

function SupervisorDashboard() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["supervisor-dashboard"],
    queryFn: getSupervisorDashboard,
    refetchInterval: 10000,
  });
  const toggle = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "open" | "closed" }) =>
      setWindowStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["supervisor-dashboard"] }),
  });
  const assign = useMutation({
    mutationFn: ({ id, staff }: { id: string; staff: { id: string; name: string } }) =>
      assignWindowStaff(id, staff),
    onSuccess: () => {
      toast.success(t("assign_staff"));
      qc.invalidateQueries({ queryKey: ["supervisor-dashboard"] });
    },
  });

  const [closingId, setClosingId] = useState<string | null>(null);
  const [assignFor, setAssignFor] = useState<string | null>(null);

  return (
    <DashboardShell role="supervisor">
      <h1 className="mb-6 text-2xl font-bold text-[#1E3A5F]">{t("supervisor_dashboard")}</h1>

      {/* Summary */}
      {isLoading && <SkeletonCard className="h-24" />}
      {data && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryStat label={t("active_windows")} value={data.summary.active_windows} />
          <SummaryStat label={t("total_tickets_today")} value={data.summary.total_tickets_today} />
          <SummaryStat label={t("currently_waiting")} value={data.summary.currently_waiting} />
          <SummaryStat
            label={t("avg_wait")}
            value={`${data.summary.avg_wait_minutes} ${t("minutes")}`}
          />
        </section>
      )}

      {/* Windows */}
      <h2 className="mb-3 mt-8 text-lg font-bold text-[#1E3A5F]">{t("windows")}</h2>
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} className="h-48" />
          ))}
        </div>
      )}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.windows.map((w) => (
            <article key={w.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">{t("window")}</p>
                  <p className="text-3xl font-black text-[#1E3A5F]">#{w.number}</p>
                </div>
                <StatusChip status={w.status} />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-600">{w.service.name_ar}</p>
              <p className="mt-2 text-xs text-slate-500">
                {w.assigned_staff ? (
                  <>👤 {w.assigned_staff.name}</>
                ) : (
                  <span className="text-amber-700">⚠ {t("unassigned")}</span>
                )}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-slate-500">{t("tickets_served_today")}</dt>
                  <dd className="font-bold text-slate-700">{w.tickets_served_today}</dd>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <dt className="text-slate-500">{t("current_queue_size")}</dt>
                  <dd className="font-bold text-slate-700">{w.current_queue_size}</dd>
                </div>
              </dl>
              <div className="mt-4 flex gap-2">
                {w.status === "open" ? (
                  <button
                    type="button"
                    onClick={() => setClosingId(w.id)}
                    className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                  >
                    {t("close_window")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggle.mutate({ id: w.id, status: "open" })}
                    className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
                  >
                    {t("open_window")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAssignFor(w.id)}
                  className="inline-flex items-center gap-1 rounded-xl border border-teal-600 px-3 py-2 text-xs font-bold text-teal-600 hover:bg-teal-50"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  {t("assign_staff")}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!closingId}
        title={t("close_window") + "?"}
        message={t("deactivate_confirm")}
        onCancel={() => setClosingId(null)}
        onConfirm={() => {
          if (closingId) toggle.mutate({ id: closingId, status: "closed" });
          setClosingId(null);
        }}
      />

      {assignFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAssignFor(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1E3A5F]">{t("assign_staff")}</h3>
            <ul className="mt-4 space-y-2">
              {STAFF_OPTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      assign.mutate({ id: assignFor, staff: s });
                      setAssignFor(null);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-start text-sm font-semibold hover:border-teal-600 hover:bg-teal-50"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setAssignFor(null)}
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function SummaryStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#1E3A5F]">{value}</p>
    </div>
  );
}
