-- Migration 006: Seed additional branches
-- Staff and supervisor profiles are created via: npx tsx scripts/seed-profiles.ts
-- That script uses the Supabase Auth Admin API which correctly sets up login credentials.

-- ─── Additional Branches ─────────────────────────────────────────────────────
INSERT INTO branches (id, name, name_ar) VALUES

  ('00000000-0000-0000-0000-000000000002',
   'Cairo Civil Registry — Heliopolis Branch',
   'مكتب سجل مدني القاهرة — فرع مصر الجديدة'),

  ('00000000-0000-0000-0000-000000000003',
   'Cairo Civil Registry — Maadi Branch',
   'مكتب سجل مدني القاهرة — فرع المعادي'),

  ('00000000-0000-0000-0000-000000000004',
   'Giza Civil Registry — Dokki Branch',
   'مكتب سجل مدني الجيزة — فرع الدقي'),

  ('00000000-0000-0000-0000-000000000005',
   'Giza Civil Registry — 6th of October Branch',
   'مكتب سجل مدني الجيزة — فرع السادس من أكتوبر'),

  ('00000000-0000-0000-0000-000000000006',
   'Alexandria Civil Registry — Sidi Gaber Branch',
   'مكتب سجل مدني الإسكندرية — فرع سيدي جابر'),

  ('00000000-0000-0000-0000-000000000007',
   'Alexandria Civil Registry — Smouha Branch',
   'مكتب سجل مدني الإسكندرية — فرع سموحة'),

  ('00000000-0000-0000-0000-000000000008',
   'Port Said Civil Registry — Main Branch',
   'مكتب سجل مدني بورسعيد — الفرع الرئيسي'),

  ('00000000-0000-0000-0000-000000000009',
   'Suez Civil Registry — Main Branch',
   'مكتب سجل مدني السويس — الفرع الرئيسي'),

  ('00000000-0000-0000-0000-000000000010',
   'Mansoura Civil Registry — Main Branch',
   'مكتب سجل مدني المنصورة — الفرع الرئيسي')

ON CONFLICT (id) DO NOTHING;
