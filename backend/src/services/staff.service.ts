import { getDb } from '../db/client.js';
import { Errors } from '../lib/errors.js';
import { TicketStatus } from '../lib/types.js';
import { NotificationsService } from './notifications.service.js';

const notifSvc = new NotificationsService();

export class StaffService {
  private db = getDb();

  async getWindowQueue(windowId: string) {
    const { data: win, error: winErr } = await this.db
      .from('windows')
      .select('id, number, status, services(name_ar, name_en), profiles(full_name)')
      .eq('id', windowId)
      .single();

    if (winErr || !win) throw Errors.notFound('Window');

    const today = new Date().toISOString().slice(0, 10);

    const { data: activeTicket } = await this.db
      .from('tickets')
      .select('id, queue_number, status, profiles!citizen_id(full_name)')
      .eq('window_id', windowId)
      .eq('status', 'active')
      .maybeSingle();

    const { data: waiting } = await this.db
      .from('tickets')
      .select('id, queue_number, status, booked_at')
      .eq('service_id', (win.services as { name_ar: string })?.name_ar ? (win as unknown as { service_id: string }).service_id : '')
      .eq('status', 'waiting')
      .gte('booked_at', `${today}T00:00:00Z`)
      .order('queue_number', { ascending: true })
      .limit(20);

    // Daily stats
    const { count: served } = await this.db.from('tickets').select('id', { count: 'exact', head: true }).eq('window_id', windowId).eq('status', 'done').gte('completed_at', `${today}T00:00:00Z`);
    const { count: skipped } = await this.db.from('tickets').select('id', { count: 'exact', head: true }).eq('window_id', windowId).eq('status', 'skipped').gte('completed_at', `${today}T00:00:00Z`);
    const { count: noShow } = await this.db.from('tickets').select('id', { count: 'exact', head: true }).eq('window_id', windowId).eq('status', 'no_show').gte('completed_at', `${today}T00:00:00Z`);

    return {
      window: {
        id: win.id,
        number: win.number,
        service: win.services,
      },
      active_ticket: activeTicket
        ? {
            id: activeTicket.id,
            queue_number: activeTicket.queue_number,
            citizen_name: (activeTicket.profiles as { full_name: string } | null)?.full_name ?? null,
            status: activeTicket.status,
          }
        : null,
      waiting: waiting ?? [],
      stats_today: { served: served ?? 0, skipped: skipped ?? 0, no_show: noShow ?? 0 },
    };
  }

  async callNext(windowId: string) {
    // Ensure no ticket is already active for this window
    const { count: activeCount } = await this.db
      .from('tickets')
      .select('id', { count: 'exact', head: true })
      .eq('window_id', windowId)
      .eq('status', 'active');

    if ((activeCount ?? 0) > 0) {
      throw Errors.conflict('يوجد رقم نشط بالفعل على هذا الشباك');
    }

    // Get the window to know its service
    const { data: win } = await this.db
      .from('windows')
      .select('service_id')
      .eq('id', windowId)
      .single();

    if (!win) throw Errors.notFound('Window');

    const today = new Date().toISOString().slice(0, 10);

    // Fetch next waiting ticket (lowest queue number)
    const { data: next } = await this.db
      .from('tickets')
      .select('id, queue_number, citizen_id')
      .eq('service_id', win.service_id)
      .eq('status', 'waiting')
      .gte('booked_at', `${today}T00:00:00Z`)
      .order('queue_number', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!next) throw Errors.unprocessable('الطابور فارغ');

    const { data: updated, error } = await this.db
      .from('tickets')
      .update({ status: 'active', window_id: windowId, called_at: new Date().toISOString() })
      .eq('id', next.id)
      .select()
      .single();

    if (error) throw Errors.internal(error.message);

    // Notify the citizen
    await notifSvc.create(next.citizen_id, 'TICKET_CALLED', next.queue_number);

    // Check if 2-3 positions back need a "turn approaching" notification
    await this.notifyApproachingCitizens(win.service_id, next.queue_number, today);

    return updated;
  }

  async updateTicketStatus(ticketId: string, status: 'done' | 'skipped' | 'no_show') {
    const { data: ticket, error: fetchErr } = await this.db
      .from('tickets')
      .select('id, citizen_id, queue_number, service_id, window_id')
      .eq('id', ticketId)
      .eq('status', 'active')
      .maybeSingle();

    if (fetchErr || !ticket) throw Errors.notFound('Active ticket');

    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    if (status === 'skipped') {
      // Place at back of today's queue
      const { data: maxRow } = await this.db
        .from('tickets')
        .select('queue_number')
        .eq('service_id', ticket.service_id)
        .gte('booked_at', `${today}T00:00:00Z`)
        .order('queue_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newNumber = (maxRow?.queue_number ?? 0) + 1;

      await this.db
        .from('tickets')
        .update({ status: 'waiting', queue_number: newNumber, window_id: null, called_at: null })
        .eq('id', ticketId);
    } else {
      await this.db
        .from('tickets')
        .update({ status, completed_at: now })
        .eq('id', ticketId);

      if (status === 'no_show') {
        await notifSvc.create(ticket.citizen_id, 'TICKET_NO_SHOW', ticket.queue_number);
      }
    }

    const { data: result } = await this.db.from('tickets').select().eq('id', ticketId).single();
    return result;
  }

  private async notifyApproachingCitizens(serviceId: string, calledNumber: number, today: string) {
    // FR-018: notify citizens 2-3 positions away
    const { data: approaching } = await this.db
      .from('tickets')
      .select('id, citizen_id, queue_number')
      .eq('service_id', serviceId)
      .eq('status', 'waiting')
      .gte('booked_at', `${today}T00:00:00Z`)
      .gt('queue_number', calledNumber)
      .lte('queue_number', calledNumber + 3)
      .order('queue_number', { ascending: true });

    if (!approaching) return;

    for (const t of approaching) {
      await notifSvc.create(t.citizen_id, 'TURN_APPROACHING', t.queue_number);
    }
  }
}
