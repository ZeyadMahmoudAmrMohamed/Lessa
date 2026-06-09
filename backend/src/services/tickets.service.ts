import { getDb } from '../db/client.js';
import { env } from '../lib/env.js';
import { Errors } from '../lib/errors.js';
import { NotificationsService } from './notifications.service.js';

const notifSvc = new NotificationsService();

export class TicketsService {
  private db = getDb();

  async getActiveTicket(citizenId: string) {
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await this.db
      .from('tickets')
      .select(`
        id, queue_number, status, booked_at,
        services(id, name_ar, name_en, estimated_duration_minutes),
        windows(number)
      `)
      .eq('citizen_id', citizenId)
      .in('status', ['waiting', 'active'])
      .gte('booked_at', `${today}T00:00:00Z`)
      .maybeSingle();

    if (error) throw Errors.internal(error.message);
    if (!data) return null;

    // Compute position: count tickets waiting ahead of this one for the same service
    const { count: position } = await this.db
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('service_id', (data.services as { id: string }).id)
      .eq('status', 'waiting')
      .lt('queue_number', data.queue_number);

    const { count: total } = await this.db
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('service_id', (data.services as { id: string }).id)
      .eq('status', 'waiting');

    const svc = data.services as { id: string; name_ar: string; name_en: string; estimated_duration_minutes: number };
    const pos = (position ?? 0) + 1;

    return {
      id: data.id,
      queue_number: data.queue_number,
      service: { id: svc.id, name_ar: svc.name_ar, name_en: svc.name_en },
      status: data.status,
      position: pos,
      estimated_wait_minutes: pos * svc.estimated_duration_minutes,
      queue_total: total ?? 0,
      window_number: (data.windows as { number: number } | null)?.number ?? null,
      booked_at: data.booked_at,
    };
  }

  async bookTicket(citizenId: string, serviceId: string) {
    const today = new Date().toISOString().slice(0, 10);

    // FR-004: prevent duplicate booking for same service today
    const { count: existing } = await this.db
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('citizen_id', citizenId)
      .eq('service_id', serviceId)
      .in('status', ['waiting', 'active'])
      .gte('booked_at', `${today}T00:00:00Z`);

    if ((existing ?? 0) > 0) {
      throw Errors.conflict('لديك حجز نشط بالفعل لهذه الخدمة اليوم');
    }

    // FR-008: reject if no active windows for this service
    const { count: activeWindows } = await this.db
      .from('windows')
      .select('id', { count: 'exact', head: true })
      .eq('service_id', serviceId)
      .eq('status', 'open')
      .eq('branch_id', env.BRANCH_ID);

    if ((activeWindows ?? 0) === 0) {
      throw Errors.unprocessable('هذه الخدمة غير متاحة حالياً');
    }

    // FR-001: atomic queue number via DB function (prevents race conditions)
    const { data: seqData, error: seqError } = await this.db.rpc('next_queue_number', {
      p_service_id: serviceId,
    });

    if (seqError) throw Errors.internal(seqError.message);

    const { data: ticket, error: insertError } = await this.db
      .from('tickets')
      .insert({
        citizen_id: citizenId,
        service_id: serviceId,
        branch_id: env.BRANCH_ID,
        queue_number: seqData as number,
        status: 'waiting',
      })
      .select(`
        id, queue_number, status,
        services(id, name_ar, name_en, estimated_duration_minutes)
      `)
      .single();

    if (insertError) throw Errors.internal(insertError.message);

    // Compute position for response
    const svc = ticket.services as { id: string; name_ar: string; name_en: string; estimated_duration_minutes: number };
    const { count: pos } = await this.db
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('service_id', serviceId)
      .eq('status', 'waiting')
      .lt('queue_number', ticket.queue_number);

    const position = (pos ?? 0) + 1;

    // Create booking confirmation notification
    await notifSvc.create(citizenId, 'BOOKING_CONFIRMED', ticket.queue_number);

    return {
      id: ticket.id,
      queue_number: ticket.queue_number,
      service: { id: svc.id, name_ar: svc.name_ar, name_en: svc.name_en },
      status: ticket.status,
      position,
      estimated_wait_minutes: position * svc.estimated_duration_minutes,
    };
  }

  async cancelTicket(citizenId: string, ticketId: string) {
    const { data, error } = await this.db
      .from('tickets')
      .update({ status: 'cancelled', completed_at: new Date().toISOString() })
      .eq('id', ticketId)
      .eq('citizen_id', citizenId)
      .in('status', ['waiting'])
      .select()
      .maybeSingle();

    if (error) throw Errors.internal(error.message);
    if (!data) throw Errors.notFound('Ticket');
  }

  async getHistory(citizenId: string, limit = 5) {
    const { data, error } = await this.db
      .from('tickets')
      .select('id, queue_number, status, booked_at, services(name_ar)')
      .eq('citizen_id', citizenId)
      .in('status', ['done', 'skipped', 'no_show', 'cancelled'])
      .order('booked_at', { ascending: false })
      .limit(limit);

    if (error) throw Errors.internal(error.message);

    return (data ?? []).map((t) => ({
      id: t.id,
      queue_number: t.queue_number,
      service_name_ar: (t.services as { name_ar: string })?.name_ar ?? '',
      status: t.status,
      date: t.booked_at?.slice(0, 10),
    }));
  }
}
