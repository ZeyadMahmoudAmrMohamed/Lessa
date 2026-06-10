import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, roleHome } from "@/lib/auth";
import { LanguageToggle } from "@/components/TopBar";
import { toast } from "sonner";
import { z } from "zod";

const search = z.object({
  redirect: z.string().optional(),
  svc: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "تسجيل الدخول — لسّه؟" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { redirect } = useSearch({ from: "/login" });
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const user = await login(phone, password);
      toast.success(t("login"));
      navigate({ to: redirect || roleHome(user.role) });
    } catch {
      setErr(t("invalid_credentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4EBD9] via-[#FAFAF7] to-white">
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-10">
        <div className="mb-4 flex w-full justify-end">
          <LanguageToggle />
        </div>
        <Link to="/" className="mb-8 flex items-center gap-2">
          <img src="/logo.svg" alt="" className="h-12 w-12" />
          <span className="text-2xl font-black text-[#1E3A5F]">لسّه؟</span>
        </Link>
        <div className="w-full rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1E3A5F]">{t("login")}</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">{t("phone")}</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                dir="ltr"
                placeholder="01012345678"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
              />
            </div>
            {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? "..." : t("login")}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {t("no_account")}{" "}
            <Link to="/register" className="font-bold text-teal-600 hover:underline">
              {t("register")}
            </Link>
          </p>
          <details className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <summary className="cursor-pointer font-semibold">Demo accounts</summary>
            <ul className="mt-2 space-y-1 font-mono">
              <li>01012345678 / pass1234 — citizen</li>
              <li>01098765432 / pass1234 — staff</li>
              <li>01555000001 / pass1234 — supervisor</li>
              <li>01000000001 / pass1234 — admin</li>
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
