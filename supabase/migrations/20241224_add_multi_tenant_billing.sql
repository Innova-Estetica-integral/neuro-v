-- 1. Ampliar proveedores permitidos en integraciones
ALTER TABLE public.clinic_integrations 
DROP CONSTRAINT IF EXISTS clinic_integrations_provider_check;

ALTER TABLE public.clinic_integrations 
ADD CONSTRAINT clinic_integrations_provider_check 
CHECK (provider IN ('mercadopago', 'transbank', 'google_ads', 'whatsapp', 'n8n', 'openfactura'));

-- 2. Tabla de registros de boletas (DTE) con aislamiento multi-tenant
CREATE TABLE IF NOT EXISTS public.billing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    payment_id UUID, -- Referencia al pago que originó la boleta
    
    -- Datos del receptor (paciente)
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    
    -- Datos del DTE
    total_amount INTEGER NOT NULL,
    dte_type INTEGER NOT NULL DEFAULT 39, -- Boleta Electrónica
    dte_folio INTEGER,
    dte_pdf_url TEXT,
    
    -- Trazabilidad
    status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
    error_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;

-- 4. Política de aislamiento: Cada clínica solo ve sus propias boletas
CREATE POLICY clinic_isolation_billing ON public.billing_records
    FOR ALL TO authenticated
    USING (clinic_id = (current_setting('app.id'))::UUID);

COMMENT ON TABLE public.billing_records IS 'Registro de boletas electrónicas emitidas por clínica';
