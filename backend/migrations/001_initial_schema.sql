-- Migration 001: Initial schema — Lessa? Government Queue Platform
-- Run once against your Supabase project via the SQL editor or CLI.
-- All tables use UUID primary keys; created_at defaults to now().

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Branches ────────────────────────────────────────────────────────────────
-- Single MVP branch. Seeded with a fixed UUID matching BRANCH_ID in .env
CREATE TABLE IF NOT EXISTS branches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  name_ar     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- Mirrors auth.users; id == Supabase Auth user UUID.
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'citizen'
                CHECK (role IN ('citizen', 'staff', 'supervisor', 'admin')),
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Services ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id                     UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name_ar                       TEXT NOT NULL,
  name_en                       TEXT NOT NULL,
  estimated_duration_minutes    INTEGER NOT NULL CHECK (estimated_duration_minutes > 0),
  is_active                     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Windows ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS windows (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id           UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  service_id          UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  number              INTEGER NOT NULL,
  status              TEXT NOT NULL DEFAULT 'closed'
                        CHECK (status IN ('open', 'closed')),
  assigned_staff_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (branch_id, number)
);

-- ─── Tickets ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id     UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  service_id    UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  citizen_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  window_id     UUID REFERENCES windows(id) ON DELETE SET NULL,
  queue_number  INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'waiting'
                  CHECK (status IN ('waiting', 'active', 'done', 'skipped', 'no_show', 'cancelled')),
  booked_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  called_at     TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ
);

-- ─── Notifications ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  message_ar  TEXT NOT NULL,
  message_en  TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
-- Ticket lookups — heavily used on every queue refresh
CREATE INDEX IF NOT EXISTS idx_tickets_citizen_status
  ON tickets(citizen_id, status);

CREATE INDEX IF NOT EXISTS idx_tickets_service_status_number
  ON tickets(service_id, status, queue_number);

CREATE INDEX IF NOT EXISTS idx_tickets_window_status
  ON tickets(window_id, status);

CREATE INDEX IF NOT EXISTS idx_tickets_branch_date
  ON tickets(branch_id, booked_at);

-- Notification lookups
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON notifications(user_id, read, created_at DESC);
