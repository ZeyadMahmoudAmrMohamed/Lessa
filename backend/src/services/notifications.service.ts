import { getDb } from '../db/client.js';
import { Errors } from '../lib/errors.js';

type NotificationType =
  | 'TURN_APPROACHING'
  | 'TICKET_CALLED'
  | 'TICKET_NO_SHOW'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'WINDOW_CLOSED';

const MESSAGES: Record<NotificationType, { ar: string; en: string }> = {
  TURN_APPROACHING: {
    ar: 'دورك اقترب! توجّه للشباك قريباً',
    en: 'Your turn is near! Head to the window soon',
  },
  TICKET_CALLED: {
    ar: 'تم استدعاء رقمك — توجّه للشباك الآن',
    en: 'Your number was called — go to the window now',
  },
  TICKET_NO_SHOW: {
    ar: 'تم تسجيل غيابك. رقمك لم يعد نشطاً',
    en: 'Marked no-show. Your number is no longer active',
  },
  BOOKING_CONFIRMED: {
    ar: 'تم تأكيد حجزك',
    en: 'Booking confirmed',
  },
  BOOKING_CANCELLED: {
    ar: 'تم إلغاء حجزك بنجاح',
    en: 'Booking cancelled successfully',
  },
  WINDOW_CLOSED: {
    ar: 'الشباك المخصص لخدمتك أُغلق. حجزك لا يزال صالحاً',
    en: 'Your window closed. Your booking remains valid',
  },
};

export class NotificationsService {
  private db = getDb();

  async create(userId: string, type: NotificationType, queueNumber?: number) {
    const msgs = MESSAGES[type];
    const suffix = queueNumber !== undefined ? ` (${queueNumber})` : '';

    await this.db.from('notifications').insert({
      user_id: userId,
      type,
      message_ar: msgs.ar + suffix,
      message_en: msgs.en + suffix,
      read: false,
    });
  }

  async getForUser(userId: string, unreadOnly: boolean) {
    let query = this.db
      .from('notifications')
      .select('id, type, message_ar, message_en, read, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (unreadOnly) query = query.eq('read', false);

    const { data, count, error } = await query;
    if (error) throw Errors.internal(error.message);

    const unreadCount = unreadOnly ? (count ?? 0) : (data ?? []).filter((n) => !n.read).length;

    return {
      notifications: data ?? [],
      unread_count: unreadCount,
    };
  }

  async markAllRead(userId: string) {
    const { count, error } = await this.db
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select('id', { count: 'exact' });

    if (error) throw Errors.internal(error.message);
    return count ?? 0;
  }
}
