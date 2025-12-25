-- =====================================================
-- DONNA SOVEREIGNTY: BASE OF POWER
-- =====================================================

-- Add sovereign mode toggle to clinics
ALTER TABLE clinics 
  ADD COLUMN IF NOT EXISTS donna_sovereign_mode BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS donna_settings JSONB DEFAULT '{
    "allow_automated_whatsapp": false, 
    "allow_automated_promotions": false,
    "vip_ltv_threshold": 1000000
  }'::JSONB;

-- Add execution tracking to insights
ALTER TABLE donna_insights
  ADD COLUMN IF NOT EXISTS executed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS execution_log JSONB DEFAULT '[]'::JSONB;

-- Add LTV tracking to patient for Donna's prioritization
ALTER TABLE patient
  ADD COLUMN IF NOT EXISTS ltv_total NUMERIC(12, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS loyalty_tier TEXT DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum'));

-- Update updated_at for loyalty indexing
CREATE INDEX IF NOT EXISTS idx_patient_ltv ON patient(clinic_id, ltv_total DESC);

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN clinics.donna_sovereign_mode IS 'If TRUE, Donna can execute actions (WhatsApp, Promotions) without explicit approval.';
COMMENT ON COLUMN patient.ltv_total IS 'Historical Lifetime Value of the patient for Donna prioritization.';
