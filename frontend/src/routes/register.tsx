import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { LanguageToggle } from "@/components/TopBar";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "إنشاء حساب — لسّه؟" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^01[0-2,5]{1}[0-9]{8}$/.test(phone)) return setErr(t("phone_invalid"));
    if (password.length < 8) return setErr(t("password_short"));
    if (password !== confirm) return setErr(t("passwords_no_match"));
    setLoading(true);
    try {
      await register(name, phone, password);
      toast.success(t("create_account"));
      navigate({ to: "/citizen/dashboard" });
    } catch (e: any) {
      setErr(e.message === "PHONE_ALREADY_EXISTS" ? t("phone_exists") : "Error");
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
          <h1 className="text-2xl font-bold text-[#1E3A5F]">{t("create_account")}</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label={t("full_name")} value={name} onChange={setName} required />
            <Field label={t("phone")} value={phone} onChange={setPhone} ltr placeholder="01012345678" required />
            <Field label={t("password")} value={password} onChange={setPassword} type="password" required />
            <Field label={t("confirm_password")} value={confirm} onChange={setConfirm} type="password" required />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                required
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              {t("accept_terms")}
            </label>
            {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading || !terms}
              className="w-full rounded-xl bg-teal-600 px-6 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? "..." : t("create_account")}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            {t("already_have_account")}{" "}
            <Link to="/login" className="font-bold text-teal-600 hover:underline">
              {t("login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  ltr,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        dir={ltr ? "ltr" : undefined}
        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
      />
    </div>
  );
}
