import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateAdminUser } from "@/lib/mock-api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardShell } from "@/components/DashboardShell";
import { SkeletonCard, ConfirmModal } from "@/components/ui-bits";
import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "إدارة المستخدمين — لسّه؟" }] }),
  component: () => (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminUsers />
    </ProtectedRoute>
  ),
});

const ROLE_COLORS: Record<string, string> = {
  citizen: "bg-slate-100 text-slate-700 border-slate-300",
  staff: "bg-teal-100 text-teal-800 border-teal-300",
  supervisor: "bg-blue-100 text-blue-800 border-blue-300",
  admin: "bg-[#C8A95B]/20 text-yellow-800 border-[#C8A95B]",
};

function AdminUsers() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => getAdminUsers(search),
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: any }) => updateAdminUser(id, patch),
    onSuccess: () => {
      toast.success(t("save"));
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return (
    <DashboardShell role="admin">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">{t("users")}</h1>
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="rounded-xl border border-slate-200 bg-white ps-9 pe-4 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
          />
        </div>
      </div>

      {isLoading && <SkeletonCard className="h-48" />}

      {data && (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="sticky start-0 bg-slate-50 px-4 py-3 text-start">{t("full_name")}</th>
                <th className="px-4 py-3 text-start">{t("phone")}</th>
                <th className="px-4 py-3">{t("role")}</th>
                <th className="px-4 py-3">{t("created_at")}</th>
                <th className="px-4 py-3">{t("status")}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="sticky start-0 bg-white px-4 py-3 font-semibold text-slate-700">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500" dir="ltr">{u.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => update.mutate({ id: u.id, patch: { role: e.target.value } })}
                      className={`rounded-full border px-2.5 py-1 text-xs font-bold ${ROLE_COLORS[u.role]}`}
                    >
                      <option value="citizen">{t("citizen")}</option>
                      <option value="staff">{t("staff")}</option>
                      <option value="supervisor">{t("supervisor")}</option>
                      <option value="admin">{t("admin")}</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">{u.created_at}</td>
                  <td className="px-4 py-3 text-center">
                    {u.is_active ? (
                      <span className="inline-flex rounded-full border border-green-300 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                        {t("active")}
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                        {t("inactive")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    {u.is_active ? (
                      <button
                        type="button"
                        onClick={() => setDeactivating(u.id)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        {t("deactivate")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => update.mutate({ id: u.id, patch: { is_active: true } })}
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
