-- =====================================================
-- DEMO ENVIRONMENT: CLÍNICA ALPHA SETUP
-- =====================================================
-- Creates demo clinic with sandbox credentials and seed data

-- Create Clínica Alpha (Demo)
INSERT INTO clinics (
  id,
  name,
  legal_name,
  tax_id,
  email,
  phone,
  website,
  address_line,
  city,
  region,
  country,
  plan,
  subscription_status,
  is_active,
  settings
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID,
  'Clínica Alpha (Demo)',
  'Clínica Estética Alpha SpA',
  '76.543.210-9',
  'demo@clinica-alpha.cl',
  '+56988888888',
  'https://clinica-alpha-demo.cl',
  'Av. Providencia 1234',
  'Santiago',
  'Región Metropolitana',
  'CL',
  'professional',
  'active',
  TRUE,
  '{
    "demo_mode": true,
    "allow_sandbox_payments": true,
    "theme": {
      "primary_color": "#3B82F6",
      "secondary_color": "#8B5CF6",
      "glassmorphism": true
    }
  }'::JSONB
) ON CONFLICT (id) DO NOTHING;

-- Create demo payment integrations (Sandbox)
-- Mercado Pago Sandbox
INSERT INTO clinic_integrations (
  clinic_id,
  provider,
  environment,
  credentials_encrypted,
  is_active
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID,
  'mercadopago',
  'sandbox',
  pgp_sym_encrypt(
    '{"access_token": "TEST-APP_USR-sandbox-key", "public_key": "TEST-APP_USR-sandbox-public"}',
    'a1111111-1111-1111-1111-111111111111',
    'compress-algo=1, cipher-algo=aes256'
  ),
  TRUE
) ON CONFLICT (clinic_id, provider, environment) DO NOTHING;

-- Transbank Sandbox
INSERT INTO clinic_integrations (
  clinic_id,
  provider,
  environment,
  credentials_encrypted,
  is_active
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID,
  'transbank',
  'sandbox',
  pgp_sym_encrypt(
    '{"commerce_code": "597055555532", "api_key": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"}',
    'a1111111-1111-1111-1111-111111111111',
    'compress-algo=1, cipher-algo=aes256'
  ),
  TRUE
) ON CONFLICT (clinic_id, provider, environment) DO NOTHING;

-- =====================================================
-- SEED DATA: 3 REPRESENTATIVE LEADS
-- =====================================================

-- Lead 1: María García (Impulsive)
INSERT INTO patient (
  clinic_id, identifier_value, name_family, name_given, name_text,
  telecom_email, telecom_phone, telecom_whatsapp, birth_date, gender,
  psych_profile, scarcity_level, bant_status, bant_budget_clp, bant_authority,
  bant_need_score, bant_timeline_days, source, gclid, utm_source,
  utm_medium, utm_campaign, first_visit_at, last_interaction_at, total_sessions,
  is_abandoned, active
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID, '15.234.567-8', 'García', ARRAY['María', 'Isabel'], 'María Isabel García',
  'maria.garcia@demo.cl', '+56987654321', '+56987654321', '1990-05-15', 'female',
  'impulsive', 85, 'qualified', 60000, TRUE,
  90, 7, 'google', 'Gj0123456789ABCDEF', 'google',
  'cpc', 'botox-promo-q4', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '5 minutes', 3,
  TRUE, TRUE
) ON CONFLICT (telecom_email) DO NOTHING;

-- Lead 2: Juan López (Analytic)
INSERT INTO patient (
  clinic_id, identifier_value, name_family, name_given, name_text,
  telecom_email, telecom_phone, telecom_whatsapp, birth_date, gender,
  psych_profile, scarcity_level, bant_status, bant_budget_clp, bant_authority,
  bant_need_score, bant_timeline_days, source, gclid, utm_source,
  utm_medium, utm_campaign, first_visit_at, last_interaction_at, total_sessions,
  is_abandoned, active
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID, '16.345.678-9', 'López', ARRAY['Juan', 'Carlos'], 'Juan Carlos López',
  'juan.lopez@demo.cl', '+56976543210', '+56976543210', '1985-08-22', 'male',
  'analytic', 30, 'qualified', 150000, TRUE,
  85, 30, 'google', 'Gj9876543210ZYXWVU', 'google',
  'cpc', 'filler-awareness', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '15 minutes', 5,
  FALSE, TRUE
) ON CONFLICT (telecom_email) DO NOTHING;

-- Lead 3: Ana Rodríguez (Price Sensitive)
INSERT INTO patient (
  clinic_id, identifier_value, name_family, name_given, name_text,
  telecom_email, telecom_phone, telecom_whatsapp, birth_date, gender,
  psych_profile, scarcity_level, bant_status, bant_budget_clp, bant_authority,
  bant_need_score, bant_timeline_days, source, gclid, utm_source,
  utm_medium, utm_campaign, first_visit_at, last_interaction_at, total_sessions,
  is_abandoned, active
) VALUES (
  'a1111111-1111-1111-1111-111111111111'::UUID, '17.456.789-0', 'Rodríguez', ARRAY['Ana', 'María'], 'Ana María Rodríguez',
  'ana.rodriguez@demo.cl', '+56965432109', '+56965432109', '1992-03-10', 'female',
  'price_sensitive', 65, 'qualified', 35000, FALSE,
  70, 14, 'facebook', NULL, 'facebook',
  'paid_social', 'promo-20off', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '10 minutes', 2,
  TRUE, TRUE
) ON CONFLICT (telecom_email) DO NOTHING;

-- =====================================================
-- DEMO APPOINTMENTS (Pending payment to test flow)
-- =====================================================

-- María's abandoned cart (Botox)
INSERT INTO appointment (
  clinic_id,
  participant_patient_id,
  service_type_code,
  service_type_display,
  service_category,
  start_datetime,
  end_datetime,
  service_price_clp,
  discount_percentage,
  payment_status,
  is_flash_offer,
  status,
  notes
) SELECT
  'a1111111-1111-1111-1111-111111111111'::UUID,
  id,
  'botox',
  'Botulinum Toxin Type A - Zonas Múltiples',
  'aesthetic',
  NOW() + INTERVAL '2 days 10:00',
  NOW() + INTERVAL '2 days 11:00',
  60000,
  0,
  'pending',
  FALSE,
  'proposed',
  'Demo appointment - abandoned cart for pursuit testing'
FROM patient
WHERE telecom_email = 'maria.garcia@demo.cl'
ON CONFLICT DO NOTHING;

-- Juan's scheduled consultation (Filler)
INSERT INTO appointment (
  clinic_id,
  participant_patient_id,
  service_type_code,
  service_type_display,
  service_category,
  start_datetime,
  end_datetime,
  service_price_clp,
  discount_percentage,
  payment_status,
  status,
  notes
) SELECT
  'a1111111-1111-1111-1111-111111111111'::UUID,
  id,
  'filler',
  'Dermal Filler - Ácido Hialurónico',
  'aesthetic',
  NOW() + INTERVAL '5 days 15:00',
  NOW() + INTERVAL '5 days 16:30',
  150000,
  0,
  'pending',
  'proposed',
  'Demo appointment - analytic profile'
FROM patient
WHERE telecom_email = 'juan.lopez@demo.cl'
ON CONFLICT DO NOTHING;

-- Ana's flash offer (20% OFF Peeling)
INSERT INTO appointment (
  clinic_id,
  participant_patient_id,
  service_type_code,
  service_type_display,
  service_category,
  start_datetime,
  end_datetime,
  service_price_clp,
  discount_percentage,
  payment_status,
  is_flash_offer,
  flash_offer_expires_at,
  status,
  notes
) SELECT
  'a1111111-1111-1111-1111-111111111111'::UUID,
  id,
  'peeling',
  'Peeling Químico Facial',
  'aesthetic',
  NOW() + INTERVAL '1 day 12:00',
  NOW() + INTERVAL '1 day 13:00',
  45000,
  20,
  'pending',
  TRUE,
  NOW() + INTERVAL '12 hours',
  'proposed',
  'Demo appointment - flash offer for price_sensitive'
FROM patient
WHERE telecom_email = 'ana.rodriguez@demo.cl'
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE clinics IS 'Multi-tenant master table with Clínica Alpha demo environment';
COMMENT ON COLUMN clinics.settings IS 'Clinic-specific configuration including demo_mode flag and theme settings';
