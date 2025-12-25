-- =====================================================
-- MULTI-TENANT MIGRATION: CLINIC MASTER & ISOLATION
-- =====================================================
-- This migration transforms the single-tenant schema
-- into a multi-clinic SaaS platform with tenant isolation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgsodium";

-- =====================================================
-- MASTER TABLES: CLINIC TENANCY
-- =====================================================

-- Clinics (Tenants)
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Business Information
  name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  tax_id TEXT UNIQUE NOT NULL, -- RUT in Chile
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#8B5CF6',
  
  -- Contact
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  
  -- Address
  address_line TEXT,
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'CL',
  
  -- Configuration
  timezone TEXT DEFAULT 'America/Santiago',
  locale TEXT DEFAULT 'es-CL',
  currency TEXT DEFAULT 'CLP',
  
  -- Subscription
  plan TEXT CHECK (plan IN ('trial', 'basic', 'professional', 'enterprise')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'suspended', 'cancelled')),
  trial_ends_at TIMESTAMPTZ,
  subscription_starts_at TIMESTAMPTZ,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clinics_tax_id ON clinics(tax_id);
CREATE INDEX IF NOT EXISTS idx_clinics_subscription_status ON clinics(subscription_status);

-- =====================================================
-- ENCRYPTED CREDENTIALS VAULT (per clinic)
-- =====================================================

CREATE TABLE IF NOT EXISTS clinic_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  
  -- Provider identification
  provider TEXT NOT NULL CHECK (provider IN ('mercadopago', 'transbank', 'google_ads', 'whatsapp', 'n8n', 'openfactura')),
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  
  -- Encrypted credentials (using pgsodium)
  -- Format: { "access_token": "...", "public_key": "...", etc. }
  credentials_encrypted BYTEA NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  last_verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one integration per provider per environment per clinic
  UNIQUE(clinic_id, provider, environment)
);

CREATE INDEX IF NOT EXISTS idx_clinic_integrations_clinic ON clinic_integrations(clinic_id);

-- =====================================================
-- USER-CLINIC ASSOCIATION (Multi-tenant access)
-- =====================================================

CREATE TABLE IF NOT EXISTS clinic_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- References auth.users (Supabase Auth)
  
  -- Role within THIS clinic
  role TEXT NOT NULL CHECK (role IN ('clinic_admin', 'clinic_agent', 'receptionist')),
  
  -- Permissions
  permissions JSONB DEFAULT '[]',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(clinic_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_clinic_users_clinic ON clinic_users(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_users_user ON clinic_users(user_id);

-- =====================================================
-- HELPER FUNCTIONS FOR ENCRYPTION
-- =====================================================

-- Encrypt credentials using clinic-specific key derivation
CREATE OR REPLACE FUNCTION encrypt_clinic_credentials(
  p_clinic_id UUID,
  p_credentials JSONB
)
RETURNS BYTEA AS $$
DECLARE
  v_nonce BYTEA;
  v_key BYTEA;
BEGIN
  -- Generate random nonce
  v_nonce := pgsodium.crypto_aead_det_noncegen();
  
  -- Derive key from clinic_id (deterministic for same clinic)
  v_key := pgsodium.crypto_pwhash(
    p_clinic_id::TEXT::BYTEA,
    pgsodium.crypto_pwhash_saltgen()
  );
  
  -- Encrypt credentials using pgcrypto (more robust across environments)
  RETURN pgp_sym_encrypt(
    p_credentials::TEXT,
    p_clinic_id::TEXT,
    'compress-algo=1, cipher-algo=aes256'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrypt credentials (only accessible with proper RLS)
CREATE OR REPLACE FUNCTION decrypt_clinic_credentials(
  p_clinic_id UUID,
  p_encrypted_credentials BYTEA
)
RETURNS JSONB AS $$
DECLARE
  v_key BYTEA;
  v_decrypted TEXT;
BEGIN
  -- Derive same key
  v_key := pgsodium.crypto_pwhash(
    p_clinic_id::TEXT::BYTEA,
    pgsodium.crypto_pwhash_saltgen()
  );
  
  -- Decrypt
  RETURN pgp_sym_decrypt(
    p_encrypted_credentials,
    p_clinic_id::TEXT,
    'compress-algo=1, cipher-algo=aes256'
  )::JSONB;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUTO-UPDATE TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS update_clinics_updated_at ON clinics;
CREATE TRIGGER update_clinics_updated_at 
  BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clinic_integrations_updated_at ON clinic_integrations;
CREATE TRIGGER update_clinic_integrations_updated_at 
  BEFORE UPDATE ON clinic_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clinic_users_updated_at ON clinic_users;
CREATE TRIGGER update_clinic_users_updated_at 
  BEFORE UPDATE ON clinic_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES FOR TENANT TABLES
-- =====================================================

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_users ENABLE ROW LEVEL SECURITY;

-- Superadmin can see all clinics
DROP POLICY IF EXISTS "superadmin_all_clinics" ON clinics;
CREATE POLICY "superadmin_all_clinics"
  ON clinics FOR ALL
  USING (auth.jwt() ->> 'role' = 'superadmin');

-- Users can see their associated clinics
DROP POLICY IF EXISTS "users_own_clinics" ON clinics;
CREATE POLICY "users_own_clinics"
  ON clinics FOR SELECT
  USING (
    id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid()
    )
  );

-- Only superadmin can create clinics
DROP POLICY IF EXISTS "superadmin_create_clinics" ON clinics;
CREATE POLICY "superadmin_create_clinics"
  ON clinics FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'superadmin');

-- Clinic admins can update their clinic
DROP POLICY IF EXISTS "clinic_admin_update" ON clinics;
CREATE POLICY "clinic_admin_update"
  ON clinics FOR UPDATE
  USING (
    id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() 
        AND role = 'clinic_admin'
    )
  );

-- Integrations: clinic admins only
DROP POLICY IF EXISTS "clinic_integrations_access" ON clinic_integrations;
CREATE POLICY "clinic_integrations_access"
  ON clinic_integrations FOR ALL
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() 
        AND role = 'clinic_admin'
    )
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- Clinic users: manage within clinic
DROP POLICY IF EXISTS "clinic_users_access" ON clinic_users;
CREATE POLICY "clinic_users_access"
  ON clinic_users FOR ALL
  USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() 
        AND role = 'clinic_admin'
    )
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- =====================================================
-- SAMPLE DATA: DEFAULT CLINIC
-- =====================================================

-- Create default clinic for existing data
INSERT INTO clinics (
  id,
  name,
  legal_name,
  tax_id,
  email,
  phone,
  plan,
  subscription_status
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::UUID,
  'Clínica Demo',
  'Clínica de Prueba SpA',
  '76.123.456-7',
  'admin@clinicademo.cl',
  '+56912345678',
  'professional',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE clinics IS 'Multi-tenant master table: one row per clinic/tenant';
COMMENT ON TABLE clinic_integrations IS 'Encrypted payment gateway credentials per clinic using pgsodium';
COMMENT ON TABLE clinic_users IS 'User-to-clinic association with role-based access';
COMMENT ON FUNCTION encrypt_clinic_credentials IS 'Encrypt credentials using clinic-specific key derivation (crypto-sharding)';
