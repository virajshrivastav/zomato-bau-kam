# 🏗️ Sprint 0: Foundation Setup

**Duration:** 2-3 days  
**Goal:** Backend infrastructure ready for development  
**Prerequisites:** None (start here!)

---

## 📋 Overview

This sprint sets up the foundational infrastructure:
1. ✅ Supabase project created
2. ✅ Environment variables configured
3. ✅ Database schema created (4 tables)
4. ✅ Sample data loaded
5. ✅ KAM user accounts created
6. ✅ Row Level Security (RLS) policies configured

**End State:** You can query restaurants from the database in your browser console.

---

## 🎯 Task Checklist

- [ ] Task 1: Create Supabase Project (30 min)
- [ ] Task 2: Configure Environment Variables (15 min)
- [ ] Task 3: Create Database Schema (1 hour)
- [ ] Task 4: Load Sample Data (1 hour)
- [ ] Task 5: Create KAM User Accounts (30 min)
- [ ] Task 6: Set Up RLS Policies (1 hour)
- [ ] Task 7: Verify Setup (30 min)

**Total Time:** ~5 hours

---

## 📝 Task 1: Create Supabase Project (30 min)

### Step 1.1: Sign Up for Supabase

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email

### Step 1.2: Create New Project

1. Click "New Project"
2. Fill in details:
   - **Organization:** Create new or select existing
   - **Project Name:** `zomato-drive-dashboard`
   - **Database Password:** Generate strong password (SAVE THIS!)
   - **Region:** `Mumbai (ap-south-1)` (closest to users)
   - **Pricing Plan:** Free tier (sufficient for MVP)

3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### Step 1.3: Save Project Credentials

Once project is ready:

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values (you'll need them next):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon/Public Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**✅ Checkpoint:** You have a Supabase project with URL and API key.

---

## 📝 Task 2: Configure Environment Variables (15 min)

### Step 2.1: Create `.env.local` File

In your project root (`d:\Projects\WARP\zomato-loveable`), create `.env.local`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace** `xxxxx` with your actual values from Task 1.3.

### Step 2.2: Verify Supabase Client

Check that `src/lib/supabase.ts` exists and looks like this:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 2.3: Test Connection

1. Start dev server: `npm run dev`
2. Open browser console (F12)
3. Run:
   ```javascript
   import { supabase } from './src/lib/supabase'
   const { data, error } = await supabase.from('restaurants').select('*')
   console.log(data, error)
   ```

**Expected:** Error "relation 'restaurants' does not exist" (table not created yet - that's next!)

**✅ Checkpoint:** Environment variables configured, Supabase client connects.

---

## 📝 Task 3: Create Database Schema (1 hour)

### Step 3.1: Open SQL Editor

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 3.2: Create Tables

Copy and paste this SQL (run all at once):

```sql
-- Table 1: restaurants (Master Data)
CREATE TABLE restaurants (
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
CREATE TABLE drives (
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
CREATE TABLE drive_data (
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
CREATE TABLE conversion_tracking (
  id SERIAL PRIMARY KEY,
  res_id TEXT REFERENCES restaurants(res_id) ON DELETE CASCADE,
  drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
  kam_email TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'approached' or 'converted'
  action_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_restaurants_kam_email ON restaurants(kam_email);
CREATE INDEX idx_drive_data_res_id ON drive_data(res_id);
CREATE INDEX idx_drive_data_drive_id ON drive_data(drive_id);
CREATE INDEX idx_conversion_tracking_kam_email ON conversion_tracking(kam_email);
CREATE INDEX idx_conversion_tracking_action_date ON conversion_tracking(action_date);
```

### Step 3.3: Verify Tables Created

1. Click **Table Editor** (left sidebar)
2. You should see 4 tables:
   - `restaurants`
   - `drives`
   - `drive_data`
   - `conversion_tracking`

**✅ Checkpoint:** 4 tables created with proper schema.

---

## 📝 Task 4: Load Sample Data (1 hour)

### Step 4.1: Insert Sample Restaurants

Go to **SQL Editor** → **New Query**, run:

```sql
-- Insert 10 sample restaurants from sample-data.csv
INSERT INTO restaurants (res_id, res_name, kam_name, kam_email, tl_email, cuisine, locality, concat_field, account_type, sept_ov) VALUES
  ('R001', 'Viraj Restaurant', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'manager1@zomato.com', 'North Indian', 'Koregaon Park', 'Koregaon Park - North Indian', 'Premium', 75000),
  ('R002', 'Snehil Restaurant', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'manager1@zomato.com', 'Chinese', 'Viman Nagar', 'Viman Nagar - Chinese', 'Standard', 45000),
  ('R003', 'Rakesh Restaurant', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'manager1@zomato.com', 'South Indian', 'Kalyani Nagar', 'Kalyani Nagar - South Indian', 'Premium', 62000),
  ('R004', 'Priya Kitchen', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'manager1@zomato.com', 'Multi-Cuisine', 'Baner', 'Baner - Multi-Cuisine', 'Standard', 38000),
  ('R005', 'Mumbai Spice', 'Shrawani Patil', 'shrawani.patil@zomato.com', 'manager2@zomato.com', 'North Indian', 'Hinjewadi', 'Hinjewadi - North Indian', 'Premium', 55000),
  ('R006', 'Tandoor Express', 'Shrawani Patil', 'shrawani.patil@zomato.com', 'manager2@zomato.com', 'Punjabi', 'Wakad', 'Wakad - Punjabi', 'Standard', 42000),
  ('R007', 'South Flavors', 'Rutuja Deshmukh', 'rutuja.deshmukh@zomato.com', 'manager2@zomato.com', 'South Indian', 'Kothrud', 'Kothrud - South Indian', 'Premium', 68000),
  ('R008', 'Biryani House', 'Rutuja Deshmukh', 'rutuja.deshmukh@zomato.com', 'manager2@zomato.com', 'Biryani', 'Shivaji Nagar', 'Shivaji Nagar - Biryani', 'Premium', 72000),
  ('R009', 'Cafe Delight', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'manager1@zomato.com', 'Cafe', 'Koregaon Park', 'Koregaon Park - Cafe', 'Standard', 28000),
  ('R010', 'Pizza Corner', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'manager1@zomato.com', 'Italian', 'Viman Nagar', 'Viman Nagar - Italian', 'Standard', 35000);
```

### Step 4.2: Insert Sample Drives

```sql
-- Insert 3 sample drives
INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, status) VALUES
  ('Special 35 Discount', 'Discount Drive', 'Pune', '2025-11-01', '2025-11-30', 'active'),
  ('Menu Photoshoot Drive', 'Content Drive', 'Pune', '2025-11-05', '2025-11-25', 'active'),
  ('Ad Boost Campaign', 'Marketing Drive', 'Pune', '2025-11-10', '2025-12-10', 'active');
```

### Step 4.3: Insert Drive Assignments

```sql
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
  ('R009', 1, 1, 0, 0, 'LA_BASE_005', false, false, 45),
  ('R010', 1, 1, 1, 0, 'LA_BASE_006', true, false, 60);
```

### Step 4.4: Verify Data Loaded

Run this query:

```sql
SELECT 
  r.res_name,
  r.kam_name,
  COUNT(dd.drive_id) as drive_count,
  STRING_AGG(d.drive_name, ', ') as drives
FROM restaurants r
LEFT JOIN drive_data dd ON r.res_id = dd.res_id
LEFT JOIN drives d ON dd.drive_id = d.id
GROUP BY r.res_id, r.res_name, r.kam_name
ORDER BY drive_count DESC;
```

**Expected Output:**
```
Viraj Restaurant | Shiv Kumar | 3 | Special 35, Menu Photoshoot, Ad Boost
Snehil Restaurant | Shiv Kumar | 2 | Special 35, Menu Photoshoot
...
```

**✅ Checkpoint:** 10 restaurants, 3 drives, 13 drive assignments loaded.

---

## 📝 Task 5: Create KAM User Accounts (30 min)

### Step 5.1: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (should be by default)

### Step 5.2: Create Test Users

Go to **Authentication** → **Users** → **Add User**, create 4 users:

| Email | Password | Role |
|-------|----------|------|
| shiv.kumar@zomato.com | `zomato123` | KAM |
| amdeep.singh@zomato.com | `zomato123` | KAM |
| shrawani.patil@zomato.com | `zomato123` | KAM |
| rutuja.deshmukh@zomato.com | `zomato123` | KAM |

**Note:** Use "Auto Confirm User" option (skip email verification for testing)

**✅ Checkpoint:** 4 KAM users created and can log in.

---

## 📝 Task 6: Set Up RLS Policies (1 hour)

### Step 6.1: Enable RLS on Tables

Go to **SQL Editor**, run:

```sql
-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_tracking ENABLE ROW LEVEL SECURITY;
```

### Step 6.2: Create RLS Policies

```sql
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

-- Policy 4: KAMs can track conversions for their restaurants
CREATE POLICY "KAMs track own conversions"
ON conversion_tracking FOR INSERT
WITH CHECK (kam_email = auth.jwt() ->> 'email');

CREATE POLICY "KAMs see own conversion history"
ON conversion_tracking FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

**✅ Checkpoint:** RLS policies configured - KAMs see only their data.

---

## 📝 Task 7: Verify Setup (30 min)

### Step 7.1: Test Database Query

In browser console (with dev server running):

```javascript
import { supabase } from './src/lib/supabase'

// Should return 10 restaurants (no auth yet, so RLS not enforced)
const { data, error } = await supabase.from('restaurants').select('*')
console.log('Restaurants:', data?.length) // Should be 10
```

### Step 7.2: Test Authentication

```javascript
// Login as Shiv
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'shiv.kumar@zomato.com',
  password: 'zomato123'
})
console.log('Logged in:', authData.user.email)

// Now query should return only Shiv's restaurants (3 restaurants)
const { data: shivRestaurants } = await supabase.from('restaurants').select('*')
console.log('Shiv restaurants:', shivRestaurants?.length) // Should be 3
```

### Step 7.3: Test Multi-Drive Query

```javascript
// Get restaurants with their drives
const { data } = await supabase
  .from('restaurants')
  .select(`
    *,
    drive_data (
      *,
      drives (*)
    )
  `)

console.log('Multi-drive data:', data)
// Should show Viraj Restaurant in 3 drives
```

**✅ Checkpoint:** All queries work, RLS enforces data filtering.

---

## ✅ Sprint 0 Complete!

### What You've Accomplished

- ✅ Supabase project created and configured
- ✅ Environment variables set up
- ✅ 4 database tables created
- ✅ 10 restaurants, 3 drives, 13 assignments loaded
- ✅ 4 KAM user accounts created
- ✅ RLS policies protecting data
- ✅ Verified everything works

### Verification Checklist

- [ ] Can log into Supabase dashboard
- [ ] Can see 4 tables in Table Editor
- [ ] Can query restaurants in SQL Editor
- [ ] Can log in as shiv.kumar@zomato.com
- [ ] RLS filters data correctly (Shiv sees only his 3 restaurants)

### Next Steps

**Ready for Sprint 1?** See [SPRINT-1-CORE.md](SPRINT-1-CORE.md) to:
- Implement authentication in React app
- Create API hooks for data fetching
- Update KAM Hub with real data
- Implement conversion tracking buttons

---

**Estimated Time:** 5 hours  
**Actual Time:** _____ hours  
**Blockers:** _____  
**Notes:** _____

