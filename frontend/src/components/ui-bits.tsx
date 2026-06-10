import { useTranslation } from "react-i18next";

export function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  destructive = true,
}: {
  open: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  destructive?: boolean;
}) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-[#1E3A5F]">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={
              destructive
                ? "rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                : "rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            }
          >
            {loading ? "..." : t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard({ className = "h-32" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm font-semibold text-red-700">⚠️ {t("loading")}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          {t("try_again")}
        </button>
      )}
    </div>
  );
}

export function StatusChip({ status }: { status: string }) {
  const { t } = useTranslation();
  const styles: Record<string, string> = {
    waiting: "bg-slate-100 text-slate-700 border-slate-200",
    active: "bg-teal-100 text-teal-800 border-teal-300",
    done: "bg-green-100 text-green-800 border-green-300",
    skipped: "bg-amber-100 text-amber-800 border-amber-300",
    no_show: "bg-red-100 text-red-700 border-red-300",
    open: "bg-green-100 text-green-800 border-green-300",
    closed: "bg-red-100 text-red-700 border-red-300",
  };
  const key = `status_${status}` as const;
  // fall back to direct keys for open/closed
  const label = ["open", "closed"].includes(status)
    ? t(status as any)
    : t(key as any);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
      {label}
    </span>
  );
}
