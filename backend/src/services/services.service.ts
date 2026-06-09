import { getDb } from '../db/client.js';
import { env } from '../lib/env.js';
import { Errors } from '../lib/errors.js';
import { CongestionLevel } from '../lib/types.js';

function computeCongestion(queueSize: number, activeWindows: number): CongestionLevel {
  if (activeWindows === 0) return 'NONE';
  const ratio = queueSize / (activeWindows * 5); // 5 tickets per window = baseline
  if (ratio <= 0.4) return 'LOW';
  if (ratio <= 0.9) return 'MEDIUM';
  return 'HIGH';
}

export class ServicesService {
  private db = getDb();

  async getPublicServices() {
    const { data: services, error } = await this.db
      .from('services')
      .select(`
        id, name_ar, name_en, estimated_duration_minutes,
        windows!inner(id, status)
      `)
      .eq('is_active', true)
      .eq('branch_id', env.BRANCH_ID);

    if (error) throw Errors.internal(error.message);

    return Promise.all(
      (services ?? []).map(async (svc) => {
        const activeWindows = (svc.windows as { status: string }[]).filter(
          (w) => w.status === 'open',
        ).length;

        const { count } = await this.db
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('service_id', svc.id)
          .eq('status', 'waiting');

        const queueSize = count ?? 0;
        const congestion = computeCongestion(queueSize, activeWindows);
        const estimatedWait =
          activeWindows > 0
            ? Math.ceil((queueSize / activeWindows) * svc.estimated_duration_minutes)
            : null;

        return {
          id: svc.id,
          name_ar: svc.name_ar,
          name_en: svc.name_en,
          estimated_duration_minutes: svc.estimated_duration_minutes,
          active_windows: activeWindows,
          queue_size: queueSize,
          congestion,
          estimated_wait_minutes: estimatedWait,
        };
      }),
    );
  }

  async listAll() {
    const { data, error } = await this.db
      .from('services')
      .select('id, name_ar, name_en, estimated_duration_minutes, is_active')
      .eq('branch_id', env.BRANCH_ID)
      .order('name_ar');

    if (error) throw Errors.internal(error.message);
    return data ?? [];
  }

  async create(input: { name_ar: string; name_en: string; estimated_duration_minutes: number }) {
    const { data, error } = await this.db
      .from('services')
      .insert({ ...input, branch_id: env.BRANCH_ID, is_active: true })
      .select()
      .single();

    if (error) throw Errors.internal(error.message);
    return data;
  }

  async update(id: string, patch: Partial<{ name_ar: string; name_en: string; estimated_duration_minutes: number; is_active: boolean }>) {
    const { data, error } = await this.db
      .from('services')
      .update(patch)
      .eq('id', id)
      .eq('branch_id', env.BRANCH_ID)
      .select()
      .single();

    if (error) throw Errors.internal(error.message);
    if (!data) throw Errors.notFound('Service');
    return data;
  }
}
