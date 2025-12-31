-- =====================================================
-- REFERRAL SYSTEM: MULTI-TENANT GROWTH ENGINE
-- =====================================================

-- Referral Programs (Campaign Settings)
CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('discount', 'credit', 'free_procedure', 'gift')),
  reward_value NUMERIC(12,2),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Referral Codes (Unique for each patient)
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL, -- Reference to patients (FHIR)
  
  code TEXT UNIQUE NOT NULL,
  total_uses INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(clinic_id, patient_id)
);

-- Referral Leads/Conversions
CREATE TABLE IF NOT EXISTS referral_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  referring_patient_id UUID NOT NULL, -- Who shared the code
  referred_patient_id UUID NOT NULL, -- Who used the code (new patient)
  code_id UUID NOT NULL REFERENCES referral_codes(id),
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rewarded')),
  converted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- AUTO-UPDATE TRIGGERS
-- =====================================================

CREATE TRIGGER update_referral_programs_updated_at 
  BEFORE UPDATE ON referral_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;

-- Select/Manage for clinic admins
CREATE POLICY "clinic_referral_access" ON referral_programs
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() AND role IN ('clinic_admin', 'clinic_agent')
    )
  );

CREATE POLICY "clinic_codes_access" ON referral_codes
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() AND role IN ('clinic_admin', 'clinic_agent')
    )
  );

CREATE POLICY "clinic_conversions_access" ON referral_conversions
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() AND role IN ('clinic_admin', 'clinic_agent')
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE referral_programs IS 'Settings for reward campaigns';
COMMENT ON TABLE referral_codes IS 'Unique patient-bound codes for sharing';
COMMENT ON TABLE referral_conversions IS 'Tracking of who referred whom and reward status';
