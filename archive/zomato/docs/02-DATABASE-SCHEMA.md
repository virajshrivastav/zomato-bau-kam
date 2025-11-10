# 🗄️ Database Schema Design

## Overview

This document defines the complete database schema for the Zomato Drive Dashboard. The schema is designed for **PostgreSQL** (via Supabase) with a focus on:

- **Normalization** - Minimize data redundancy
- **Performance** - Optimized for read-heavy workloads
- **Scalability** - Support 100,000+ restaurants
- **Auditability** - Track all changes with timestamps

---

## 📊 Entity Relationship Diagram

```
┌─────────────────┐
│   restaurants   │
│─────────────────│
│ res_id (PK)     │◄─────┐
│ res_name        │      │
│ kam_name        │      │
│ kam_email       │      │
│ tl_email        │      │
│ cuisine         │      │
│ locality        │      │
│ account_type    │      │
│ sept_ov         │      │
│ created_at      │      │
│ updated_at      │      │
└─────────────────┘      │
                         │
                         │
┌─────────────────────────┼──────────────────┐
│      drive_data         │                  │
│─────────────────────────│                  │
│ id (PK)                 │                  │
│ res_id (FK) ────────────┘                  │
│ drive_id (FK) ──────────┐                  │
│ um                      │                  │
│ mm                      │                  │
│ la                      │                  │
│ res_orders              │                  │
│ la_active_promos        │                  │
│ mm_active_promos        │                  │
│ um_active_promos        │                  │
│ la_base_code_suggested  │                  │
│ mm_base_code_suggested  │                  │
│ um_base_code_suggested  │                  │
│ la_step1, la_step2...   │                  │
│ mm_step1, mm_step2...   │                  │
│ um_step1, um_step2...   │                  │
│ approached              │                  │
│ converted_stepper       │                  │
│ priority_score          │                  │
│ last_updated            │                  │
└─────────────────────────┘                  │
         │                                   │
         │                                   │
         │              ┌────────────────────┘
         │              │
         │              │  ┌─────────────────┐
         │              │  │     drives      │
         │              │  │─────────────────│
         │              └──│ id (PK)         │
         │                 │ drive_name      │
         │                 │ drive_type      │
         │                 │ city            │
         │                 │ start_date      │
         │                 │ end_date        │
         │                 │ status          │
         │                 │ created_at      │
         │                 └─────────────────┘
         │
         │
         ▼
┌─────────────────────────┐
│  conversion_tracking    │
│─────────────────────────│
│ id (PK)                 │
│ res_id (FK)             │
│ drive_id (FK)           │
│ kam_name                │
│ action_type             │
│ action_date             │
│ notes                   │
│ created_at              │
└─────────────────────────┘
```

---

## 🏗️ Table Definitions

### 1. `restaurants` (Master Data)

Stores core restaurant information.

```sql
CREATE TABLE restaurants (
  -- Primary Key
  res_id VARCHAR(20) PRIMARY KEY,
  
  -- Restaurant Details
  res_name VARCHAR(255) NOT NULL,
  cuisine VARCHAR(100),
  locality VARCHAR(100),
  concat_locality_cuisine VARCHAR(255), -- For filtering
  
  -- KAM Assignment
  kam_name VARCHAR(100),
  kam_email VARCHAR(255),
  tl_email VARCHAR(255),
  
  -- Business Metrics
  account_type VARCHAR(50), -- 'CA', 'Premium', etc.
  sept_ov INTEGER DEFAULT 0, -- September Order Volume
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_restaurants_kam ON restaurants(kam_name);
CREATE INDEX idx_restaurants_locality ON restaurants(locality);
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX idx_restaurants_ov ON restaurants(sept_ov DESC);
```

**Sample Data:**
```sql
INSERT INTO restaurants VALUES (
  '19195746',
  'Shahi Darbar',
  'Chinese',
  'Camp Area',
  'Camp AreaChinese',
  'Anudeep Pawar',
  'anudeep.pawar@zomato.com',
  'samrudhh.bhave@zomato.com',
  'CA',
  52,
  NOW(),
  NOW()
);
```

---

### 2. `drives` (Drive Campaigns)

Stores information about each drive campaign.

```sql
CREATE TABLE drives (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Drive Details
  drive_name VARCHAR(100) NOT NULL, -- 'Special 35', 'Menu Drive Q4'
  drive_type VARCHAR(50) NOT NULL, -- 'discount', 'menu', 'ads'
  city VARCHAR(100),
  zone VARCHAR(100),
  
  -- Timeline
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused'
  
  -- Targets
  target_restaurants INTEGER,
  target_conversion_rate DECIMAL(5,2),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_drives_type ON drives(drive_type);
CREATE INDEX idx_drives_city ON drives(city);
CREATE INDEX idx_drives_status ON drives(status);
```

**Sample Data:**
```sql
INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, target_conversion_rate) 
VALUES ('Special 35', 'discount', 'Pune', '2025-11-01', '2025-11-30', 25.00);
```

---

### 3. `drive_data` (Restaurant-Drive Assignments)

Links restaurants to drives with all drive-specific data.

```sql
CREATE TABLE drive_data (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  res_id VARCHAR(20) REFERENCES restaurants(res_id) ON DELETE CASCADE,
  drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
  
  -- Customer Segment Order Volumes
  um INTEGER DEFAULT 0, -- Upper Middle
  mm INTEGER DEFAULT 0, -- Middle Middle
  la INTEGER DEFAULT 0, -- Lower Affluent
  res_orders DECIMAL(6,4) DEFAULT 0, -- Restaurant order percentage
  
  -- Priority Tags (from sheet columns P1-P6)
  priority_tags TEXT[], -- ['Salt 20-40%', 'BOGO', 'Stepper']
  
  -- LA (Lower Affluent) Segment Data
  la_res_asv DECIMAL(10,2),
  la_asv_50p DECIMAL(10,2),
  la_asv_70p DECIMAL(10,2),
  la_asv_90p DECIMAL(10,2),
  la_active_promos TEXT,
  la_remove TEXT,
  la_base_code_suggested VARCHAR(255),
  la_step1 VARCHAR(255),
  la_step2 VARCHAR(255),
  la_step3 VARCHAR(255),
  
  -- MM (Middle Middle) Segment Data
  mm_res_asvc DECIMAL(10,2),
  mm_asv_50pc DECIMAL(10,2),
  mm_asv_70pc DECIMAL(10,2),
  mm_asv_90pc DECIMAL(10,2),
  mm_active_promos TEXT,
  mm_remove TEXT,
  mm_base_code_suggested VARCHAR(255),
  mm_step1 VARCHAR(255),
  mm_step2 VARCHAR(255),
  mm_step3 VARCHAR(255),
  
  -- UM (Upper Middle) Segment Data
  um_res_asvc DECIMAL(10,2),
  um_asv_50pc DECIMAL(10,2),
  um_asv_70pc DECIMAL(10,2),
  um_asv_90pc DECIMAL(10,2),
  um_active_promos TEXT,
  um_remove TEXT,
  um_base_code_suggested VARCHAR(255),
  um_step1 VARCHAR(255),
  um_step2 VARCHAR(255),
  um_step3 VARCHAR(255),
  
  -- BOGO Data
  mvdo_for_bogo DECIMAL(5,2),
  
  -- Status Tracking
  approached BOOLEAN DEFAULT FALSE,
  converted_stepper BOOLEAN DEFAULT FALSE,
  converted_bogo BOOLEAN DEFAULT FALSE,
  
  -- AI Prioritization
  priority_score INTEGER DEFAULT 0, -- 0-100, higher = more important
  
  -- Metadata
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Unique constraint: one restaurant per drive
  UNIQUE(res_id, drive_id)
);

-- Indexes for performance
CREATE INDEX idx_drive_data_res ON drive_data(res_id);
CREATE INDEX idx_drive_data_drive ON drive_data(drive_id);
CREATE INDEX idx_drive_data_approached ON drive_data(approached);
CREATE INDEX idx_drive_data_converted ON drive_data(converted_stepper);
CREATE INDEX idx_drive_data_priority ON drive_data(priority_score DESC);
```

---

### 4. `conversion_tracking` (Audit Trail)

Tracks all KAM actions for analytics and accountability.

```sql
CREATE TABLE conversion_tracking (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Foreign Keys
  res_id VARCHAR(20) REFERENCES restaurants(res_id),
  drive_id INTEGER REFERENCES drives(id),
  
  -- Action Details
  kam_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'approached', 'converted', 'activated', 'rejected'
  action_date DATE DEFAULT CURRENT_DATE,
  
  -- Additional Context
  discount_applied VARCHAR(255), -- What discount was activated
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversion_res ON conversion_tracking(res_id);
CREATE INDEX idx_conversion_kam ON conversion_tracking(kam_name);
CREATE INDEX idx_conversion_date ON conversion_tracking(action_date DESC);
CREATE INDEX idx_conversion_type ON conversion_tracking(action_type);
```

**Sample Data:**
```sql
INSERT INTO conversion_tracking (res_id, drive_id, kam_name, action_type, discount_applied, notes)
VALUES (
  '19195746',
  1,
  'Anudeep Pawar',
  'approached',
  NULL,
  'Called partner, interested in 40 upto 80 offer'
);
```

---

### 5. `kam_performance` (Materialized View for Analytics)

Pre-computed KAM performance metrics for fast dashboard loading.

```sql
CREATE MATERIALIZED VIEW kam_performance AS
SELECT 
  r.kam_name,
  r.kam_email,
  COUNT(DISTINCT dd.res_id) as total_restaurants,
  COUNT(DISTINCT CASE WHEN dd.approached = TRUE THEN dd.res_id END) as approached_count,
  COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) as converted_count,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN dd.converted_stepper = TRUE THEN dd.res_id END) / 
    NULLIF(COUNT(DISTINCT dd.res_id), 0), 
    2
  ) as conversion_rate,
  SUM(r.sept_ov) as total_ov,
  SUM(CASE WHEN dd.converted_stepper = TRUE THEN r.sept_ov ELSE 0 END) as converted_ov
FROM restaurants r
LEFT JOIN drive_data dd ON r.res_id = dd.res_id
GROUP BY r.kam_name, r.kam_email;

-- Refresh daily via n8n or cron
CREATE UNIQUE INDEX idx_kam_performance_name ON kam_performance(kam_name);
```

---

## 🔄 Data Migration Strategy

### From Google Sheets to Database

**n8n Workflow Steps:**

1. **Extract** - Read Google Sheet rows
2. **Transform** - Map columns to database fields
3. **Load** - Upsert into Supabase

**Mapping Example:**

| Google Sheet Column | Database Table | Database Column |
|---------------------|----------------|-----------------|
| res_id | restaurants | res_id |
| res_name | restaurants | res_name |
| am_name | restaurants | kam_name |
| Sept OV | restaurants | sept_ov |
| UM | drive_data | um |
| la_base_code_suggested | drive_data | la_base_code_suggested |
| Approached | drive_data | approached |

---

## 📈 Query Examples

### 1. Get all restaurants for a KAM with pending conversions

```sql
SELECT 
  r.res_id,
  r.res_name,
  r.sept_ov,
  d.drive_name,
  dd.la_base_code_suggested,
  dd.approached,
  dd.converted_stepper
FROM restaurants r
JOIN drive_data dd ON r.res_id = dd.res_id
JOIN drives d ON dd.drive_id = d.id
WHERE r.kam_name = 'Anudeep Pawar'
  AND dd.converted_stepper = FALSE
  AND d.status = 'active'
ORDER BY r.sept_ov DESC;
```

### 2. Calculate conversion rate for today

```sql
SELECT 
  COUNT(*) FILTER (WHERE action_type = 'converted') as conversions_today,
  COUNT(DISTINCT res_id) as restaurants_approached_today,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE action_type = 'converted') / 
    NULLIF(COUNT(DISTINCT res_id), 0),
    2
  ) as conversion_rate_today
FROM conversion_tracking
WHERE action_date = CURRENT_DATE
  AND kam_name = 'Anudeep Pawar';
```

### 3. Find restaurants in multiple drives

```sql
SELECT 
  r.res_id,
  r.res_name,
  r.kam_name,
  COUNT(DISTINCT dd.drive_id) as drive_count,
  STRING_AGG(d.drive_name, ', ') as drives
FROM restaurants r
JOIN drive_data dd ON r.res_id = dd.res_id
JOIN drives d ON dd.drive_id = d.id
WHERE d.status = 'active'
GROUP BY r.res_id, r.res_name, r.kam_name
HAVING COUNT(DISTINCT dd.drive_id) > 1
ORDER BY drive_count DESC;
```

### 4. KAM Leaderboard

```sql
SELECT 
  kam_name,
  total_restaurants,
  converted_count,
  conversion_rate,
  RANK() OVER (ORDER BY conversion_rate DESC) as rank
FROM kam_performance
ORDER BY conversion_rate DESC
LIMIT 10;
```

---

## 🔐 Row Level Security (RLS)

Enable RLS in Supabase to ensure KAMs only see their own data.

```sql
-- Enable RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE drive_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: KAMs can only see their assigned restaurants
CREATE POLICY kam_access_restaurants ON restaurants
  FOR SELECT
  USING (kam_email = auth.jwt() ->> 'email');

-- Policy: Zonal Heads can see all restaurants in their zone
CREATE POLICY zonal_head_access ON restaurants
  FOR SELECT
  USING (
    tl_email = auth.jwt() ->> 'email'
    OR auth.jwt() ->> 'role' = 'admin'
  );
```

---

## 🚀 Performance Optimization

### Indexes

All critical indexes are defined in table creation scripts above.

### Partitioning (Future)

For large datasets (>1M rows), partition `conversion_tracking` by date:

```sql
CREATE TABLE conversion_tracking_2025_11 PARTITION OF conversion_tracking
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

### Caching Strategy

- **Materialized Views** - Refresh `kam_performance` daily
- **Application Cache** - Cache drive list, KAM list for 1 hour
- **CDN** - Cache static dashboard assets

---

**Next:** See [API Specification](03-API-SPECIFICATION.md) for endpoint definitions.

