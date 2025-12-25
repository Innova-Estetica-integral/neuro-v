-- =====================================================
-- MULTI-TENANT MIGRATION: ADD CLINIC_ID TO ALL FHIR TABLES
-- =====================================================
-- This migration adds tenant isolation to existing FHIR schema

-- =====================================================
-- ALTER EXISTING FHIR TABLES: ADD CLINIC_ID
-- =====================================================

-- Patient table
ALTER TABLE patient 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

-- Set default clinic for existing records
UPDATE patient SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

-- Make clinic_id required
ALTER TABLE patient ALTER COLUMN clinic_id SET NOT NULL;

-- Create composite index for tenant queries
CREATE INDEX IF NOT EXISTS idx_patient_clinic_created ON patient(clinic_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patient_clinic_email ON patient(clinic_id, telecom_email);

-- =====================================================

-- Appointment table
ALTER TABLE appointment 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE appointment SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE appointment ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_appointment_clinic_start ON appointment(clinic_id, start_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_clinic_status ON appointment(clinic_id, status);
CREATE INDEX IF NOT EXISTS idx_appointment_clinic_payment ON appointment(clinic_id, payment_status);

-- =====================================================

-- Consent table
ALTER TABLE consent 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE consent SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE consent ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_consent_clinic_patient ON consent(clinic_id, patient_id);

-- =====================================================

-- Audit Event table
ALTER TABLE audit_event 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE audit_event SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE audit_event ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_clinic_recorded ON audit_event(clinic_id, recorded_at DESC);

-- =====================================================

-- Service Request table
ALTER TABLE service_request 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE service_request SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE service_request ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_service_request_clinic ON service_request(clinic_id, created_at DESC);

-- =====================================================

-- Pursuit Campaign table
ALTER TABLE pursuit_campaign 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE pursuit_campaign SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE pursuit_campaign ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pursuit_clinic_type ON pursuit_campaign(clinic_id, campaign_type);

-- =====================================================

-- Retention Schedule table
ALTER TABLE retention_schedule 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE retention_schedule SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE retention_schedule ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_retention_clinic_renewal ON retention_schedule(clinic_id, next_renewal_date) 
WHERE status = 'active';

-- =====================================================

-- LTV Prediction table
ALTER TABLE ltv_prediction 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE ltv_prediction SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE ltv_prediction ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_ltv_clinic_patient ON ltv_prediction(clinic_id, patient_id);

-- =====================================================

-- Behavior Session table
ALTER TABLE behavior_session 
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE;

UPDATE behavior_session SET clinic_id = 'a0000000-0000-0000-0000-000000000001'::UUID 
WHERE clinic_id IS NULL;

ALTER TABLE behavior_session ALTER COLUMN clinic_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_behavior_clinic_started ON behavior_session(clinic_id, started_at DESC);

-- =====================================================
-- UPDATE RLS POLICIES: ADD CLINIC_ID FILTERING
-- =====================================================

-- DROP OLD POLICIES
DROP POLICY IF EXISTS "Patients can view own data" ON patient;
DROP POLICY IF EXISTS "Admins can view all patients" ON patient;
DROP POLICY IF EXISTS "Admins can insert patients" ON patient;
DROP POLICY IF EXISTS "Admins can update patients" ON patient;

-- PATIENT: Multi-tenant RLS
DROP POLICY IF EXISTS "clinic_isolation_patient_select" ON patient;
CREATE POLICY "clinic_isolation_patient_select"
  ON patient FOR SELECT
  USING (
    -- Own data
    auth.uid()::text = id::text
    OR
    -- Clinic team members
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR
    -- Superadmin
    auth.jwt() ->> 'role' = 'superadmin'
  );

DROP POLICY IF EXISTS "clinic_isolation_patient_insert" ON patient;
CREATE POLICY "clinic_isolation_patient_insert"
  ON patient FOR INSERT
  WITH CHECK (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

DROP POLICY IF EXISTS "clinic_isolation_patient_update" ON patient;
CREATE POLICY "clinic_isolation_patient_update"
  ON patient FOR UPDATE
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- PREVENT DELETE (Decreto 41 - Append-Only)
DROP POLICY IF EXISTS "no_delete_patient" ON patient;
CREATE POLICY "no_delete_patient"
  ON patient FOR DELETE
  USING (false);

-- =====================================================

-- APPOINTMENT: Multi-tenant RLS
DROP POLICY IF EXISTS "Patients can view own appointments" ON appointment;
DROP POLICY IF EXISTS "Only admins can create appointments" ON appointment;
DROP POLICY IF EXISTS "Only admins can update appointments" ON appointment;

DROP POLICY IF EXISTS "clinic_isolation_appointment" ON appointment;
CREATE POLICY "clinic_isolation_appointment"
  ON appointment FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- =====================================================

-- CONSENT: Multi-tenant RLS
DROP POLICY IF EXISTS "Patients can view own consents" ON consent;
DROP POLICY IF EXISTS "Patients can create own consents" ON consent;

DROP POLICY IF EXISTS "clinic_isolation_consent" ON consent;
CREATE POLICY "clinic_isolation_consent"
  ON consent FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- =====================================================

-- AUDIT EVENT: Multi-tenant RLS (Admin only)
DROP POLICY IF EXISTS "Only admins can view audit logs" ON audit_event;

DROP POLICY IF EXISTS "clinic_isolation_audit" ON audit_event;
CREATE POLICY "clinic_isolation_audit"
  ON audit_event FOR SELECT
  USING (
    (
      clinic_id::text = (auth.jwt() ->> 'clinic_id')
      AND auth.jwt() ->> 'role' IN ('clinic_admin', 'superadmin')
    )
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- =====================================================

-- Apply clinic isolation to all business tables
DROP POLICY IF EXISTS "clinic_isolation_service_request" ON service_request;
CREATE POLICY "clinic_isolation_service_request"
  ON service_request FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

DROP POLICY IF EXISTS "clinic_isolation_pursuit" ON pursuit_campaign;
CREATE POLICY "clinic_isolation_pursuit"
  ON pursuit_campaign FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

DROP POLICY IF EXISTS "clinic_isolation_retention" ON retention_schedule;
CREATE POLICY "clinic_isolation_retention"
  ON retention_schedule FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

DROP POLICY IF EXISTS "clinic_isolation_ltv" ON ltv_prediction;
CREATE POLICY "clinic_isolation_ltv"
  ON ltv_prediction FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

DROP POLICY IF EXISTS "clinic_isolation_behavior" ON behavior_session;
CREATE POLICY "clinic_isolation_behavior"
  ON behavior_session FOR ALL
  USING (
    clinic_id::text = (auth.jwt() ->> 'clinic_id')
    OR auth.jwt() ->> 'role' = 'superadmin'
  );

-- =====================================================
-- HELPER FUNCTION: GET CURRENT CLINIC ID FROM JWT
-- =====================================================

CREATE OR REPLACE FUNCTION get_current_clinic_id()
RETURNS UUID AS $$
BEGIN
  RETURN (auth.jwt() ->> 'clinic_id')::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON FUNCTION get_current_clinic_id IS 'Extract clinic_id from JWT custom claims for tenant isolation';
