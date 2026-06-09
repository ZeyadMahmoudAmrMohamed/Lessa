-- Migration 003: Atomic queue number function
-- Uses a dedicated counter table instead of PostgreSQL sequences
-- (sequences can't be reset per-service per-day without DDL, which requires superuser).
-- This table-based approach is safe, auditable, and works within Supabase permissions.

CREATE TABLE IF NOT EXISTS queue_counters (
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  last_number INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (service_id, date)
);

-- next_queue_number: atomically increments and returns the next queue number
-- for a given service on today's date. Safe under concurrent calls.
CREATE OR REPLACE FUNCTION next_queue_number(p_service_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER  -- runs as the function owner, bypassing RLS on queue_counters
AS $$
DECLARE
  v_next INTEGER;
BEGIN
  INSERT INTO queue_counters (service_id, date, last_number)
    VALUES (p_service_id, CURRENT_DATE, 1)
  ON CONFLICT (service_id, date)
    DO UPDATE SET last_number = queue_counters.last_number + 1
  RETURNING last_number INTO v_next;

  RETURN v_next;
END;
$$;
