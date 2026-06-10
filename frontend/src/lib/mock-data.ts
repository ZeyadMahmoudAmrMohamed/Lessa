export type Congestion = "LOW" | "MEDIUM" | "HIGH" | "NONE";
export type TicketStatus = "waiting" | "active" | "done" | "skipped" | "no_show";
export type Role = "citizen" | "staff" | "supervisor" | "admin";

export interface PublicService {
  id: string;
  name_ar: string;
  name_en: string;
  image?: string;
  estimated_duration_minutes: number;
  active_windows: number;
  queue_size: number;
  congestion: Congestion;
  estimated_wait_minutes: number | null;
}

export interface Ticket {
  id: string;
  queue_number: number;
  service: { id: string; name_ar: string; name_en: string };
  status: TicketStatus;
  position: number;
  estimated_wait_minutes: number;
  queue_total: number;
  window_number: number | null;
  booked_at: string;
}

export const publicServices: PublicService[] = [
  {
    id: "svc-001",
    name_ar: "تجديد بطاقة الهوية",
    name_en: "ID Card Renewal",
    estimated_duration_minutes: 10,
    active_windows: 3,
    queue_size: 12,
    congestion: "MEDIUM",
    estimated_wait_minutes: 15,
  },
  {
    id: "svc-002",
    name_ar: "استخراج شهادة الميلاد",
    name_en: "Birth Certificate",
    estimated_duration_minutes: 7,
    active_windows: 2,
    queue_size: 4,
    congestion: "LOW",
    estimated_wait_minutes: 7,
  },
  {
    id: "svc-003",
    name_ar: "تسجيل السيارات",
    name_en: "Vehicle Registration",
    estimated_duration_minutes: 15,
    active_windows: 1,
    queue_size: 21,
    congestion: "HIGH",
    estimated_wait_minutes: 45,
  },
  {
    id: "svc-004",
    name_ar: "استخراج جواز السفر",
    name_en: "Passport Issuance",
    estimated_duration_minutes: 20,
    active_windows: 0,
    queue_size: 0,
    congestion: "NONE",
    estimated_wait_minutes: null,
  },
];
