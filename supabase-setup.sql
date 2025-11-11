-- ============================================
-- Zomato Drive Dashboard - Database Setup
-- ============================================
-- Run this entire script in Supabase SQL Editor
-- Estimated time: 2-3 minutes
-- ============================================

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- Table 1: restaurants (Master Data)
CREATE TABLE IF NOT EXISTS restaurants (
  res_id TEXT PRIMARY KEY,
  res_name TEXT NOT NULL,
  kam_name TEXT,
  kam_email TEXT,
  tl_email TEXT,
  cuisine TEXT,
  locality TEXT,
  concat_field TEXT,
  account_type TEXT,
  sept_ov INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: drives (Campaign Data)
CREATE TABLE IF NOT EXISTS drives (
  id SERIAL PRIMARY KEY,
  drive_name TEXT NOT NULL,
  drive_type TEXT,
  city TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: drive_data (Restaurant-Drive Assignments)
CREATE TABLE IF NOT EXISTS drive_data (
  id SERIAL PRIMARY KEY,
  res_id TEXT REFERENCES restaurants(res_id) ON DELETE CASCADE,
  drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
  um INTEGER DEFAULT 0,
  mm INTEGER DEFAULT 0,
  la INTEGER DEFAULT 0,
  la_base_code_suggested TEXT,
  la_step1 TEXT,
  la_step2 TEXT,
  la_step3 TEXT,
  mm_base_code_suggested TEXT,
  um_base_code_suggested TEXT,
  la_active_promos TEXT,
  mm_active_promos TEXT,
  um_active_promos TEXT,
  approached BOOLEAN DEFAULT FALSE,
  converted_stepper BOOLEAN DEFAULT FALSE,
  priority_score INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(res_id, drive_id)
);

-- Table 4: conversion_tracking (Audit Trail)
CREATE TABLE IF NOT EXISTS conversion_tracking (
  id SERIAL PRIMARY KEY,
  res_id TEXT REFERENCES restaurants(res_id) ON DELETE CASCADE,
  drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
  kam_email TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'approached' or 'converted'
  action_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_restaurants_kam_email ON restaurants(kam_email);
CREATE INDEX IF NOT EXISTS idx_drive_data_res_id ON drive_data(res_id);
CREATE INDEX IF NOT EXISTS idx_drive_data_drive_id ON drive_data(drive_id);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_kam_email ON conversion_tracking(kam_email);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_action_date ON conversion_tracking(action_date);

-- ============================================
-- STEP 3: INSERT SAMPLE DATA
-- ============================================

-- Insert 10 sample restaurants
INSERT INTO restaurants (res_id, res_name, kam_name, kam_email, tl_email, cuisine, locality, concat_field, account_type, sept_ov) VALUES
  ('R001', 'Viraj Restaurant', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'manager1@zomato.com', 'North Indian', 'Koregaon Park', 'Koregaon Park - North Indian', 'Premium', 75000),
  ('R002', 'Snehil Restaurant', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'manager1@zomato.com', 'Chinese', 'Viman Nagar', 'Viman Nagar - Chinese', 'Standard', 45000),
  ('R003', 'Rakesh Restaurant', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'manager1@zomato.com', 'South Indian', 'Kalyani Nagar', 'Kalyani Nagar - South Indian', 'Premium', 62000),
  ('R004', 'Priya Kitchen', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'manager1@zomato.com', 'Multi-Cuisine', 'Baner', 'Baner - Multi-Cuisine', 'Standard', 38000),
  ('R005', 'Mumbai Spice', 'Shrawani Patil', 'shrawani.patil@zomato.com', 'manager2@zomato.com', 'North Indian', 'Hinjewadi', 'Hinjewadi - North Indian', 'Premium', 55000),
  ('R006', 'Tandoor Express', 'Shrawani Patil', 'shrawani.patil@zomato.com', 'manager2@zomato.com', 'Punjabi', 'Wakad', 'Wakad - Punjabi', 'Standard', 42000),
  ('R007', 'South Flavors', 'Rutuja Deshmukh', 'rutuja.deshmukh@zomato.com', 'manager2@zomato.com', 'South Indian', 'Kothrud', 'Kothrud - South Indian', 'Premium', 68000),
  ('R008', 'Biryani House', 'Rutuja Deshmukh', 'rutuja.deshmukh@zomato.com', 'manager2@zomato.com', 'Biryani', 'Shivaji Nagar', 'Shivaji Nagar - Biryani', 'Premium', 72000),
  ('239546', 'Cafe Delight', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'manager1@zomato.com', 'North Indian', 'Koregaon Park', 'Koregaon Park - North Indian', 'Standard', 28000),
  ('R010', 'Pizza Corner', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'manager1@zomato.com', 'Italian', 'Viman Nagar', 'Viman Nagar - Italian', 'Standard', 35000);

-- Insert 3 sample drives
INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, status) VALUES
  ('Special 35 Discount', 'Discount Drive', 'Pune', '2025-11-01', '2025-11-30', 'active'),
  ('Menu Photoshoot Drive', 'Content Drive', 'Pune', '2025-11-05', '2025-11-25', 'active'),
  ('Ad Boost Campaign', 'Marketing Drive', 'Pune', '2025-11-10', '2025-12-10', 'active');

-- Assign restaurants to drives (multi-drive visibility)
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, approached, converted_stepper, priority_score) VALUES
  -- Viraj Restaurant in all 3 drives
  ('R001', 1, 1, 1, 1, 'LA_BASE_001', true, true, 95),
  ('R001', 2, 1, 1, 1, NULL, false, false, 85),
  ('R001', 3, 1, 1, 1, NULL, false, false, 80),
  
  -- Snehil Restaurant in 2 drives
  ('R002', 1, 1, 1, 0, 'LA_BASE_002', true, false, 72),
  ('R002', 2, 1, 1, 0, NULL, false, false, 65),
  
  -- Other restaurants in 1 drive each
  ('R003', 1, 1, 0, 1, 'LA_BASE_003', false, false, 68),
  ('R004', 1, 1, 1, 0, 'LA_BASE_004', true, true, 80),
  ('R005', 2, 1, 1, 1, NULL, true, false, 78),
  ('R006', 2, 1, 0, 1, NULL, false, false, 55),
  ('R007', 3, 1, 1, 1, NULL, true, true, 92),
  ('R008', 3, 1, 1, 1, NULL, true, true, 88),
  ('239546', 1, 1, 1, 1, 'LA_BASE_005', false, false, 45),
  ('239546', 2, 1, 1, 0, NULL, false, false, 50),
  ('239546', 3, 1, 0, 1, NULL, false, false, 48),
  ('R010', 1, 1, 1, 0, 'LA_BASE_006', true, false, 60);

-- ============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_tracking ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================

-- Policy 1: KAMs see only their restaurants
CREATE POLICY "KAMs see own restaurants"
ON restaurants FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');

-- Policy 2: Everyone can see all drives
CREATE POLICY "Everyone can see drives"
ON drives FOR SELECT
USING (true);

-- Policy 3: KAMs see drive data for their restaurants only
CREATE POLICY "KAMs see own drive data"
ON drive_data FOR SELECT
USING (
  res_id IN (
    SELECT res_id FROM restaurants 
    WHERE kam_email = auth.jwt() ->> 'email'
  )
);

-- Policy 4: KAMs can update drive data for their restaurants
CREATE POLICY "KAMs update own drive data"
ON drive_data FOR UPDATE
USING (
  res_id IN (
    SELECT res_id FROM restaurants 
    WHERE kam_email = auth.jwt() ->> 'email'
  )
);

-- Policy 5: KAMs can track conversions for their restaurants
CREATE POLICY "KAMs track own conversions"
ON conversion_tracking FOR INSERT
WITH CHECK (kam_email = auth.jwt() ->> 'email');

-- Policy 6: KAMs see own conversion history
CREATE POLICY "KAMs see own conversion history"
ON conversion_tracking FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');

-- ============================================
-- STEP 6: VERIFICATION QUERY
-- ============================================

-- Run this to verify setup
SELECT 
  'restaurants' as table_name,
  COUNT(*) as row_count
FROM restaurants
UNION ALL
SELECT 
  'drives' as table_name,
  COUNT(*) as row_count
FROM drives
UNION ALL
SELECT 
  'drive_data' as table_name,
  COUNT(*) as row_count
FROM drive_data
ORDER BY table_name;

-- Expected output:
-- drive_data    | 13
-- drives        | 3
-- restaurants   | 10

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next: Create user accounts in Authentication > Users
-- ============================================

