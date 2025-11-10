# 🗄️ Database Migration Guide

This guide covers migrating data from Google Sheets to Supabase PostgreSQL database.

---

## 📊 Data Source

**Current State:** Data in Google Sheets  
**Target State:** Data in Supabase PostgreSQL  
**Sample File:** `/zomato/Special 35 __ Shiv - Sheet10.csv`

---

## 🎯 Migration Strategy

### **Phase 1: Manual Import (Week 1)**
- Import CSV data manually via Supabase UI
- Validate data integrity
- Test queries

### **Phase 2: Automated Sync (Week 2)**
- Set up n8n workflow
- Daily sync from Google Sheets
- Error handling and logging

---

## 📋 Step-by-Step Migration

### **Step 1: Prepare CSV Data** (30 minutes)

1. **Download Google Sheet as CSV**
   - Open: `Special 35 __ Shiv - Sheet10`
   - File → Download → CSV

2. **Clean Data**
   - Remove empty rows
   - Trim whitespace
   - Validate res_id (no duplicates)
   - Check for null values in required fields

3. **Split into Two Files**
   - `restaurants.csv` - Restaurant master data
   - `drive_data.csv` - Drive-specific data

**restaurants.csv format:**
```csv
res_id,res_name,kam_name,kam_email,cuisine,locality,account_type,sept_ov
19195746,Shahi Darbar,Anudeep Pawar,anudeep@zomato.com,Chinese,Camp Area,CA,52
19195747,Sardarji Paratha,Anudeep Pawar,anudeep@zomato.com,North Indian,Kothrud,LA,38
```

**drive_data.csv format:**
```csv
res_id,drive_id,um,mm,la,la_base_code_suggested,approached,converted_stepper
19195746,1,23,12,15,40 upto 80,FALSE,FALSE
19195747,1,10,18,8,35 upto 70,FALSE,FALSE
```

---

### **Step 2: Create Drive Record** (5 minutes)

Before importing drive_data, create the drive record:

```sql
INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, status)
VALUES ('Special 35', 'discount', 'Pune', '2024-11-01', '2024-11-30', 'active');
```

**Verify:**
```sql
SELECT * FROM drives;
```

Expected output:
```
id | drive_name  | drive_type | city | start_date | end_date   | status
---+-------------+------------+------+------------+------------+--------
1  | Special 35  | discount   | Pune | 2024-11-01 | 2024-11-30 | active
```

---

### **Step 3: Import Restaurants** (15 minutes)

**Option A: Supabase UI (Easiest)**

1. Go to Supabase Dashboard → Table Editor
2. Select `restaurants` table
3. Click "Insert" → "Import data from CSV"
4. Upload `restaurants.csv`
5. Map columns:
   - res_id → res_id
   - res_name → res_name
   - kam_name → kam_name
   - etc.
6. Click "Import"

**Option B: SQL (Faster for large datasets)**

```sql
COPY restaurants (res_id, res_name, kam_name, kam_email, cuisine, locality, account_type, sept_ov)
FROM '/path/to/restaurants.csv'
DELIMITER ','
CSV HEADER;
```

**Verify:**
```sql
SELECT COUNT(*) FROM restaurants;
SELECT * FROM restaurants LIMIT 5;
```

---

### **Step 4: Import Drive Data** (15 minutes)

**Option A: Supabase UI**

1. Go to Table Editor → `drive_data`
2. Click "Insert" → "Import data from CSV"
3. Upload `drive_data.csv`
4. Map columns
5. Click "Import"

**Option B: SQL**

```sql
COPY drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, approached, converted_stepper)
FROM '/path/to/drive_data.csv'
DELIMITER ','
CSV HEADER;
```

**Verify:**
```sql
SELECT COUNT(*) FROM drive_data;

-- Check for orphaned records (should return 0)
SELECT COUNT(*) 
FROM drive_data dd
LEFT JOIN restaurants r ON dd.res_id = r.res_id
WHERE r.res_id IS NULL;
```

---

### **Step 5: Validate Data** (15 minutes)

Run these validation queries:

**1. Check for duplicate restaurants:**
```sql
SELECT res_id, COUNT(*) 
FROM restaurants 
GROUP BY res_id 
HAVING COUNT(*) > 1;
```
Expected: 0 rows

**2. Check for missing KAM names:**
```sql
SELECT COUNT(*) 
FROM restaurants 
WHERE kam_name IS NULL OR kam_name = '';
```
Expected: 0 (or acceptable number)

**3. Check drive data integrity:**
```sql
SELECT 
  COUNT(*) as total_records,
  COUNT(DISTINCT res_id) as unique_restaurants,
  SUM(CASE WHEN approached THEN 1 ELSE 0 END) as approached_count,
  SUM(CASE WHEN converted_stepper THEN 1 ELSE 0 END) as converted_count
FROM drive_data;
```

**4. Check multi-drive restaurants:**
```sql
SELECT 
  r.res_id,
  r.res_name,
  COUNT(dd.drive_id) as drive_count
FROM restaurants r
JOIN drive_data dd ON r.res_id = dd.res_id
GROUP BY r.res_id, r.res_name
HAVING COUNT(dd.drive_id) > 1;
```

**5. Verify KAM distribution:**
```sql
SELECT 
  kam_name,
  COUNT(*) as restaurant_count
FROM restaurants
GROUP BY kam_name
ORDER BY restaurant_count DESC;
```

---

### **Step 6: Create Sample Conversion Data** (10 minutes)

For testing analytics, create some sample conversion tracking:

```sql
-- Mark some restaurants as approached
UPDATE drive_data 
SET approached = TRUE 
WHERE res_id IN (
  SELECT res_id FROM drive_data ORDER BY RANDOM() LIMIT 10
);

-- Mark some as converted
UPDATE drive_data 
SET converted_stepper = TRUE, approached = TRUE
WHERE res_id IN (
  SELECT res_id FROM drive_data WHERE approached = TRUE ORDER BY RANDOM() LIMIT 5
);

-- Create conversion tracking records
INSERT INTO conversion_tracking (res_id, drive_id, kam_name, action_type, action_date)
SELECT 
  dd.res_id,
  dd.drive_id,
  r.kam_name,
  'approached',
  NOW() - (RANDOM() * INTERVAL '7 days')
FROM drive_data dd
JOIN restaurants r ON dd.res_id = r.res_id
WHERE dd.approached = TRUE;

INSERT INTO conversion_tracking (res_id, drive_id, kam_name, action_type, action_date, discount_applied)
SELECT 
  dd.res_id,
  dd.drive_id,
  r.kam_name,
  'converted',
  NOW() - (RANDOM() * INTERVAL '5 days'),
  dd.la_base_code_suggested
FROM drive_data dd
JOIN restaurants r ON dd.res_id = r.res_id
WHERE dd.converted_stepper = TRUE;
```

---

## 🔄 Automated Sync Setup

### **n8n Workflow Configuration**

**Workflow Name:** Daily Drive Sync  
**Schedule:** 6:00 AM IST daily  
**Duration:** ~5 minutes for 1000 rows

**Nodes:**

1. **Schedule Trigger**
   - Cron: `0 6 * * *` (6:00 AM daily)
   - Timezone: Asia/Kolkata

2. **Google Sheets - Read**
   - Spreadsheet: `Special 35 __ Shiv`
   - Sheet: `Sheet10`
   - Range: `A:Z`

3. **Code - Transform Data**
   ```javascript
   const items = $input.all();
   const transformed = [];

   for (const item of items) {
     const row = item.json;
     
     // Skip header and empty rows
     if (!row.res_id || row.res_id === 'res_id') continue;
     
     const restaurant = {
       res_id: row.res_id?.toString().trim(),
       res_name: row.res_name?.trim(),
       kam_name: row.am_name?.trim(),
       kam_email: row['AM Email']?.trim(),
       cuisine: row.Cuisine?.trim(),
       locality: row.Locality?.trim(),
       account_type: row.account_type?.trim(),
       sept_ov: parseInt(row['Sept OV']) || 0
     };
     
     const driveData = {
       res_id: row.res_id?.toString().trim(),
       drive_id: 1, // Special 35
       um: parseInt(row.UM) || 0,
       mm: parseInt(row.MM) || 0,
       la: parseInt(row.LA) || 0,
       la_base_code_suggested: row.la_base_code_suggested?.trim(),
       la_step1: row.la_step1?.trim(),
       la_step2: row.la_step2?.trim(),
       la_step3: row.la_step3?.trim(),
       approached: row.Approached?.toLowerCase() === 'yes',
       converted_stepper: row['Converted for Stepper']?.toLowerCase() === 'yes'
     };
     
     transformed.push({ json: { restaurant, driveData } });
   }

   return transformed;
   ```

4. **Supabase - Upsert Restaurants**
   - Table: `restaurants`
   - Operation: Upsert
   - Conflict column: `res_id`

5. **Supabase - Upsert Drive Data**
   - Table: `drive_data`
   - Operation: Upsert
   - Conflict columns: `res_id, drive_id`

6. **Slack - Send Notification**
   - Channel: `#drive-updates`
   - Message: `✅ Daily sync completed. {{$json.count}} restaurants updated.`

---

## 🔍 Data Validation Queries

Run these after each sync:

**1. Row count match:**
```sql
-- Should match Google Sheets row count
SELECT COUNT(*) FROM restaurants;
SELECT COUNT(*) FROM drive_data;
```

**2. Data freshness:**
```sql
-- Check last update time
SELECT MAX(updated_at) FROM restaurants;
SELECT MAX(updated_at) FROM drive_data;
```

**3. Null value check:**
```sql
-- Critical fields should not be null
SELECT COUNT(*) FROM restaurants WHERE res_id IS NULL;
SELECT COUNT(*) FROM restaurants WHERE res_name IS NULL;
SELECT COUNT(*) FROM drive_data WHERE res_id IS NULL;
```

**4. Referential integrity:**
```sql
-- All drive_data should have matching restaurant
SELECT COUNT(*) 
FROM drive_data dd
LEFT JOIN restaurants r ON dd.res_id = r.res_id
WHERE r.res_id IS NULL;
```

---

## 🚨 Error Handling

### **Common Issues**

**Issue 1: Duplicate res_id**
```sql
-- Find duplicates
SELECT res_id, COUNT(*) 
FROM restaurants 
GROUP BY res_id 
HAVING COUNT(*) > 1;

-- Fix: Keep latest, delete older
DELETE FROM restaurants 
WHERE ctid NOT IN (
  SELECT MAX(ctid) 
  FROM restaurants 
  GROUP BY res_id
);
```

**Issue 2: Invalid foreign key**
```sql
-- Find orphaned drive_data
SELECT dd.* 
FROM drive_data dd
LEFT JOIN restaurants r ON dd.res_id = r.res_id
WHERE r.res_id IS NULL;

-- Fix: Delete orphaned records
DELETE FROM drive_data 
WHERE res_id NOT IN (SELECT res_id FROM restaurants);
```

**Issue 3: Data type mismatch**
```sql
-- Check for non-numeric values in numeric fields
SELECT res_id, sept_ov 
FROM restaurants 
WHERE sept_ov IS NULL OR sept_ov < 0;
```

---

## 📊 Migration Checklist

- [ ] CSV files prepared and cleaned
- [ ] Drive record created
- [ ] Restaurants imported (verify count)
- [ ] Drive data imported (verify count)
- [ ] Validation queries passed
- [ ] Sample conversion data created
- [ ] n8n workflow configured
- [ ] Test sync executed successfully
- [ ] Error handling tested
- [ ] Slack notifications working

---

## 🔄 Rollback Plan

If migration fails:

```sql
-- Backup before migration
CREATE TABLE restaurants_backup AS SELECT * FROM restaurants;
CREATE TABLE drive_data_backup AS SELECT * FROM drive_data;

-- Rollback if needed
TRUNCATE restaurants CASCADE;
INSERT INTO restaurants SELECT * FROM restaurants_backup;

TRUNCATE drive_data CASCADE;
INSERT INTO drive_data SELECT * FROM drive_data_backup;
```

---

**Next:** [UI Integration Guide](UI-INTEGRATION-GUIDE.md)

