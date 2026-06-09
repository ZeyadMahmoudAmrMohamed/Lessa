import { getDb } from '../db/client.js';
import { Errors } from '../lib/errors.js';

export class SupervisorService {
  private db = getDb();

  async getBranchDashboard(branchId: string) {
    const { data: windows, error } = await this.db
      .from('windows')
      .select(`
        id, number, status,
        services(name_ar, name_en),
        profiles!assigned_staff_id(id, full_name)
      `)
      .eq('branch_id', branchId)
      .order('number');

    if (error) throw Errors.internal(error.message);

    const today = new Date().toISOString().slice(0, 10);

    const windowsWithStats = await Promise.all(
      (windows ?? []).map(async (w) => {
        const { count: served } = await this.db
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('window_id', w.id)
          .eq('status', 'done')
          .gte('completed_at', `${today}T00:00:00Z`);

        const staff = w.profiles as { id: string; full_name: string } | null;

        return {
          id: w.id,
          number: w.number,
          status: w.status,
          assigned_staff: staff ? { id: staff.id, name: staff.full_name } : null,
          service: w.services,
          tickets_served_today: served ?? 0,
          current_queue_size: 0, // populated below
        };
      }),
    );

    // Summary stats
    const activeWindows = windowsWithStats.filter((w) => w.status === 'open').length;
    const { count: totalTickets } = await this.db.from('tickets').select('id', { count: 'exact', head: true }).eq('branch_id', branchId).gte('booked_at', `${today}T00:00:00Z`);
    const { count: waiting } = await this.db.from('tickets').select('id', { count: 'exact', head: true }).eq('branch_id', branchId).eq('status', 'waiting');

    return {
      summary: {
        active_windows: activeWindows,
        total_tickets_today: totalTickets ?? 0,
        currently_waiting: waiting ?? 0,
        avg_wait_minutes: null, // calculated in reporting phase
      },
      windows: windowsWithStats,
    };
  }

  async updateWindow(windowId: string, patch: { status?: 'open' | 'closed' }) {
    const { data, error } = await this.db
      .from('windows')
      .update(patch)
      .eq('id', windowId)
      .select()
      .single();

    if (error) throw Errors.internal(error.message);
    if (!data) throw Errors.notFound('Window');
    return data;
  }

  async assignStaff(windowId: string, staffId: string) {
    // Verify the user is actually a staff member
    const { data: profile } = await this.db
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', staffId)
      .eq('role', 'staff')
      .maybeSingle();

    if (!profile) throw Errors.unprocessable('المستخدم ليس موظفاً');

    const { data, error } = await this.db
      .from('windows')
      .update({ assigned_staff_id: staffId })
      .eq('id', windowId)
      .select()
      .single();

    if (error) throw Errors.internal(error.message);
    return { ...data, assigned_staff: { id: profile.id, name: profile.full_name } };
  }

  async getDailySummary(branchId: string, date: string) {
    const start = `${date}T00:00:00Z`;
    const end = `${date}T23:59:59Z`;

    const { data: tickets, error } = await this.db
      .from('tickets')
      .select('status, booked_at, called_at, completed_at, service_id, services(name_ar)')
      .eq('branch_id', branchId)
      .gte('booked_at', start)
      .lte('booked_at', end);

    if (error) throw Errors.internal(error.message);

    const all = tickets ?? [];
    const served = all.filter((t) => t.status === 'done').length;
    const skipped = all.filter((t) => t.status === 'skipped').length;
    const noShow = all.filter((t) => t.status === 'no_show').length;

    // Group by service
    const byService: Record<string, { name_ar: string; issued: number; served: number; no_show: number }> = {};
    for (const t of all) {
      const svcId = t.service_id;
      const name = (t.services as { name_ar: string })?.name_ar ?? svcId;
      if (!byService[svcId]) byService[svcId] = { name_ar: name, issued: 0, served: 0, no_show: 0 };
      byService[svcId].issued++;
      if (t.status === 'done') byService[svcId].served++;
      if (t.status === 'no_show') byService[svcId].no_show++;
    }

    // Hourly breakdown
    const hourlyCounts: Record<string, number> = {};
    for (const t of all) {
      const hour = t.booked_at?.slice(11, 13);
      if (hour) hourlyCounts[hour] = (hourlyCounts[hour] ?? 0) + 1;
    }

    return {
      date,
      stats: { issued: all.length, served, skipped, no_show: noShow, avg_wait_minutes: null },
      hourly: Object.entries(hourlyCounts)
        .sort()
        .map(([h, count]) => ({ hour: `${h}:00`, count })),
      by_service: Object.values(byService),
    };
  }
}
