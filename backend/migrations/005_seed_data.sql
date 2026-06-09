-- Migration 005: Seed Egyptian government data
-- Run after 004_seed_branch.sql
-- Note: profiles require auth.users entries — seed staff/supervisor users via the API
--       then run the role-promotion UPDATE statements at the bottom.

-- ─── Branch (update the MVP branch with a real name) ─────────────────────────
UPDATE branches
SET
  name    = 'Cairo Civil Registry — Nasr City Branch',
  name_ar = 'مكتب سجل مدني القاهرة — فرع مدينة نصر'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- ─── Services ────────────────────────────────────────────────────────────────
INSERT INTO services (id, branch_id, name_ar, name_en, estimated_duration_minutes, is_active)
VALUES
  -- National ID
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'استخراج بطاقة الرقم القومي',
   'National ID Card Issuance', 15, TRUE),

  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   'تجديد بطاقة الرقم القومي',
   'National ID Card Renewal', 10, TRUE),

  -- Passport
  ('10000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   'استخراج جواز السفر',
   'Passport Issuance', 20, TRUE),

  ('10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000001',
   'تجديد جواز السفر',
   'Passport Renewal', 15, TRUE),

  -- Civil registry
  ('10000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000001',
   'استخراج شهادة الميلاد',
   'Birth Certificate', 10, TRUE),

  ('10000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000001',
   'استخراج شهادة الوفاة',
   'Death Certificate', 10, TRUE),

  ('10000000-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000001',
   'توثيق عقد الزواج',
   'Marriage Contract Authentication', 20, TRUE),

  ('10000000-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000001',
   'توثيق عقد الطلاق',
   'Divorce Certificate Authentication', 20, TRUE),

  -- Criminal record & certificates
  ('10000000-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000001',
   'شهادة عدم المحكومية',
   'Criminal Record Certificate', 15, TRUE),

  ('10000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000001',
   'شهادة الموقف من التجنيد',
   'Military Service Status Certificate', 15, TRUE),

  -- Vehicle & driving
  ('10000000-0000-0000-0000-000000000011',
   '00000000-0000-0000-0000-000000000001',
   'استخراج رخصة القيادة',
   'Driver''s License Issuance', 20, TRUE),

  ('10000000-0000-0000-0000-000000000012',
   '00000000-0000-0000-0000-000000000001',
   'تجديد رخصة القيادة',
   'Driver''s License Renewal', 10, TRUE),

  -- Social & pension
  ('10000000-0000-0000-0000-000000000013',
   '00000000-0000-0000-0000-000000000001',
   'خدمات التأمين الاجتماعي',
   'Social Insurance Services', 20, TRUE),

  ('10000000-0000-0000-0000-000000000014',
   '00000000-0000-0000-0000-000000000001',
   'صرف المعاش',
   'Pension Disbursement', 10, TRUE),

  -- Tax
  ('10000000-0000-0000-0000-000000000015',
   '00000000-0000-0000-0000-000000000001',
   'خدمات مصلحة الضرائب',
   'Tax Authority Services', 25, TRUE)

ON CONFLICT (id) DO NOTHING;

-- ─── Windows (2 windows per high-demand service, 1 for others) ───────────────
INSERT INTO windows (branch_id, service_id, number, status)
VALUES
  -- National ID Issuance — 2 windows
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, 'open'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 2, 'open'),

  -- National ID Renewal — 2 windows
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 3, 'open'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 4, 'open'),

  -- Passport Issuance — 2 windows
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 5, 'open'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 6, 'open'),

  -- Passport Renewal — 2 windows
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 7, 'open'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 8, 'open'),

  -- Birth Certificate
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 9, 'open'),

  -- Death Certificate
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 10, 'open'),

  -- Marriage Contract
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 11, 'open'),

  -- Divorce Certificate
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', 12, 'open'),

  -- Criminal Record
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000009', 13, 'open'),

  -- Military Status
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000010', 14, 'open'),

  -- Driver's License Issuance
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000011', 15, 'open'),

  -- Driver's License Renewal
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000012', 16, 'open'),

  -- Social Insurance
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013', 17, 'open'),

  -- Pension
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000014', 18, 'open'),

  -- Tax Authority — 2 windows
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000015', 19, 'open'),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000015', 20, 'open')

ON CONFLICT DO NOTHING;

-- ─── Staff & Supervisor role promotion ───────────────────────────────────────
-- After registering users via POST /api/auth/register, promote them here.
-- Replace the phone numbers with the ones you registered.
--
-- Example:
-- UPDATE profiles SET role = 'staff'      WHERE phone IN ('01XXXXXXXXX', '01XXXXXXXXX');
-- UPDATE profiles SET role = 'supervisor' WHERE phone IN ('01XXXXXXXXX');
--
-- Then update Supabase Auth app_metadata to match:
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "staff"}'::jsonb
-- WHERE email IN ('01XXXXXXXXX@phone.lessa');
