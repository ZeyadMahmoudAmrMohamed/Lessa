import idCardRenewalImage from "@/assets/services/id-card-renewal.jpg";
import birthCertificateImage from "@/assets/services/birth-certificate.jpg";
import vehicleRegistrationImage from "@/assets/services/vehicle-registration.jpg";
import passportIssuanceImage from "@/assets/services/passport-issuance.jpg";
import { publicServices, type Ticket, type TicketStatus } from "./mock-data";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

type NotificationType =
  | "TURN_APPROACHING"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "TICKET_CALLED"
  | "TICKET_NO_SHOW";

interface NotificationItem {
  id: string;
  type: NotificationType;
  message_ar: string;
  message_en: string;
  read: boolean;
  created_at: string;
}

interface AdminService {
  id: string;
  name_ar: string;
  name_en: string;
  image?: string;
  estimated_duration_minutes: number;
  is_active: boolean;
  active_windows: number;
}

interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: "citizen" | "staff" | "supervisor" | "admin";
  is_active: boolean;
  created_at: string;
}

const serviceImages: Record<string, string> = {
  "svc-001": idCardRenewalImage,
  "svc-002": birthCertificateImage,
  "svc-003": vehicleRegistrationImage,
  "svc-004": passportIssuanceImage,
};

let serviceCatalog = publicServices.map((service) => ({
  ...service,
  image: serviceImages[service.id],
}));

let activeTicket: Ticket | null = {
  id: "tkt-099",
  queue_number: 47,
  service: { id: "svc-001", name_ar: "تجديد بطاقة الهوية", name_en: "ID Card Renewal" },
  status: "waiting",
  position: 3,
  estimated_wait_minutes: 9,
  queue_total: 12,
  window_number: null,
  booked_at: new Date(Date.now() - 14 * 60_000).toISOString(),
};

let nextNumber = 48;

const ticketHistory = [
  { id: "tkt-080", queue_number: 22, service_name_ar: "تجديد بطاقة الهوية", status: "done", date: "2026-06-08" },
  { id: "tkt-079", queue_number: 18, service_name_ar: "استخراج شهادة الميلاد", status: "done", date: "2026-06-07" },
  { id: "tkt-071", queue_number: 15, service_name_ar: "استخراج شهادة الميلاد", status: "no_show", date: "2026-06-05" },
  { id: "tkt-065", queue_number: 9, service_name_ar: "تسجيل السيارات", status: "done", date: "2026-06-02" },
];

const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "TURN_APPROACHING",
    message_ar: "دورك اقترب! أنت رقم 3 في الطابور",
    message_en: "Your turn is near! You're #3 in line",
    read: false,
    created_at: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: "notif-2",
    type: "BOOKING_CONFIRMED",
    message_ar: "تم تأكيد حجزك برقم 47",
    message_en: "Booking confirmed — number 47",
    read: true,
    created_at: new Date(Date.now() - 30 * 60_000).toISOString(),
  },
];

function pushNotification(item: Omit<NotificationItem, "id" | "created_at" | "read">) {
  notifications.unshift({
    ...item,
    id: `notif-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
  });
}

function syncPublicServicesFromAdmin() {
  serviceCatalog = serviceCatalog.map((service) => {
    const adminMatch = adminServices.find((item) => item.id === service.id);
    if (!adminMatch) return service;
    return {
      ...service,
      name_ar: adminMatch.name_ar,
      name_en: adminMatch.name_en,
      estimated_duration_minutes: adminMatch.estimated_duration_minutes,
      active_windows: adminMatch.active_windows,
      image: adminMatch.image ?? service.image,
      congestion:
        adminMatch.active_windows === 0
          ? "NONE"
          : service.queue_size > 14
            ? "HIGH"
            : service.queue_size > 6
              ? "MEDIUM"
              : "LOW",
      estimated_wait_minutes:
        adminMatch.active_windows === 0
          ? null
          : Math.max(3, Math.round(service.queue_size * adminMatch.estimated_duration_minutes / Math.max(1, adminMatch.active_windows))),
    };
  });
}

function tickQueueFreshness() {
  if (!activeTicket || activeTicket.status !== "waiting") return;
  if (activeTicket.position > 1) {
    activeTicket = {
      ...activeTicket,
      position: activeTicket.position - 1,
      estimated_wait_minutes: Math.max(2, activeTicket.estimated_wait_minutes - 2),
    };
    if (activeTicket.position <= 2) {
      pushNotification({
        type: "TURN_APPROACHING",
        message_ar: `دورك اقترب! أنت رقم ${activeTicket.position} في الطابور`,
        message_en: `Your turn is near! You're #${activeTicket.position} in line`,
      });
    }
  }
}

export async function getPublicServices() {
  await delay(150);
  syncPublicServicesFromAdmin();
  return { services: serviceCatalog };
}

export async function getActiveTicket() {
  await delay(150);
  tickQueueFreshness();
  return { ticket: activeTicket };
}

export async function getTicketHistory() {
  await delay(150);
  return { tickets: ticketHistory };
}

export async function createTicket(service_id: string) {
  await delay(300);
  const svc = serviceCatalog.find((s) => s.id === service_id);
  if (!svc) throw new Error("SERVICE_NOT_FOUND");
  if (svc.active_windows === 0) throw new Error("NO_ACTIVE_WINDOWS");
  if (activeTicket && activeTicket.service.id === service_id) throw new Error("DUPLICATE_BOOKING");

  activeTicket = {
    id: `tkt-${nextNumber}`,
    queue_number: nextNumber,
    service: { id: svc.id, name_ar: svc.name_ar, name_en: svc.name_en },
    status: "waiting",
    position: Math.max(2, Math.ceil(svc.queue_size / Math.max(1, svc.active_windows))),
    estimated_wait_minutes: svc.estimated_wait_minutes ?? 10,
    queue_total: svc.queue_size + 1,
    window_number: null,
    booked_at: new Date().toISOString(),
  };
  nextNumber += 1;
  pushNotification({
    type: "BOOKING_CONFIRMED",
    message_ar: `تم تأكيد حجزك برقم ${activeTicket.queue_number}`,
    message_en: `Booking confirmed — number ${activeTicket.queue_number}`,
  });
  return { ticket: activeTicket };
}

export async function cancelTicket(id: string) {
  await delay(250);
  if (!activeTicket || activeTicket.id !== id) throw new Error("TICKET_NOT_FOUND");
  pushNotification({
    type: "BOOKING_CANCELLED",
    message_ar: `تم إلغاء الحجز رقم ${activeTicket.queue_number}`,
    message_en: `Booking #${activeTicket.queue_number} cancelled`,
  });
  activeTicket = null;
  return { message: "ok" };
}

export async function getNotifications() {
  await delay(120);
  return { notifications, unread_count: notifications.filter((n) => !n.read).length };
}

export async function markAllNotificationsRead() {
  await delay(120);
  notifications.forEach((n) => {
    n.read = true;
  });
  return { updated: notifications.length };
}

let staffWindow = {
  window: { id: "win-3", number: 3, service: { name_ar: "تجديد بطاقة الهوية" } },
  active_ticket: null as null | { id: string; queue_number: number; citizen_name: string; status: TicketStatus },
  waiting: [
    { id: "tkt-100", queue_number: 48, status: "waiting" as TicketStatus, booked_at: new Date(Date.now() - 8 * 60_000).toISOString() },
    { id: "tkt-101", queue_number: 49, status: "waiting" as TicketStatus, booked_at: new Date(Date.now() - 5 * 60_000).toISOString() },
    { id: "tkt-102", queue_number: 50, status: "waiting" as TicketStatus, booked_at: new Date(Date.now() - 2 * 60_000).toISOString() },
  ],
  stats_today: { served: 24, skipped: 2, no_show: 1 },
};

export async function getStaffQueue() {
  await delay(150);
  return staffWindow;
}

export async function callNextTicket() {
  await delay(250);
  if (staffWindow.active_ticket) return staffWindow;
  const next = staffWindow.waiting.shift();
  if (!next) throw new Error("QUEUE_EMPTY");
  staffWindow.active_ticket = {
    id: next.id,
    queue_number: next.queue_number,
    citizen_name: "مواطن",
    status: "active",
  };
  if (activeTicket && activeTicket.queue_number === next.queue_number) {
    activeTicket = {
      ...activeTicket,
      status: "active",
      position: 0,
      estimated_wait_minutes: 0,
      window_number: staffWindow.window.number,
    };
    pushNotification({
      type: "TICKET_CALLED",
      message_ar: `تم نداء رقمك ${next.queue_number} على الشباك ${staffWindow.window.number}`,
      message_en: `Your number ${next.queue_number} was called at window ${staffWindow.window.number}`,
    });
  }
  return staffWindow;
}

export async function setTicketStatus(status: "done" | "skipped" | "no_show") {
  await delay(200);
  if (!staffWindow.active_ticket) throw new Error("NO_ACTIVE");
  const key = status === "done" ? "served" : status;
  staffWindow.stats_today[key] = (staffWindow.stats_today[key] || 0) + 1;
  if (activeTicket && staffWindow.active_ticket.queue_number === activeTicket.queue_number) {
    if (status === "done") {
      ticketHistory.unshift({
        id: activeTicket.id,
        queue_number: activeTicket.queue_number,
        service_name_ar: activeTicket.service.name_ar,
        status,
        date: new Date().toISOString().slice(0, 10),
      });
      activeTicket = null;
    } else if (status === "no_show") {
      pushNotification({
        type: "TICKET_NO_SHOW",
        message_ar: `تم تسجيل رقم ${staffWindow.active_ticket.queue_number} كغياب`,
        message_en: `Ticket ${staffWindow.active_ticket.queue_number} marked as no-show`,
      });
      activeTicket = null;
    } else {
      activeTicket = { ...activeTicket, status: "waiting", position: 1, window_number: null };
    }
  }
  staffWindow.active_ticket = null;
  return staffWindow;
}

let supervisorState = {
  summary: { active_windows: 2, total_tickets_today: 87, currently_waiting: 14, avg_wait_minutes: 11 },
  windows: [
    {
      id: "win-1",
      number: 1,
      status: "open" as "open" | "closed",
      assigned_staff: { id: "staff-001", name: "مريم علي" } as null | { id: string; name: string },
      service: { name_ar: "تجديد بطاقة الهوية" },
      tickets_served_today: 24,
      current_queue_size: 4,
    },
    {
      id: "win-2",
      number: 2,
      status: "open" as "open" | "closed",
      assigned_staff: null as null | { id: string; name: string },
      service: { name_ar: "استخراج شهادة الميلاد" },
      tickets_served_today: 18,
      current_queue_size: 2,
    },
    {
      id: "win-3",
      number: 3,
      status: "closed" as "open" | "closed",
      assigned_staff: null as null | { id: string; name: string },
      service: { name_ar: "تسجيل السيارات" },
      tickets_served_today: 0,
      current_queue_size: 0,
    },
    {
      id: "win-4",
      number: 4,
      status: "open" as "open" | "closed",
      assigned_staff: { id: "staff-002", name: "كريم سالم" } as null | { id: string; name: string },
      service: { name_ar: "استخراج جواز السفر" },
      tickets_served_today: 11,
      current_queue_size: 6,
    },
  ],
};

export async function getSupervisorDashboard() {
  await delay(150);
  supervisorState.summary.active_windows = supervisorState.windows.filter((w) => w.status === "open").length;
  supervisorState.summary.currently_waiting = supervisorState.windows.reduce((sum, w) => sum + w.current_queue_size, 0);
  return supervisorState;
}

export async function setWindowStatus(id: string, status: "open" | "closed") {
  await delay(180);
  const windowItem = supervisorState.windows.find((w) => w.id === id);
  if (windowItem) windowItem.status = status;
  return { window: windowItem };
}

export async function assignWindowStaff(id: string, staff: { id: string; name: string }) {
  await delay(180);
  const windowItem = supervisorState.windows.find((w) => w.id === id);
  if (windowItem) windowItem.assigned_staff = staff;
  return { window: windowItem };
}

export async function getDailySummary(date: string) {
  await delay(200);
  return {
    date,
    stats: { issued: 102, served: 87, skipped: 8, no_show: 7, avg_wait_minutes: 11, peak_hour: "10:00–11:00" },
    hourly: [
      { hour: "08", count: 5 },
      { hour: "09", count: 18 },
      { hour: "10", count: 31 },
      { hour: "11", count: 24 },
      { hour: "12", count: 14 },
      { hour: "13", count: 10 },
    ],
    by_service: [
      { service_name_ar: "تجديد بطاقة الهوية", issued: 45, served: 39, no_show: 4 },
      { service_name_ar: "استخراج شهادة الميلاد", issued: 31, served: 27, no_show: 2 },
      { service_name_ar: "تسجيل السيارات", issued: 26, served: 21, no_show: 1 },
    ],
  };
}

let adminServices: AdminService[] = [
  { id: "svc-001", name_ar: "تجديد بطاقة الهوية", name_en: "ID Card Renewal", image: idCardRenewalImage, estimated_duration_minutes: 10, is_active: true, active_windows: 3 },
  { id: "svc-002", name_ar: "استخراج شهادة الميلاد", name_en: "Birth Certificate", image: birthCertificateImage, estimated_duration_minutes: 7, is_active: true, active_windows: 2 },
  { id: "svc-003", name_ar: "تسجيل السيارات", name_en: "Vehicle Registration", image: vehicleRegistrationImage, estimated_duration_minutes: 15, is_active: true, active_windows: 1 },
  { id: "svc-004", name_ar: "استخراج جواز السفر", name_en: "Passport Issuance", image: passportIssuanceImage, estimated_duration_minutes: 20, is_active: false, active_windows: 0 },
];

export async function getAdminServices() {
  await delay(150);
  return { services: adminServices };
}

export async function createAdminService(data: { name_ar: string; name_en: string; estimated_duration_minutes: number }) {
  await delay(250);
  const service: AdminService = {
    id: `svc-${Date.now()}`,
    ...data,
    is_active: true,
    active_windows: 0,
    image: idCardRenewalImage,
  };
  adminServices = [service, ...adminServices];
  serviceCatalog = [
    ...serviceCatalog,
    {
      id: service.id,
      name_ar: service.name_ar,
      name_en: service.name_en,
      image: service.image,
      estimated_duration_minutes: service.estimated_duration_minutes,
      active_windows: service.active_windows,
      queue_size: 0,
      congestion: "NONE",
      estimated_wait_minutes: null,
    },
  ];
  return { service };
}

export async function updateAdminService(id: string, patch: Partial<AdminService>) {
  await delay(180);
  adminServices = adminServices.map((service) => (service.id === id ? { ...service, ...patch } : service));
  syncPublicServicesFromAdmin();
  return { service: adminServices.find((service) => service.id === id) };
}

let adminUsers: AdminUser[] = [
  { id: "citizen-001", name: "أحمد محمود", phone: "01012345678", role: "citizen", is_active: true, created_at: "2026-06-01" },
  { id: "staff-001", name: "مريم علي", phone: "01098765432", role: "staff", is_active: true, created_at: "2026-05-15" },
  { id: "sup-001", name: "خالد إبراهيم", phone: "01555000001", role: "supervisor", is_active: true, created_at: "2026-04-20" },
  { id: "admin-001", name: "System Admin", phone: "01000000001", role: "admin", is_active: true, created_at: "2026-01-10" },
  { id: "citizen-002", name: "سارة محمد", phone: "01122334455", role: "citizen", is_active: true, created_at: "2026-06-03" },
  { id: "staff-002", name: "كريم سالم", phone: "01099887766", role: "staff", is_active: true, created_at: "2026-05-20" },
  { id: "citizen-003", name: "نور حسن", phone: "01055443322", role: "citizen", is_active: false, created_at: "2026-05-10" },
];

export async function getAdminUsers(search = "") {
  await delay(150);
  const filtered = search ? adminUsers.filter((user) => user.name.includes(search) || user.phone.includes(search)) : adminUsers;
  return { users: filtered, total: filtered.length, page: 1 };
}

export async function updateAdminUser(id: string, patch: Partial<AdminUser>) {
  await delay(180);
  adminUsers = adminUsers.map((user) => (user.id === id ? { ...user, ...patch } : user));
  return { user: adminUsers.find((user) => user.id === id) };
}

export async function getAdminReports() {
  await delay(200);
  return {
    summary: { total_transactions: 874, avg_wait_minutes: 12, no_show_rate: 0.08, peak_day: "2026-06-07" },
    daily: [
      { date: "06-01", tickets: 95 },
      { date: "06-02", tickets: 102 },
      { date: "06-03", tickets: 88 },
      { date: "06-04", tickets: 110 },
      { date: "06-05", tickets: 121 },
      { date: "06-06", tickets: 95 },
      { date: "06-07", tickets: 134 },
      { date: "06-08", tickets: 129 },
      { date: "06-09", tickets: 100 },
    ],
    no_show_by_service: [
      { service_name_ar: "تسجيل السيارات", rate: 0.12 },
      { service_name_ar: "تجديد بطاقة الهوية", rate: 0.08 },
      { service_name_ar: "استخراج شهادة الميلاد", rate: 0.05 },
      { service_name_ar: "استخراج جواز السفر", rate: 0.1 },
    ],
  };
}

export async function getAdminDashboard() {
  await delay(180);
  return {
    stats: {
      total_users: adminUsers.length,
      active_services: adminServices.filter((service) => service.is_active).length,
      todays_tickets: 87,
      no_show_rate: 0.08,
    },
    activity: [
      { id: 1, text_ar: "أنشأ المسؤول خدمة جديدة", text_en: "Admin created a new service", at: "10:32" },
      { id: 2, text_ar: "تم تعيين كريم سالم لشباك 4", text_en: "Karim Salem assigned to window 4", at: "10:15" },
      { id: 3, text_ar: "أُغلق شباك 3", text_en: "Window 3 closed", at: "09:48" },
    ],
  };
}