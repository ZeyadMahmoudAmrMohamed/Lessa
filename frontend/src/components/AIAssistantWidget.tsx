import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AIAssistantWidget() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  // citizen or guest only
  if (user && user.role !== "citizen") return null;
  return (
    <>
      <button
        type="button"
        aria-label={t("ai_assistant")}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 end-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-teal-600 shadow-lg shadow-[#1E3A5F]/30 ring-1 ring-slate-200 hover:scale-105 transition focus-visible:ring-2 focus-visible:ring-teal-500"
      >
        <Sparkles className="h-6 w-6" />
      </button>
      {open && <AIDrawer onClose={() => setOpen(false)} />}
    </>
  );
}

function AIDrawer({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-end sm:justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative flex h-[70vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:m-6 sm:h-[500px] sm:w-[400px] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <span className="font-bold text-[#1E3A5F]">{t("ai_assistant")}</span>
            <span className="rounded-full border border-[#C8A95B] bg-[#C8A95B]/20 px-2 py-0.5 text-[10px] font-bold text-yellow-800">
              {t("beta")}
            </span>
          </div>
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-ss-sm bg-slate-100 p-3 text-sm text-slate-700">
              {t("ai_welcome")}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 p-3" title={t("ai_coming_soon")}>
          <input
            disabled
            placeholder={t("ai_input_placeholder")}
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
