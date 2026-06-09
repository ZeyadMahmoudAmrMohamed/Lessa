/**
 * Seed script — creates staff and supervisor accounts via Supabase Auth Admin API.
 * Run with: npx tsx scripts/seed-profiles.ts
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const db = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PASSWORD = 'Staff@1234';

const users: { phone: string; full_name: string; role: 'staff' | 'supervisor' }[] = [
  // Supervisors
  { phone: '01001000001', full_name: 'محمد أحمد السيد',    role: 'supervisor' },
  { phone: '01001000002', full_name: 'فاطمة علي حسن',      role: 'supervisor' },
  { phone: '01001000003', full_name: 'خالد محمود إبراهيم', role: 'supervisor' },

  // Staff — Nasr City
  { phone: '01002000001', full_name: 'أحمد عبد الله رمضان', role: 'staff' },
  { phone: '01002000002', full_name: 'نورهان سامي يوسف',    role: 'staff' },
  { phone: '01002000003', full_name: 'عمر حسام الدين',      role: 'staff' },
  { phone: '01002000004', full_name: 'ريهام طارق منصور',    role: 'staff' },
  { phone: '01002000005', full_name: 'يوسف محمد حافظ',      role: 'staff' },
  { phone: '01002000006', full_name: 'منى إبراهيم عوض',     role: 'staff' },

  // Staff — Alexandria
  { phone: '01002000010', full_name: 'كريم عادل فؤاد',      role: 'staff' },
  { phone: '01002000011', full_name: 'دينا وليد الشافعي',   role: 'staff' },
  { phone: '01002000012', full_name: 'هاني جمال عثمان',     role: 'staff' },

  // Staff — Giza
  { phone: '01002000020', full_name: 'سارة حمدي النجار',    role: 'staff' },
  { phone: '01002000021', full_name: 'محمود رضا البنا',     role: 'staff' },
  { phone: '01002000022', full_name: 'إسراء حسن مرسي',      role: 'staff' },
];

async function seed() {
  console.log(`Seeding ${users.length} users...\n`);
  let created = 0, skipped = 0;

  for (const u of users) {
    const email = `${u.phone}@phone.lessa`;

    // Create auth user
    const { data, error } = await db.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      app_metadata: { role: u.role },
      user_metadata: { full_name: u.full_name, phone: u.phone },
    });

    if (error) {
      if (error.message?.toLowerCase().includes('already')) {
        console.log(`  SKIP  ${u.phone} — ${u.full_name} (already exists)`);
        skipped++;
        continue;
      }
      console.error(`  ERROR ${u.phone} — ${error.message}`);
      continue;
    }

    // Insert profile
    const { error: profileError } = await db.from('profiles').insert({
      id: data.user.id,
      full_name: u.full_name,
      phone: u.phone,
      role: u.role,
    });

    if (profileError) {
      console.error(`  PROFILE ERROR ${u.phone} — ${profileError.message}`);
    } else {
      console.log(`  OK    ${u.phone} — ${u.full_name} (${u.role})`);
      created++;
    }
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`);
}

seed().catch(console.error);
