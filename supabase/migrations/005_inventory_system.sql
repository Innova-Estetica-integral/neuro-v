-- =====================================================
-- INVENTORY SYSTEM: MULTI-TENANT ASSETS & STOCK
-- =====================================================

-- Inventory Items (Products/Supplies)
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  
  -- Item Information
  sku TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., 'Injectables', 'Consumables', 'Skincare'
  unit TEXT DEFAULT 'units', -- e.g., 'vial', 'box', 'piece'
  
  -- Stock Management
  current_stock NUMERIC(12,2) DEFAULT 0,
  min_stock_alert NUMERIC(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Pricing (optional for internal assets)
  cost_price NUMERIC(12,2),
  sale_price NUMERIC(12,2),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_clinic ON inventory_items(clinic_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);

-- Inventory Transactions (Stock History)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  
  -- Transaction Details
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'reservation')),
  quantity NUMERIC(12,2) NOT NULL,
  reason TEXT, -- e.g., 'Purchase Order', 'Procedure Usage', 'Expiry'
  user_id UUID, -- Reference to clinic_users
  
  -- Related Entity (optional)
  procedure_id UUID, -- If linked to a medical procedure
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_tx_clinic ON inventory_transactions(clinic_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_item ON inventory_transactions(item_id);

-- =====================================================
-- AUTO-UPDATE TRIGGERS
-- =====================================================

CREATE TRIGGER update_inventory_items_updated_at 
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update current_stock in inventory_items
CREATE OR REPLACE FUNCTION update_item_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE inventory_items 
    SET current_stock = CASE 
      WHEN NEW.type IN ('in', 'adjustment') THEN current_stock + NEW.quantity
      WHEN NEW.type IN ('out', 'reservation') THEN current_stock - NEW.quantity
      ELSE current_stock
    END,
    updated_at = NOW()
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_inventory_transformation
  AFTER INSERT ON inventory_transactions
  FOR EACH ROW EXECUTE FUNCTION update_item_stock();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Select: all clinic users
CREATE POLICY "clinic_users_view_inventory" ON inventory_items
  FOR SELECT USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users WHERE user_id = auth.uid()
    )
  );

-- Manage: clinic_admin and clinic_agent
CREATE POLICY "authorized_manage_inventory" ON inventory_items
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() AND role IN ('clinic_admin', 'clinic_agent')
    )
  );

-- Transactions: clinic_admin and clinic_agent
CREATE POLICY "authorized_manage_transactions" ON inventory_transactions
  FOR ALL USING (
    clinic_id IN (
      SELECT clinic_id FROM clinic_users 
      WHERE user_id = auth.uid() AND role IN ('clinic_admin', 'clinic_agent')
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE inventory_items IS 'Products and supplies tracked per clinic';
COMMENT ON TABLE inventory_transactions IS 'Historical log of stock movements for auditing';
