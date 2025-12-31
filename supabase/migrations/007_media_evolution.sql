-- =====================================================
-- MEDIA EVOLUTION: CLINICAL PHOTO MANAGEMENT
-- =====================================================

-- Clinical Media (Photos/Videos per patient)
CREATE TABLE IF NOT EXISTS clinical_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL, -- Reference to patients (FHIR)
  
  -- Media Info
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  storage_path TEXT, -- Internal bucket path
  
  -- Context
  type TEXT NOT NULL CHECK (type IN ('pre_op', 'post_op', 'follow_up', 'generic')),
  procedure_name TEXT,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  
  -- Comparison Grouping (optional)
  comparison_group_id UUID, -- To group specific before/after pairs
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinical_media_patient ON clinical_media(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_media_clinic ON clinical_media(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinical_media_type ON clinical_media(type);

-- Triggers
CREATE TRIGGER update_clinical_media_updated_at 
  BEFORE UPDATE ON clinical_media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE clinical_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_media_access" ON clinical_media
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() AND role IN ('clinic_admin', 'clinic_agent')
    )
  );

-- COMMENTS
COMMENT ON TABLE clinical_media IS 'Clinical photos and media for patient progress tracking (Before/After)';
