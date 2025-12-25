-- =====================================================
-- NEUROV V7+: TERMINOLOGY REFACTOR & AUDIT LOGS
-- =====================================================

-- Rename column in clinics
ALTER TABLE clinics 
  RENAME COLUMN donna_sovereign_mode TO donna_executive_mode;

-- Rename terminology in donna_settings if exists in metadata (logic move)
-- We'll just update the comments and keep the JSON structure clean.

COMMENT ON COLUMN clinics.donna_executive_mode IS 'If TRUE, Donna can execute actions (WhatsApp, Promotions) autonomously (Executive Mode).';

-- =====================================================
-- GLASS BOX: EXECUTIVE LOGS
-- =====================================================
-- This table will store the "Chain of Thought" and decisions
CREATE TABLE IF NOT EXISTS donna_executive_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  
  insight_id UUID REFERENCES donna_insights(id) ON DELETE SET NULL,
  
  -- The "Chain of Thought" or reasoning
  reasoning TEXT NOT NULL,
  action_taken TEXT,
  result TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE donna_executive_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_isolation_executive_logs"
  ON donna_executive_logs FOR ALL
  USING (clinic_id::text = (auth.jwt() ->> 'clinic_id') OR auth.jwt() ->> 'role' = 'superadmin');

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_executive_logs_clinic ON donna_executive_logs(clinic_id, created_at DESC);
