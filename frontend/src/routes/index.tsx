import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getPublicServices } from "@/lib/mock-api";
import { TopBar } from "@/components/TopBar";
import { SkeletonCard } from "@/components/ui-bits";
import { useAuth, roleHome } from "@/lib/auth";
import { useEffect } from "react";
import { Clock, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { Congestion } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "لسّه؟ — احجز دورك في الخدمات الحكومية" },
      {
        name: "description",
        content:
          "منصة لسّه؟ لحجز ومتابعة الطوابير في الخدمات الحكومية المصرية في الوقت الفعلي.",
      },
      { property: "og:title", content: "لسّه؟ — Lessa? Government Queue Tracking" },
      { property: "og:description", content: "Book your turn. Skip the wait." },
    ],
  }),
  component: Landing,
});

function congestionStyle(c: Congestion) {
  switch (c) {
    case "LOW":
      return "bg-green-100 text-green-800 border-green-300";
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function Landing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: getPublicServices,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  useEffect(() => {
    document.title = i18n.language === "ar" ? "لسّه؟ — احجز دورك" : "Lessa? — Book your turn";
  }, [i18n.language]);

  const today = new Date().toLocaleDateString(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleBookClick = (svcId: string) => {
    if (user) {
      navigate({ to: roleHome(user.role) });
    } else {
      toast.info(t("login_to_book"));
      navigate({ to: "/login", search: { redirect: "/citizen/book", svc: svcId } });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <TopBar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#0F766E] text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C8A95B]">
            {i18n.language === "ar" ? "فرع وسط القاهرة · " : "Cairo Central Branch · "}
            {today}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            {t("hero_subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C8A95B] px-6 py-3 font-bold text-[#1E3A5F] hover:bg-[#d4b86a]"
            >
              {t("register")}
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-[#1E3A5F]">
            {t("available_services_now")}
          </h2>
          <span className="hidden text-xs text-slate-500 sm:inline">
            {i18n.language === "ar" ? "يُحدّث كل 30 ثانية" : "Refreshes every 30s"}
          </span>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-48" />
            ))}
          </div>
        )}

        {!isLoading && data && data.services.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
            <p className="text-lg text-slate-500">{t("no_services_available")}</p>
          </div>
        )}

        {!isLoading && data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.services.map((s) => {
              const closed = s.congestion === "NONE";
              return (
                <article
                  key={s.id}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-[#1E3A5F]">
                    {i18n.language === "ar" ? s.name_ar : s.name_en}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {i18n.language === "ar" ? s.name_en : s.name_ar}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${congestionStyle(s.congestion)}`}
                    >
                      {t(`congestion_${s.congestion}` as any)}
                    </span>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" /> {t("est_wait")}
                      </dt>
                      <dd className="mt-0.5 font-bold text-slate-700">
                        {s.estimated_wait_minutes !== null
                          ? `${s.estimated_wait_minutes} ${t("minutes")}`
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1 text-xs text-slate-500">
                        <Users className="h-3.5 w-3.5" /> {t("windows_open")}
                      </dt>
                      <dd className="mt-0.5 font-bold text-slate-700">
                        {s.active_windows}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    disabled={closed}
                    onClick={() => handleBookClick(s.id)}
                    aria-label={t("book_now")}
                    className="mt-auto pt-4"
                  >
                    <span className="block w-full rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">
                      {closed ? t("unavailable_now") : t("book_now")}
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
          © 2026 {t("brand")} · {i18n.language === "ar" ? "خدمة حكومية رقمية" : "A digital government service"}
        </div>
      </footer>
    </div>
  );
}
