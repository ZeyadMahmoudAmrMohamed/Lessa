import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Boxes, FileBarChart, Users, Settings, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

interface Item {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export function DashboardShell({
  role,
  children,
}: {
  role: "supervisor" | "admin";
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items: Item[] =
    role === "supervisor"
      ? [
          { to: "/supervisor/dashboard", label: t("supervisor_dashboard"), icon: LayoutDashboard },
          { to: "/supervisor/summary", label: t("daily_summary"), icon: BarChart3 },
        ]
      : [
          { to: "/admin/dashboard", label: t("admin_dashboard"), icon: LayoutDashboard },
          { to: "/admin/services", label: t("services"), icon: Boxes },
          { to: "/admin/users", label: t("users"), icon: Users },
          { to: "/admin/reports", label: t("reports"), icon: FileBarChart },
          { to: "/admin/settings", label: t("settings"), icon: Settings },
        ];

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1 rounded-2xl bg-[#1E3A5F] p-3 text-white">
            {items.map((it) => {
              const active = pathname === it.to;
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-teal-600 text-white"
                      : "text-slate-200 hover:bg-white/10",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          {/* mobile nav */}
          <nav className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 lg:hidden">
            {items.map((it) => {
              const active = pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold",
                    active
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-600",
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
