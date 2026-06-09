-- Migration 002: Row-Level Security policies
-- Constitution Principle IV: RLS MUST be enabled on all user-data tables.
-- The Node.js API uses the service_role key (bypasses RLS) and enforces
-- authorization itself. RLS here is a defence-in-depth layer for any direct
-- or future client connections.

-- ─── Enable RLS ──────────────────────────────────────────────────────────────
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE windows        ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Users can read and update only their own profile.
CREATE POLICY "profiles_self_read"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_self_update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins and supervisors can read all profiles.
CREATE POLICY "profiles_admin_read"
  ON profiles FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'supervisor')
  );

-- ─── Services ─────────────────────────────────────────────────────────────────
-- Active services are publicly readable (no auth needed via API; this covers direct access).
CREATE POLICY "services_public_read"
  ON services FOR SELECT
  USING (is_active = TRUE);

-- Admins can read all services (including inactive) and write.
CREATE POLICY "services_admin_all"
  ON services FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ─── Windows ─────────────────────────────────────────────────────────────────
-- Authenticated users can read windows (staff need queue info).
CREATE POLICY "windows_auth_read"
  ON windows FOR SELECT
  USING (auth.role() = 'authenticated');

-- Supervisors and admins can write.
CREATE POLICY "windows_supervisor_write"
  ON windows FOR ALL
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('supervisor', 'admin')
  );

-- ─── Tickets ─────────────────────────────────────────────────────────────────
-- Citizens can read only their own tickets.
CREATE POLICY "tickets_citizen_self"
  ON tickets FOR SELECT
  USING (
    auth.uid() = citizen_id
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'citizen'
  );

-- Staff, supervisors, admins can read all tickets.
CREATE POLICY "tickets_staff_read"
  ON tickets FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('staff', 'supervisor', 'admin')
  );

-- ─── Notifications ────────────────────────────────────────────────────────────
-- Users can only see their own notifications.
CREATE POLICY "notifications_self"
  ON notifications FOR ALL
  USING (auth.uid() = user_id);
