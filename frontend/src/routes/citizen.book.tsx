import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPublicServices, createTicket } from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TopBar } from "@/components/TopBar";
import { SkeletonCard } from "@/components/ui-bits";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen/book")({
  head: () => ({ meta: [{ title: "احجز دورًا — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <BookSlot />
    </ProtectedRoute>
  ),
});

type Step = "select" | "confirm" | "success";

function BookSlot() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [createdNumber, setCreatedNumber] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: getPublicServices,
  });

  const book = useMutation({
    mutationFn: (id: string) => createTicket(id),
    onSuccess: (res) => {
      setCreatedNumber(res.ticket.queue_number);
      setStep("success");
      toast.success(t("booking_confirmed_msg"));
    },
    onError: (e: any) => {
      setErr(e.message === "DUPLICATE_BOOKING" ? t("duplicate_booking") : t("no_active_windows"));
      setStep("select");
    },
  });

  useEffect(() => {
    if (step === "success") {
      const tm = setTimeout(() => navigate({ to: "/citizen/dashboard" }), 4000);
      return () => clearTimeout(tm);
    }
  }, [step, navigate]);

  const selected = data?.services.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-[#1E3A5F]">{t("book_a_slot")}</h1>

        {step === "select" && (
          <>
            <h2 className="mb-3 text-sm font-semibold text-slate-500">{t("select_service")}</h2>
            {err && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {err}
              </div>
            )}
            {isLoading && (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} className="h-32" />
                ))}
              </div>
            )}
            {data && (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.services.map((s) => {
                  const closed = s.active_windows === 0;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={closed}
                      onClick={() => {
                        setSelectedId(s.id);
                        setStep("confirm");
                      }}
                      className="relative rounded-2xl border border-slate-100 bg-white p-5 text-start transition hover:border-teal-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <p className="font-bold text-[#1E3A5F]">
                        {i18n.language === "ar" ? s.name_ar : s.name_en}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {s.estimated_wait_minutes ?? "—"} {t("minutes")} · {s.active_windows} {t("windows_open")}
                      </p>
                      {closed && (
                        <span className="absolute end-3 top-3 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          {t("unavailable_now")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}

        {step === "confirm" && selected && (
          <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{t("service")}</p>
            <h2 className="text-2xl font-bold text-[#1E3A5F]">
              {i18n.language === "ar" ? selected.name_ar : selected.name_en}
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500">{t("est_wait")}</dt>
                <dd className="mt-1 text-lg font-bold text-slate-700">
                  {selected.estimated_wait_minutes ?? "—"} {t("minutes")}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500">{t("windows_open")}</dt>
                <dd className="mt-1 text-lg font-bold text-slate-700">{selected.active_windows}</dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-800">
              {t("number_auto_assigned")}
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t("back")}
              </button>
              <button
                type="button"
                disabled={book.isPending}
                onClick={() => book.mutate(selected.id)}
                className="flex-1 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {book.isPending ? "..." : t("confirm_booking")}
              </button>
            </div>
          </section>
        )}

        {step === "success" && createdNumber !== null && (
          <section className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-20 w-20 animate-bounce text-green-600" />
            <h2 className="mt-4 text-lg font-semibold text-slate-600">{t("booking_confirmed_msg")}</h2>
            <p className="mt-4 text-sm text-slate-500">{t("your_number")}</p>
            <p className="text-7xl font-black text-teal-600">{createdNumber}</p>
            <button
              type="button"
              onClick={() => navigate({ to: "/citizen/dashboard" })}
              className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700"
            >
              {t("back_to_dashboard")}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
