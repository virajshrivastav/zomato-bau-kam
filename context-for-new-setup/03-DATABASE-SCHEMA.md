# Database Schema - Complete Reference

## Overview

**Database**: PostgreSQL (via Supabase)
**Tables**: 4 (restaurants, drives, drive_data, conversion_tracking)
**Security**: Row Level Security (RLS) enabled on all tables
**Sample Data**: 10 restaurants, 3 drives, 13 drive assignments

---

## Table 1: restaurants (Master Data)

### Purpose
Stores master restaurant data. Each restaurant has one assigned KAM.

### Schema

```sql
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
```

### Column Descriptions

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| res_id | TEXT (PK) | Unique restaurant identifier | "R001" |
| res_name | TEXT | Restaurant name | "Viraj" |
| kam_name | TEXT | Key Account Manager name | "Shiv Kumar" |
| kam_email | TEXT | KAM email (used for RLS filtering) | "shiv.kumar@zomato.com" |
| tl_email | TEXT | Team Lead email | "tl.north@zomato.com" |
| cuisine | TEXT | Cuisine type | "North Indian" |
| locality | TEXT | Restaurant location | "Connaught Place" |
| concat_field | TEXT | Combined search field | "Viraj North Indian Connaught Place" |
| account_type | TEXT | Account classification | "Premium" |
| sept_ov | INTEGER | September Order Volume (revenue) | 75000 |
| created_at | TIMESTAMPTZ | Record creation timestamp | "2025-11-10 12:00:00+00" |
| updated_at | TIMESTAMPTZ | Last update timestamp | "2025-11-10 12:00:00+00" |

### Indexes

```sql
CREATE INDEX idx_restaurants_kam_email ON restaurants(kam_email);
CREATE INDEX idx_restaurants_res_name ON restaurants(res_name);
CREATE INDEX idx_restaurants_locality ON restaurants(locality);
```

### RLS Policy

```sql
-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- KAMs see only their restaurants
CREATE POLICY "KAMs see own restaurants"
ON restaurants FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

### Sample Data (10 restaurants)

```sql
INSERT INTO restaurants (res_id, res_name, kam_name, kam_email, tl_email, cuisine, locality, concat_field, account_type, sept_ov) VALUES
('R001', 'Viraj', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'tl.north@zomato.com', 'North Indian', 'Connaught Place', 'Viraj North Indian Connaught Place', 'Premium', 75000),
('R002', 'Snehil', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'tl.north@zomato.com', 'Chinese', 'Karol Bagh', 'Snehil Chinese Karol Bagh', 'Standard', 45000),
('R003', 'Rakesh', 'Shiv Kumar', 'shiv.kumar@zomato.com', 'tl.north@zomato.com', 'South Indian', 'Rajouri Garden', 'Rakesh South Indian Rajouri Garden', 'Premium', 82000),
('R004', 'Priya', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'tl.south@zomato.com', 'Italian', 'Hauz Khas', 'Priya Italian Hauz Khas', 'Premium', 95000),
('R005', 'Ananya', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'tl.south@zomato.com', 'Continental', 'Saket', 'Ananya Continental Saket', 'Standard', 52000),
('R006', 'Rohan', 'Amdeep Singh', 'amdeep.singh@zomato.com', 'tl.south@zomato.com', 'Mexican', 'Greater Kailash', 'Rohan Mexican Greater Kailash', 'Premium', 68000),
('R007', 'Kavya', 'Shrawani Patil', 'shrawani.patil@zomato.com', 'tl.west@zomato.com', 'Thai', 'Janakpuri', 'Kavya Thai Janakpuri', 'Standard', 41000),
('R008', 'Arjun', 'Shrawani Patil', 'shrawani.patil@zomato.com', 'tl.west@zomato.com', 'Japanese', 'Dwarka', 'Arjun Japanese Dwarka', 'Premium', 88000),
('R009', 'Neha', 'Rutuja Deshmukh', 'rutuja.deshmukh@zomato.com', 'tl.east@zomato.com', 'Mughlai', 'Laxmi Nagar', 'Neha Mughlai Laxmi Nagar', 'Standard', 39000),
('R010', 'Siddharth', 'Rutuja Deshmukh', 'rutuja.deshmukh@zomato.com', 'tl.east@zomato.com', 'Bengali', 'Mayur Vihar', 'Siddharth Bengali Mayur Vihar', 'Premium', 71000);
```

---

## Table 2: drives (Campaign Data)

### Purpose
Stores information about marketing drives/campaigns.

### Schema

```sql
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
```

### Column Descriptions

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | SERIAL (PK) | Auto-incrementing drive ID | 1 |
| drive_name | TEXT | Drive name/code | "NCN" |
| drive_type | TEXT | Type of drive | "Discount Drive" |
| city | TEXT | Target city | "Delhi" |
| start_date | DATE | Drive start date | "2025-11-01" |
| end_date | DATE | Drive end date | "2025-11-30" |
| status | TEXT | Drive status | "active" or "completed" |
| created_at | TIMESTAMPTZ | Record creation timestamp | "2025-11-10 12:00:00+00" |

### RLS Policy

```sql
-- Enable RLS
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;

-- Everyone can see all drives
CREATE POLICY "Everyone can see drives"
ON drives FOR SELECT
USING (true);
```

### Sample Data (3 drives)

```sql
INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, status) VALUES
('NCN', 'Discount Drive', 'Delhi', '2025-11-01', '2025-11-30', 'active'),
('N2R', 'Menu Drive', 'Delhi', '2025-11-05', '2025-11-25', 'active'),
('MRP', 'Ad Drive', 'Delhi', '2025-11-10', '2025-12-10', 'active');
```

---

## Table 3: drive_data (Restaurant-Drive Assignments)

### Purpose
Links restaurants to drives and tracks conversion status. One restaurant can be in multiple drives.

### Schema

```sql
CREATE TABLE IF NOT EXISTS drive_data (
  id SERIAL PRIMARY KEY,
  res_id TEXT REFERENCES restaurants(res_id) ON DELETE CASCADE,
  drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
  um INTEGER,
  mm INTEGER,
  la INTEGER,
  la_base_code_suggested TEXT,
  mm_base_code_suggested TEXT,
  um_base_code_suggested TEXT,
  la_active_promos TEXT,
  mm_active_promos TEXT,
  um_active_promos TEXT,
  approached BOOLEAN DEFAULT FALSE,
  converted_stepper BOOLEAN DEFAULT FALSE,
  priority_score INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(res_id, drive_id)
);
```

### Column Descriptions

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | SERIAL (PK) | Auto-incrementing ID | 1 |
| res_id | TEXT (FK) | Restaurant ID | "R001" |
| drive_id | INTEGER (FK) | Drive ID | 1 |
| um | INTEGER | Upper Middle segment count | 150 |
| mm | INTEGER | Middle Middle segment count | 300 |
| la | INTEGER | Lower segment count | 200 |
| la_base_code_suggested | TEXT | Suggested promo code for LA | "LA20" |
| mm_base_code_suggested | TEXT | Suggested promo code for MM | "MM15" |
| um_base_code_suggested | TEXT | Suggested promo code for UM | "UM10" |
| la_active_promos | TEXT | Active promos for LA | "LA20, LA25" |
| mm_active_promos | TEXT | Active promos for MM | "MM15" |
| um_active_promos | TEXT | Active promos for UM | "UM10, UM12" |
| approached | BOOLEAN | Has KAM contacted restaurant? | true/false |
| converted_stepper | BOOLEAN | Has restaurant activated promo? | true/false |
| priority_score | INTEGER | Priority ranking (1-100) | 85 |
| last_updated | TIMESTAMPTZ | Last update timestamp | "2025-11-10 14:30:00+00" |
| created_at | TIMESTAMPTZ | Record creation timestamp | "2025-11-10 12:00:00+00" |

### Indexes

```sql
CREATE INDEX idx_drive_data_res_id ON drive_data(res_id);
CREATE INDEX idx_drive_data_drive_id ON drive_data(drive_id);
CREATE INDEX idx_drive_data_approached ON drive_data(approached);
CREATE INDEX idx_drive_data_converted ON drive_data(converted_stepper);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE drive_data ENABLE ROW LEVEL SECURITY;

-- KAMs see drive data for their restaurants only
CREATE POLICY "KAMs see own drive data"
ON drive_data FOR SELECT
USING (
  res_id IN (
    SELECT res_id FROM restaurants 
    WHERE kam_email = auth.jwt() ->> 'email'
  )
);

-- KAMs can update drive data for their restaurants
CREATE POLICY "KAMs update own drive data"
ON drive_data FOR UPDATE
USING (
  res_id IN (
    SELECT res_id FROM restaurants 
    WHERE kam_email = auth.jwt() ->> 'email'
  )
);
```

### Sample Data (13 assignments)

```sql
-- Viraj (R001) in all 3 drives
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R001', 1, 150, 300, 200, 'LA20', 'MM15', 'UM10', 'LA20, LA25', 'MM15', 'UM10, UM12', false, false, 85),
('R001', 2, 120, 250, 180, 'LA18', 'MM12', 'UM8', 'LA18', 'MM12', 'UM8', false, false, 78),
('R001', 3, 140, 280, 190, 'LA22', 'MM16', 'UM11', NULL, NULL, NULL, false, false, 82);

-- Snehil (R002) in NCN and N2R
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R002', 1, 100, 200, 150, 'LA20', 'MM15', 'UM10', NULL, NULL, NULL, false, false, 65),
('R002', 2, 90, 180, 140, 'LA18', 'MM12', 'UM8', 'LA18', NULL, NULL, false, false, 60);

-- Rakesh (R003) in NCN only
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R003', 1, 180, 350, 220, 'LA20', 'MM15', 'UM10', 'LA20', 'MM15', 'UM10', false, false, 90);

-- Priya (R004) in all 3 drives
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R004', 1, 200, 400, 250, 'LA20', 'MM15', 'UM10', 'LA20, LA25', 'MM15, MM18', 'UM10', false, false, 95),
('R004', 2, 180, 380, 240, 'LA18', 'MM12', 'UM8', 'LA18', 'MM12', 'UM8', false, false, 92),
('R004', 3, 190, 390, 245, 'LA22', 'MM16', 'UM11', NULL, NULL, NULL, false, false, 93);

-- Ananya (R005) in NCN and MRP
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R005', 1, 110, 220, 160, 'LA20', 'MM15', 'UM10', NULL, NULL, NULL, false, false, 70),
('R005', 3, 115, 230, 165, 'LA22', 'MM16', 'UM11', 'LA22', NULL, NULL, false, false, 72);

-- Rohan (R006) in N2R only
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R006', 2, 140, 280, 190, 'LA18', 'MM12', 'UM8', 'LA18', 'MM12', NULL, false, false, 75);

-- Kavya (R007) in NCN only
INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested, la_active_promos, mm_active_promos, um_active_promos, approached, converted_stepper, priority_score) VALUES
('R007', 1, 95, 190, 145, 'LA20', 'MM15', 'UM10', NULL, NULL, NULL, false, false, 62);
```

---

## Table 4: conversion_tracking (Audit Trail)

### Purpose
Logs all KAM actions (approached/converted) for audit and analytics.

### Schema

```sql
CREATE TABLE IF NOT EXISTS conversion_tracking (
  id SERIAL PRIMARY KEY,
  res_id TEXT REFERENCES restaurants(res_id) ON DELETE CASCADE,
  drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
  kam_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Column Descriptions

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | SERIAL (PK) | Auto-incrementing ID | 1 |
| res_id | TEXT (FK) | Restaurant ID | "R001" |
| drive_id | INTEGER (FK) | Drive ID | 1 |
| kam_email | TEXT | KAM who performed action | "shiv.kumar@zomato.com" |
| action_type | TEXT | Type of action | "approached" or "converted" |
| action_date | TIMESTAMPTZ | When action was performed | "2025-11-10 15:45:00+00" |
| notes | TEXT | Optional notes | "Called at 3pm, agreed to activate" |
| created_at | TIMESTAMPTZ | Record creation timestamp | "2025-11-10 15:45:00+00" |

### Indexes

```sql
CREATE INDEX idx_conversion_tracking_kam_email ON conversion_tracking(kam_email);
CREATE INDEX idx_conversion_tracking_res_id ON conversion_tracking(res_id);
CREATE INDEX idx_conversion_tracking_action_date ON conversion_tracking(action_date);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE conversion_tracking ENABLE ROW LEVEL SECURITY;

-- KAMs can track conversions for their restaurants
CREATE POLICY "KAMs track own conversions"
ON conversion_tracking FOR INSERT
WITH CHECK (kam_email = auth.jwt() ->> 'email');

-- KAMs see own conversion history
CREATE POLICY "KAMs see own conversion history"
ON conversion_tracking FOR SELECT
USING (kam_email = auth.jwt() ->> 'email');
```

### Sample Data
Initially empty. Populated when KAMs mark restaurants as approached/converted.

---

## Complete Setup Script

**File**: `supabase-setup.sql`

This script creates all tables, indexes, RLS policies, and sample data. Run this in Supabase SQL Editor.

```sql
-- See full script in supabase-setup.sql file
```

---

## Data Relationships

### One-to-Many Relationships

**restaurants → drive_data**
- One restaurant can have multiple drive assignments
- Foreign key: drive_data.res_id → restaurants.res_id

**drives → drive_data**
- One drive can have multiple restaurant assignments
- Foreign key: drive_data.drive_id → drives.id

**restaurants → conversion_tracking**
- One restaurant can have multiple conversion events
- Foreign key: conversion_tracking.res_id → restaurants.res_id

**drives → conversion_tracking**
- One drive can have multiple conversion events
- Foreign key: conversion_tracking.drive_id → drives.id

### Unique Constraints

**drive_data**: UNIQUE(res_id, drive_id)
- A restaurant can only be assigned to a drive once
- Prevents duplicate assignments

---

## Query Examples

### Get all restaurants for a KAM with drive data

```sql
SELECT 
  r.*,
  json_agg(
    json_build_object(
      'drive_id', d.id,
      'drive_name', d.drive_name,
      'approached', dd.approached,
      'converted', dd.converted_stepper
    )
  ) as drives
FROM restaurants r
LEFT JOIN drive_data dd ON r.res_id = dd.res_id
LEFT JOIN drives d ON dd.drive_id = d.id
WHERE r.kam_email = 'shiv.kumar@zomato.com'
GROUP BY r.res_id;
```

### Get conversion rate for a KAM

```sql
SELECT 
  COUNT(*) FILTER (WHERE dd.approached = true) as approached_count,
  COUNT(*) FILTER (WHERE dd.converted_stepper = true) as converted_count,
  ROUND(
    COUNT(*) FILTER (WHERE dd.converted_stepper = true)::numeric / 
    NULLIF(COUNT(*) FILTER (WHERE dd.approached = true), 0) * 100, 
    2
  ) as conversion_rate
FROM drive_data dd
JOIN restaurants r ON dd.res_id = r.res_id
WHERE r.kam_email = 'shiv.kumar@zomato.com';
```

### Get restaurants in multiple drives

```sql
SELECT 
  r.res_id,
  r.res_name,
  COUNT(dd.drive_id) as drive_count,
  array_agg(d.drive_name) as drive_names
FROM restaurants r
JOIN drive_data dd ON r.res_id = dd.res_id
JOIN drives d ON dd.drive_id = d.id
GROUP BY r.res_id, r.res_name
HAVING COUNT(dd.drive_id) > 1
ORDER BY drive_count DESC;
```

