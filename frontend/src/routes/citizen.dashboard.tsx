import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveTicket, getTicketHistory, cancelTicket } from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TopBar } from "@/components/TopBar";
import { SkeletonCard, ConfirmModal, StatusChip } from "@/components/ui-bits";
import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Inbox } from "lucide-react";

export const Route = createFileRoute("/citizen/dashboard")({
  head: () => ({ meta: [{ title: "لوحة المواطن — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <CitizenDashboard />
    </ProtectedRoute>
  ),
});

function CitizenDashboard() {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const ticketQuery = useQuery({
    queryKey: ["active-ticket"],
    queryFn: getActiveTicket,
    refetchInterval: 5000,
    staleTime: 0,
  });
  const historyQuery = useQuery({
    queryKey: ["ticket-history"],
    queryFn: getTicketHistory,
  });
  const cancel = useMutation({
    mutationFn: (id: string) => cancelTicket(id),
    onSuccess: () => {
      toast.success(t("booking_cancelled"));
      qc.invalidateQueries({ queryKey: ["active-ticket"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      setConfirming(false);
    },
  });

  const ticket = ticketQuery.data?.ticket ?? null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#1E3A5F]">{t("citizen_dashboard")}</h1>

        {ticketQuery.isLoading && <SkeletonCard className="h-72" />}

        {!ticketQuery.isLoading && ticket && (
          <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm font-semibold text-slate-500">{t("your_number")}</p>
              <p className="text-7xl font-black text-teal-600">{ticket.queue_number}</p>
              <p className="text-lg font-bold text-[#1E3A5F]">
                {i18n.language === "ar" ? ticket.service.name_ar : ticket.service.name_en}
              </p>
              <StatusChip status={ticket.status} />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label={t("your_position")} value={`${ticket.position} / ${ticket.queue_total}`} />
              <Stat label={t("est_wait")} value={`${ticket.estimated_wait_minutes} ${t("minutes")}`} />
              <Stat label={t("window")} value={ticket.window_number ?? "—"} />
            </dl>

            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-teal-600 transition-all"
                  style={{
                    width: `${Math.max(8, ((ticket.queue_total - ticket.position) / ticket.queue_total) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                {i18n.language === "ar" ? "آخر تحديث: " : "Updated: "}
                {new Date(ticketQuery.dataUpdatedAt).toLocaleTimeString(i18n.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => ticketQuery.refetch()}
                  className="inline-flex items-center gap-1 rounded-xl border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t("refresh")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  {t("cancel_booking")}
                </button>
              </div>
            </div>
          </section>
        )}

        {!ticketQuery.isLoading && !ticket && (
          <section className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
              <Inbox className="h-10 w-10 text-teal-600" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#1E3A5F]">{t("no_active_booking")}</h2>
            <Link
              to="/citizen/book"
              className="mt-6 inline-block rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700"
            >
              {t("book_a_slot_now")}
            </Link>
          </section>
        )}

        {/* History */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-[#1E3A5F]">{t("recent_history")}</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {historyQuery.isLoading && <SkeletonCard className="h-32 rounded-none" />}
            {!historyQuery.isLoading && historyQuery.data && historyQuery.data.tickets.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">{t("no_history")}</p>
            )}
            {historyQuery.data && historyQuery.data.tickets.length > 0 && (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-start">{t("service")}</th>
                    <th className="px-4 py-3 text-start">#</th>
                    <th className="px-4 py-3 text-start">{t("date")}</th>
                    <th className="px-4 py-3 text-start">{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {historyQuery.data.tickets.map((h) => (
                    <tr key={h.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-700">{h.service_name_ar}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{h.queue_number}</td>
                      <td className="px-4 py-3 text-slate-500">{h.date}</td>
                      <td className="px-4 py-3"><StatusChip status={h.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <ConfirmModal
        open={confirming}
        title={t("cancel_booking_confirm")}
        onCancel={() => setConfirming(false)}
        onConfirm={() => ticket && cancel.mutate(ticket.id)}
        loading={cancel.isPending}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-[#1E3A5F]">{value}</p>
    </div>
  );
}
