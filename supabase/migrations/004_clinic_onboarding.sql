-- ============================================
-- CLINIC ONBOARDING: Tables & Security
-- ============================================

-- Main clinics table
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Payment credentials (encrypted)
CREATE TABLE IF NOT EXISTS public.payment_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('mercadopago', 'transbank')),
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  
  -- Encrypted credentials (will be encrypted with pgsodium)
  access_token_encrypted BYTEA,
  public_key TEXT,
  commerce_code TEXT,
  api_key_encrypted BYTEA,
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  UNIQUE(clinic_id, provider, environment)
);

-- Clinic users (junction table for multi-tenant access)
CREATE TABLE IF NOT EXISTS public.clinic_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('clinic_admin', 'clinic_agent', 'receptionist')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(clinic_id, user_id)
);

-- Indexes
CREATE INDEX idx_clinics_slug ON clinics(slug);
CREATE INDEX idx_clinic_users_user_id ON clinic_users(user_id);
CREATE INDEX idx_clinic_users_clinic_id ON clinic_users(clinic_id);
CREATE INDEX idx_payment_credentials_clinic ON payment_credentials(clinic_id);

-- RLS Policies
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_users ENABLE ROW LEVEL SECURITY;

-- Clinics: Admins can see their clinics
CREATE POLICY "Users can view their clinics"
  ON clinics FOR SELECT
  USING (
    id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid()
    )
  );

-- Payment Credentials: Only admins can view
CREATE POLICY "Clinic admins can view payment credentials"
  ON payment_credentials FOR SELECT
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users
      WHERE user_id = auth.uid() 
      AND role = 'clinic_admin'
    )
  );

-- Clinic Users: Users can see their associations
CREATE POLICY "Users can view their clinic associations"
  ON clinic_users FOR SELECT
  USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_clinics_updated_at 
  BEFORE UPDATE ON clinics 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE clinics IS 'Multi-tenant clinics table';
COMMENT ON TABLE payment_credentials IS 'Encrypted payment gateway credentials per clinic';
COMMENT ON TABLE clinic_users IS 'Junction table: which users have access to which clinics';
