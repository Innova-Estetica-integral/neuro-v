-- =====================================================
-- DONNA PRIME: SOVEREIGN MEMORY & PROACTIVE INSIGHTS
-- =====================================================

-- Donna Insights: Proactive suggestions for the doctor
CREATE TABLE IF NOT EXISTS donna_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  
  -- Category: vip_celebration, retention_alert, upsell_opportunity, marketing_tip
  category TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_action TEXT, -- Internal action code
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed', 'executed')),
  
  -- Payload (Variable data like patient_id, discount_code, etc)
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_donna_insights_clinic_status ON donna_insights(clinic_id, status);

-- Marketing Grids: Donna's social media orchestration
CREATE TABLE IF NOT EXISTS marketing_grids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  
  week_start_date DATE NOT NULL,
  strategy_type TEXT, -- e.g., 'acquisition', 'retention', 'branding'
  
  -- Grid items: [{ day: 'Monday', content: '...', platform: 'Instagram' }]
  grid_content JSONB NOT NULL,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(clinic_id, week_start_date)
);

-- RLS Isolation
ALTER TABLE donna_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_grids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_isolation_donna_insights"
  ON donna_insights FOR ALL
  USING (clinic_id::text = (auth.jwt() ->> 'clinic_id') OR auth.jwt() ->> 'role' = 'superadmin');

CREATE POLICY "clinic_isolation_marketing_grids"
  ON marketing_grids FOR ALL
  USING (clinic_id::text = (auth.jwt() ->> 'clinic_id') OR auth.jwt() ->> 'role' = 'superadmin');

-- Triggers for updated_at
CREATE TRIGGER update_donna_insights_updated_at 
  BEFORE UPDATE ON donna_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_grids_updated_at 
  BEFORE UPDATE ON marketing_grids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: FIRST DONNA INSIGHTS FOR DEMO CLINIC
-- =====================================================

INSERT INTO donna_insights (clinic_id, category, priority, title, description, metadata)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'vip_celebration',
  'high',
  'Sorpresa para María García',
  'María es tu paciente con mayor LTV ($2.4M). Mañana cumple años. He preparado un kit de regalo Dermclar y un mensaje de felicitación personalizado.',
  '{"patient_id": "maria_id_placeholder", "gift_type": "Dermclar Kit"}'
) ON CONFLICT DO NOTHING;

INSERT INTO donna_insights (clinic_id, category, priority, title, description, metadata)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'marketing_tip',
  'medium',
  'Tendencia: Ácido Hialurónico',
  'He detectado un aumento del 40% en búsquedas locales de Rellenos. He organizado una grilla de Instagram enfocada en educación sobre fillers para la próxima semana.',
  '{"trend_score": 0.85, "suggested_grid_id": "grid_placeholder"}'
) ON CONFLICT DO NOTHING;
