-- Migration 006: Seed additional branches and staff/supervisor profiles
-- Run after 005_seed_data.sql
--
-- All seeded staff/supervisor accounts use password: Staff@1234
-- Citizens should register via the API as normal.

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

-- ─── Auth users for staff & supervisors ──────────────────────────────────────
-- Inserts directly into auth.users with bcrypt-hashed password (Staff@1234).
-- These bypass the API registration flow intentionally for seeding purposes.

INSERT INTO auth.users (
  id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) VALUES

  -- ── Supervisors ──────────────────────────────────────────────────────────

  ('20000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated',
   '01001000001@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"supervisor"}',
   '{"full_name":"محمد أحمد السيد","phone":"01001000001","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated',
   '01001000002@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"supervisor"}',
   '{"full_name":"فاطمة علي حسن","phone":"01001000002","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated',
   '01001000003@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"supervisor"}',
   '{"full_name":"خالد محمود إبراهيم","phone":"01001000003","email_verified":true}',
   now(), now()),

  -- ── Staff — Nasr City Branch ─────────────────────────────────────────────

  ('20000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated',
   '01002000001@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"أحمد عبد الله رمضان","phone":"01002000001","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated',
   '01002000002@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"نورهان سامي يوسف","phone":"01002000002","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated',
   '01002000003@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"عمر حسام الدين","phone":"01002000003","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000013', 'authenticated', 'authenticated',
   '01002000004@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"ريهام طارق منصور","phone":"01002000004","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000014', 'authenticated', 'authenticated',
   '01002000005@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"يوسف محمد حافظ","phone":"01002000005","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000015', 'authenticated', 'authenticated',
   '01002000006@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"منى إبراهيم عوض","phone":"01002000006","email_verified":true}',
   now(), now()),

  -- ── Staff — Alexandria Branch ────────────────────────────────────────────

  ('20000000-0000-0000-0000-000000000020', 'authenticated', 'authenticated',
   '01002000010@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"كريم عادل فؤاد","phone":"01002000010","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000021', 'authenticated', 'authenticated',
   '01002000011@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"دينا وليد الشافعي","phone":"01002000011","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000022', 'authenticated', 'authenticated',
   '01002000012@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"هاني جمال عثمان","phone":"01002000012","email_verified":true}',
   now(), now()),

  -- ── Staff — Giza Branch ──────────────────────────────────────────────────

  ('20000000-0000-0000-0000-000000000030', 'authenticated', 'authenticated',
   '01002000020@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"سارة حمدي النجار","phone":"01002000020","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000031', 'authenticated', 'authenticated',
   '01002000021@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"محمود رضا البنا","phone":"01002000021","email_verified":true}',
   now(), now()),

  ('20000000-0000-0000-0000-000000000032', 'authenticated', 'authenticated',
   '01002000022@phone.lessa',
   crypt('Staff@1234', gen_salt('bf')),
   now(),
   '{"provider":"email","providers":["email"],"role":"staff"}',
   '{"full_name":"إسراء حسن مرسي","phone":"01002000022","email_verified":true}',
   now(), now())

ON CONFLICT (id) DO NOTHING;

-- ─── Profiles ────────────────────────────────────────────────────────────────
INSERT INTO profiles (id, full_name, phone, role) VALUES

  -- Supervisors
  ('20000000-0000-0000-0000-000000000001', 'محمد أحمد السيد',    '01001000001', 'supervisor'),
  ('20000000-0000-0000-0000-000000000002', 'فاطمة علي حسن',      '01001000002', 'supervisor'),
  ('20000000-0000-0000-0000-000000000003', 'خالد محمود إبراهيم', '01001000003', 'supervisor'),

  -- Staff — Nasr City
  ('20000000-0000-0000-0000-000000000010', 'أحمد عبد الله رمضان', '01002000001', 'staff'),
  ('20000000-0000-0000-0000-000000000011', 'نورهان سامي يوسف',    '01002000002', 'staff'),
  ('20000000-0000-0000-0000-000000000012', 'عمر حسام الدين',      '01002000003', 'staff'),
  ('20000000-0000-0000-0000-000000000013', 'ريهام طارق منصور',    '01002000004', 'staff'),
  ('20000000-0000-0000-0000-000000000014', 'يوسف محمد حافظ',      '01002000005', 'staff'),
  ('20000000-0000-0000-0000-000000000015', 'منى إبراهيم عوض',     '01002000006', 'staff'),

  -- Staff — Alexandria
  ('20000000-0000-0000-0000-000000000020', 'كريم عادل فؤاد',      '01002000010', 'staff'),
  ('20000000-0000-0000-0000-000000000021', 'دينا وليد الشافعي',   '01002000011', 'staff'),
  ('20000000-0000-0000-0000-000000000022', 'هاني جمال عثمان',     '01002000012', 'staff'),

  -- Staff — Giza
  ('20000000-0000-0000-0000-000000000030', 'سارة حمدي النجار',    '01002000020', 'staff'),
  ('20000000-0000-0000-0000-000000000031', 'محمود رضا البنا',     '01002000021', 'staff'),
  ('20000000-0000-0000-0000-000000000032', 'إسراء حسن مرسي',      '01002000022', 'staff')

ON CONFLICT (id) DO NOTHING;

-- ─── Assign staff to windows in Nasr City branch ─────────────────────────────
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000010' WHERE number = 1  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000011' WHERE number = 2  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000012' WHERE number = 3  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000013' WHERE number = 4  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000014' WHERE number = 5  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000015' WHERE number = 6  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000010' WHERE number = 7  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000011' WHERE number = 8  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000012' WHERE number = 9  AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000013' WHERE number = 10 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000014' WHERE number = 11 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000015' WHERE number = 12 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000010' WHERE number = 13 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000011' WHERE number = 14 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000012' WHERE number = 15 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000013' WHERE number = 16 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000014' WHERE number = 17 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000015' WHERE number = 18 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000010' WHERE number = 19 AND branch_id = '00000000-0000-0000-0000-000000000001';
UPDATE windows SET assigned_staff_id = '20000000-0000-0000-0000-000000000011' WHERE number = 20 AND branch_id = '00000000-0000-0000-0000-000000000001';
