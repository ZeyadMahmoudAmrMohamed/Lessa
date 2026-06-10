import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaffQueue, callNextTicket, setTicketStatus } from "@/lib/mock-api";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TopBar } from "@/components/TopBar";
import { SkeletonCard, StatusChip } from "@/components/ui-bits";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/queue")({
  head: () => ({ meta: [{ title: "إدارة الطابور — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["staff"]}>
      <StaffQueue />
    </ProtectedRoute>
  ),
});

function StaffQueue() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();

  // Poll my-window every 10s so staff see their queue even if assigned after login
  const windowQuery = useQuery({
    queryKey: ["my-window"],
    queryFn: () => apiFetch<{ window: { id: string; number: number } | null }>("/api/staff/my-window"),
    refetchInterval: 10000,
  });
  const windowId = windowQuery.data?.window?.id ?? user?.window_id ?? "";

  const queueQuery = useQuery({
    queryKey: ["staff-queue", windowId],
    queryFn: () => getStaffQueue(windowId),
    refetchInterval: 5000,
    enabled: !!windowId,
  });
  const callNext = useMutation({
    mutationFn: () => callNextTicket(windowId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff-queue"] }),
    onError: () => toast.error(t("queue_empty")),
  });
  const updateStatus = useMutation({
    mutationFn: (s: "done" | "skipped" | "no_show") => {
      const ticketId = queueQuery.data?.active_ticket?.id;
      if (!ticketId) throw new Error("NO_ACTIVE");
      return setTicketStatus(ticketId, s);
    },
    onSuccess: (_d, s) => {
      toast.success(t(`status_${s}` as any));
      qc.invalidateQueries({ queryKey: ["staff-queue"] });
    },
  });

  const data = queueQuery.data;

  if (!windowId) {
    return (
      <div className="min-h-screen bg-[#FAFAF7]">
        <TopBar />
        <main className="mx-auto max-w-5xl px-4 py-12 text-center">
          <p className="text-lg font-semibold text-slate-500">
            لم يتم تعيين شباك لك بعد
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] pb-28 md:pb-8">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">
            {t("staff_queue")}
            {data && (
              <span className="ms-2 inline-flex rounded-full border border-[#C8A95B] bg-[#C8A95B]/20 px-2.5 py-0.5 text-sm font-bold text-yellow-800">
                {t("window_n")} {data.window.number}
              </span>
            )}
          </h1>
          {data && (
            <p className="text-sm text-slate-500">{data.window.service.name_ar}</p>
          )}
        </div>

        {queueQuery.isLoading && <SkeletonCard className="h-48" />}

        {data && (
          <>
            {/* Active ticket */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              {data.active_ticket ? (
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-start">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      {t("status_active")}
                    </p>
                    <p className="text-6xl font-black text-teal-600">
                      #{data.active_ticket.queue_number}
                    </p>
                    <p className="mt-1 font-semibold text-slate-700">
                      {data.active_ticket.citizen_name}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus.mutate("done")}
                      disabled={updateStatus.isPending}
                      className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      ✓ {t("done")}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus.mutate("skipped")}
                      disabled={updateStatus.isPending}
                      className="rounded-xl bg-amber-500 px-5 py-3 font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                    >
                      ↷ {t("skip")}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus.mutate("no_show")}
                      disabled={updateStatus.isPending}
                      className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      ✕ {t("no_show")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-500">{t("no_active_ticket")}</p>
                </div>
              )}
            </section>

            {/* Call next */}
            <button
              type="button"
              onClick={() => callNext.mutate()}
              disabled={callNext.isPending || !!data.active_ticket || data.waiting.length === 0}
              className="fixed bottom-0 start-0 z-40 w-full rounded-none bg-teal-600 px-6 py-5 text-xl font-bold text-white shadow-lg hover:bg-teal-700 disabled:opacity-50 md:relative md:mt-4 md:rounded-2xl"
            >
              📣 {t("call_next")}
            </button>

            {/* Waiting list */}
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-bold text-[#1E3A5F]">{t("waiting_list")}</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                {data.waiting.length === 0 ? (
                  <p className="p-8 text-center text-sm text-slate-500">{t("queue_empty")}</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {data.waiting.slice(0, 20).map((w, i) => (
                      <li key={w.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-bold text-[#1E3A5F]">#{w.queue_number}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(w.booked_at).toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <StatusChip status={w.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* Stats */}
            <section className="mt-6 grid grid-cols-3 gap-3">
              <Stat color="green" label={t("served")} value={data.stats_today.served} />
              <Stat color="amber" label={t("skipped")} value={data.stats_today.skipped} />
              <Stat color="red" label={t("no_shows")} value={data.stats_today.no_show} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ color, label, value }: { color: "green" | "amber" | "red"; label: string; value: number }) {
  const c = {
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  }[color];
  return (
    <div className={`rounded-2xl border p-4 text-center ${c}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
