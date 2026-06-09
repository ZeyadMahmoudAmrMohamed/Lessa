import { getDb } from '../db/client.js';
import { Errors } from '../lib/errors.js';
import { Role } from '../lib/types.js';

export class AdminService {
  private db = getDb();

  async listUsers({ page, limit, search }: { page: number; limit: number; search?: string }) {
    let query = this.db
      .from('profiles')
      .select('id, full_name, phone, role, is_active, created_at', { count: 'exact' });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const offset = (page - 1) * limit;
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw Errors.internal(error.message);

    return {
      users: data ?? [],
      total: count ?? 0,
      page,
    };
  }

  async updateUser(userId: string, patch: { role?: Role; is_active?: boolean }) {
    const { data: profile, error: profileErr } = await this.db
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select()
      .single();

    if (profileErr || !profile) throw Errors.notFound('User');

    // Sync role into Supabase Auth app_metadata so JWT claims stay current
    if (patch.role) {
      await this.db.auth.admin.updateUserById(userId, {
        app_metadata: { role: patch.role },
      });
    }

    return profile;
  }

  async getReports({ start, end }: { start: string; end: string }) {
    const { data: tickets, error } = await this.db
      .from('tickets')
      .select('status, booked_at, service_id, services(name_ar)')
      .gte('booked_at', `${start}T00:00:00Z`)
      .lte('booked_at', `${end}T23:59:59Z`);

    if (error) throw Errors.internal(error.message);

    const all = tickets ?? [];
    const noShowCount = all.filter((t) => t.status === 'no_show').length;

    // Daily bucketing
    const daily: Record<string, number> = {};
    for (const t of all) {
      const date = t.booked_at?.slice(0, 10);
      if (date) daily[date] = (daily[date] ?? 0) + 1;
    }
    const peakDay = Object.entries(daily).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    // No-show by service
    const serviceMap: Record<string, { name_ar: string; total: number; no_show: number }> = {};
    for (const t of all) {
      const svcId = t.service_id;
      if (!serviceMap[svcId]) {
        serviceMap[svcId] = {
          name_ar: (t.services as { name_ar: string })?.name_ar ?? svcId,
          total: 0,
          no_show: 0,
        };
      }
      serviceMap[svcId].total++;
      if (t.status === 'no_show') serviceMap[svcId].no_show++;
    }

    return {
      summary: {
        total_transactions: all.length,
        avg_wait_minutes: null,
        no_show_rate: all.length > 0 ? +(noShowCount / all.length).toFixed(2) : 0,
        peak_day: peakDay,
      },
      daily: Object.entries(daily)
        .sort()
        .map(([date, tickets]) => ({ date, tickets })),
      no_show_by_service: Object.values(serviceMap).map((s) => ({
        service_name_ar: s.name_ar,
        rate: s.total > 0 ? +(s.no_show / s.total).toFixed(2) : 0,
      })),
    };
  }
}
