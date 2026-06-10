import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Bell, LogOut, Menu, Languages, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth, roleHome } from "@/lib/auth";
import { applyLangSideEffects } from "@/lib/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAllNotificationsRead, getActiveTicket } from "@/lib/mock-api";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  return (
    <button
      type="button"
      aria-label="Toggle language"
      onClick={() => {
        const next = i18n.language === "ar" ? "en" : "ar";
        i18n.changeLanguage(next);
        applyLangSideEffects(next);
      }}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1E3A5F] hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-500"
    >
      <Languages className="h-4 w-4" />
      {i18n.language === "ar" ? "EN" : "العربية"}
    </button>
  );
}

function NotificationBell() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 15000,
  });
  const markAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);
  const unread = data?.unread_count ?? 0;
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={t("notifications")}
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1E3A5F] hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -end-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white shadow-xl z-50">
          <div className="flex items-center justify-between border-b border-slate-100 p-3">
            <span className="font-bold text-[#1E3A5F]">{t("notifications")}</span>
            <button
              type="button"
              onClick={() => markAll.mutate()}
              className="text-xs font-semibold text-teal-600 hover:underline"
            >
              {t("mark_all_read")}
            </button>
          </div>
          <ul className="max-h-96 overflow-auto p-2">
            {(data?.notifications ?? []).length === 0 && (
              <li className="p-6 text-center text-sm text-slate-500">{t("no_notifications")}</li>
            )}
            {data?.notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl p-3",
                  !n.read && "bg-teal-50/60",
                )}
              >
                <span className="text-xl">
                  {n.type === "TURN_APPROACHING"
                    ? "🔔"
                    : n.type === "TICKET_CALLED"
                      ? "📣"
                      : n.type === "TICKET_NO_SHOW"
                        ? "⚠️"
                        : n.type === "BOOKING_CONFIRMED"
                          ? "✅"
                          : n.type === "BOOKING_CANCELLED"
                            ? "❌"
                            : "🚫"}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    {i18n.language === "ar" ? n.message_ar : n.message_en}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(n.created_at).toLocaleTimeString(i18n.language, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-teal-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function TopBar({ onMenu }: { onMenu?: () => void }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isCitizen = user?.role === "citizen";
  const { data: activeData } = useQuery({
    queryKey: ["active-ticket"],
    queryFn: getActiveTicket,
    refetchInterval: 8000,
    enabled: isCitizen,
  });
  const home = user ? roleHome(user.role) : "/";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {onMenu && (
          <button
            type="button"
            aria-label="Menu"
            onClick={onMenu}
            className="rounded-lg p-2 text-[#1E3A5F] hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Link to={home} className="flex items-center gap-2">
          <img src="/logo.svg" alt="Lessa?" className="h-9 w-9" />
          <span className="text-xl font-black text-[#1E3A5F]">
            {i18n.language === "ar" ? "لسّه؟" : "Lessa?"}
          </span>
        </Link>

        {isCitizen && activeData?.ticket && (
          <Link
            to="/citizen/dashboard"
            className="ms-2 hidden items-center gap-2 rounded-full border border-[#C8A95B] bg-[#C8A95B]/15 px-3 py-1 text-xs font-bold text-yellow-800 sm:inline-flex"
          >
            #{activeData.ticket.queue_number} · {t("status_" + activeData.ticket.status as any)}
          </Link>
        )}

        {user?.role === "staff" && user.window_id && (
          <span className="ms-2 hidden rounded-full border border-[#C8A95B] bg-[#C8A95B]/15 px-3 py-1 text-xs font-bold text-yellow-800 sm:inline-flex">
            {t("window_n")} 3
          </span>
        )}

        <div className="ms-auto flex items-center gap-2">
          <LanguageToggle />
          {user && isCitizen && <NotificationBell />}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm font-semibold text-[#1E3A5F] sm:inline">
                <UserCircle className="me-1 inline h-4 w-4" />
                {user.name}
              </span>
              <button
                type="button"
                aria-label={t("logout")}
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden rounded-xl border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 sm:inline-block"
              >
                {t("login")}
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
