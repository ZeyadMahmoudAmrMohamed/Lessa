import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
} from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { SkeletonCard, ConfirmModal } from "@/components/ui-bits";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "إدارة الخدمات — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminServices />
    </ProtectedRoute>
  ),
});

function AdminServices() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: getAdminServices,
  });
  const [drawer, setDrawer] = useState(false);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: createAdminService,
    onSuccess: () => {
      toast.success(t("add_service"));
      qc.invalidateQueries({ queryKey: ["admin-services"] });
      setDrawer(false);
    },
  });
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => updateAdminService(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-services"] }),
  });

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">{t("services")}</h1>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          {t("add_service")}
        </button>
      </div>

      {isLoading && <SkeletonCard className="h-48" />}

      {data && (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start">{t("name_ar")}</th>
                <th className="px-4 py-3 text-start">{t("name_en")}</th>
                <th className="px-4 py-3">{t("est_duration")}</th>
                <th className="px-4 py-3">{t("windows")}</th>
                <th className="px-4 py-3">{t("status")}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.services.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">{s.name_ar}</td>
                  <td className="px-4 py-3 text-slate-500">{s.name_en}</td>
                  <td className="px-4 py-3 text-center font-mono">{s.estimated_duration_minutes}</td>
                  <td className="px-4 py-3 text-center font-mono">{s.active_windows}</td>
                  <td className="px-4 py-3 text-center">
                    {s.is_active ? (
                      <span className="inline-flex items-center rounded-full border border-green-300 bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        {t("active")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        {t("inactive")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    {s.is_active ? (
                      <button
                        type="button"
                        onClick={() => setDeactivating(s.id)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        {t("deactivate")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => update.mutate({ id: s.id, patch: { is_active: true } })}
                        className="text-xs font-bold text-teal-600 hover:underline"
                      >
                        {t("reactivate")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {drawer && (
        <ServiceFormModal
          onCancel={() => setDrawer(false)}
          onSubmit={(d) => create.mutate(d)}
          loading={create.isPending}
        />
      )}

      <ConfirmModal
        open={!!deactivating}
        title={t("deactivate")}
        message={t("deactivate_confirm")}
        onCancel={() => setDeactivating(null)}
        onConfirm={() => {
          if (deactivating) update.mutate({ id: deactivating, patch: { is_active: false } });
          setDeactivating(null);
        }}
      />
    </DashboardShell>
  );
}

function ServiceFormModal({
  onCancel,
  onSubmit,
  loading,
}: {
  onCancel: () => void;
  onSubmit: (d: { name_ar: string; name_en: string; estimated_duration_minutes: number }) => void;
  loading: boolean;
}) {
  const { t } = useTranslation();
  const [name_ar, setAr] = useState("");
  const [name_en, setEn] = useState("");
  const [dur, setDur] = useState(10);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ name_ar, name_en, estimated_duration_minutes: dur });
        }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h3 className="text-lg font-bold text-[#1E3A5F]">{t("add_service")}</h3>
        <div className="mt-4 space-y-3">
          <Input label={t("name_ar")} value={name_ar} onChange={setAr} required />
          <Input label={t("name_en")} value={name_en} onChange={setEn} required ltr />
          <div>
            <label className="text-sm font-semibold text-slate-700">{t("est_duration")}</label>
            <input
              type="number"
              value={dur}
              min={1}
              onChange={(e) => setDur(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? "..." : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, required, ltr }: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        dir={ltr ? "ltr" : undefined}
        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
      />
    </div>
  );
}
