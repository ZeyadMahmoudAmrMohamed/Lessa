/**
 * API layer — all functions call the real backend at VITE_API_BASE_URL.
 * The file is kept as mock-api.ts to avoid changing every import across the codebase.
 */
import { apiFetch } from "./api";

export interface ServiceItem {
  id: string;
  name_ar: string;
  name_en: string;
  estimated_duration_minutes: number;
  is_active: boolean;
  active_windows: number;
  queue_size?: number;
  congestion: "LOW" | "MEDIUM" | "HIGH" | "NONE";
  estimated_wait_minutes?: number | null;
  image?: string;
}

export interface TicketItem {
  id: string;
  queue_number: number;
  service_name_ar?: string;
  service: { id: string; name_ar: string; name_en: string };
  status: string;
  position: number;
  estimated_wait_minutes: number | null;
  queue_total: number;
  window_number?: number | null;
  booked_at?: string;
  date?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  message_ar: string;
  message_en: string;
  read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  full_name?: string;
  name?: string;
  phone: string;
  role: "citizen" | "staff" | "supervisor" | "admin";
  is_active: boolean;
  created_at: string;
}

// ─── Public ────────────────────────────────────────────────────────────────

export async function getPublicServices() {
  return apiFetch<{ services: ServiceItem[] }>("/api/services/public", { auth: false });
}

// ─── Citizen ───────────────────────────────────────────────────────────────

export async function getActiveTicket() {
  return apiFetch<{ ticket: TicketItem | null }>("/api/citizen/ticket/active");
}

export async function getTicketHistory() {
  return apiFetch<{ tickets: TicketItem[] }>("/api/citizen/tickets/history");
}

export async function createTicket(service_id: string) {
  return apiFetch<{ ticket: TicketItem }>("/api/citizen/tickets", {
    method: "POST",
    body: { service_id },
  });
}

export async function cancelTicket(id: string) {
  return apiFetch<{ message: string }>(`/api/citizen/tickets/${id}`, {
    method: "DELETE",
  });
}

export async function getNotifications(page = 1) {
  return apiFetch<{ notifications: NotificationItem[]; unread_count: number; total: number }>(
    "/api/citizen/notifications",
    { query: { page } },
  );
}

export async function markAllNotificationsRead() {
  return apiFetch<{ updated: number }>("/api/citizen/notifications/read-all", {
    method: "PATCH",
  });
}

// ─── Staff ─────────────────────────────────────────────────────────────────

export async function getStaffQueue(windowId: string) {
  return apiFetch<{
    window: { id: string; number: number; service: { name_ar: string; name_en: string } };
    active_ticket: null | { id: string; queue_number: number; citizen_name: string; status: string };
    waiting: { id: string; queue_number: number; status: string; booked_at: string }[];
    stats_today: { served: number; skipped: number; no_show: number };
  }>(`/api/staff/window/${windowId}/queue`);
}

export async function callNextTicket(windowId: string) {
  return apiFetch(`/api/staff/window/${windowId}/next`, { method: "POST" });
}

export async function setTicketStatus(
  ticketId: string,
  status: "done" | "skipped" | "no_show",
) {
  return apiFetch(`/api/staff/tickets/${ticketId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

// ─── Supervisor ────────────────────────────────────────────────────────────

export async function getSupervisorDashboard() {
  return apiFetch<{
    summary: {
      active_windows: number;
      total_tickets_today: number;
      currently_waiting: number;
      avg_wait_minutes: number | null;
    };
    windows: {
      id: string;
      number: number;
      status: "open" | "closed";
      assigned_staff: { id: string; name: string } | null;
      service: { name_ar: string; name_en?: string };
      tickets_served_today: number;
      current_queue_size: number;
    }[];
  }>("/api/supervisor/branch/dashboard");
}

export async function setWindowStatus(id: string, status: "open" | "closed") {
  return apiFetch(`/api/supervisor/windows/${id}`, {
    method: "PATCH",
    body: { status },
  });
}

export async function assignWindowStaff(id: string, staff: { id: string; name: string }) {
  return apiFetch(`/api/supervisor/windows/${id}/assign`, {
    method: "PATCH",
    body: { staff_id: staff.id },
  });
}

export async function getDailySummary(date: string) {
  const raw = await apiFetch<{
    date: string;
    stats: { issued: number; served: number; skipped: number; no_show: number; avg_wait_minutes: number | null };
    hourly: { hour: string; count: number }[];
    by_service: { name_ar: string; issued: number; served: number; no_show: number }[];
  }>("/api/supervisor/branch/summary", { query: { date } });

  // Normalize to shape the frontend expects
  const peakHour = raw.hourly?.length
    ? raw.hourly.reduce((a, b) => (b.count > a.count ? b : a)).hour
    : null;

  return {
    ...raw,
    stats: { ...raw.stats, peak_hour: peakHour },
    by_service: (raw.by_service ?? []).map((s) => ({
      service_name_ar: s.name_ar,
      issued: s.issued,
      served: s.served,
      no_show: s.no_show,
    })),
  };
}

export async function getStaffList() {
  return apiFetch<{ staff: { id: string; full_name: string; phone: string }[] }>(
    "/api/supervisor/staff",
  );
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export async function getAdminServices() {
  return apiFetch<{ services: ServiceItem[] }>("/api/services");
}

export async function createAdminService(data: {
  name_ar: string;
  name_en: string;
  estimated_duration_minutes: number;
}) {
  return apiFetch<{ service: ServiceItem }>("/api/services", {
    method: "POST",
    body: data,
  });
}

export async function updateAdminService(id: string, patch: Record<string, unknown>) {
  return apiFetch<{ service: ServiceItem }>(`/api/services/${id}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function getAdminUsers(search = "", page = 1) {
  return apiFetch<{ users: AdminUser[]; total: number; page: number }>(
    "/api/admin/users",
    { query: { search: search || undefined, page } },
  );
}

export async function updateAdminUser(id: string, patch: Record<string, unknown>) {
  return apiFetch<{ user: AdminUser }>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: patch,
  });
}

export async function getAdminReports(
  start?: string,
  end?: string,
): Promise<{
  summary: { total_transactions: number; avg_wait_minutes: number | null; no_show_rate: number; peak_day: string | null };
  daily: { date: string; tickets: number }[];
  no_show_by_service: { service_name_ar: string; rate: number }[];
}> {
  const now = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return apiFetch("/api/admin/reports", {
    query: { start: start ?? thirtyDaysAgo, end: end ?? now },
  }) as any;
}

export async function getAdminDashboard() {
  // Build dashboard from available endpoints
  const [usersResp, servicesResp] = await Promise.all([
    apiFetch<{ users: unknown[]; total: number }>("/api/admin/users", { query: { limit: 1 } }),
    apiFetch<{ services: { is_active: boolean }[] }>("/api/services"),
  ]);

  const activeServices = (servicesResp.services ?? []).filter((s) => s.is_active).length;

  return {
    stats: {
      total_users: usersResp.total ?? 0,
      active_services: activeServices,
      todays_tickets: 0,
      no_show_rate: 0,
    },
    activity: [] as { id: number; text_ar: string; text_en: string; at: string }[],
  };
}
