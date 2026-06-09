-- Migration 004: Seed the single MVP branch
-- The UUID here MUST match BRANCH_ID in your .env file.

INSERT INTO branches (id, name, name_ar)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Central Government Services Branch',
  'فرع الخدمات الحكومية المركزي'
)
ON CONFLICT (id) DO NOTHING;
