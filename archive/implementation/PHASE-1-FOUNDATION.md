# 🏗️ Phase 1: Foundation - Data Layer Established

**Technical Achievement:** Persistent data layer with type-safe API integration
**Priority:** CRITICAL
**Goal:** PostgreSQL schema + Supabase REST API + React Query integration

---

## 🎯 Phase Objectives

By the end of Phase 1, you will have achieved:

✅ **Database Schema:** Normalized PostgreSQL with 4 tables, foreign keys, and indexes
✅ **API Layer:** Supabase REST endpoints with auto-generated OpenAPI specification
✅ **Type System:** TypeScript interfaces matching database schema exactly
✅ **Data Models:** Sample dataset (20+ restaurants) with referential integrity
✅ **Client Integration:** React Query hooks with optimistic updates and cache invalidation
✅ **UI Connection:** KAM Hub and Restaurant Detail consuming real-time data
✅ **Validation:** Type-safe data flow from PostgreSQL → Supabase API → React Query → UI

---

## 📋 Task Breakdown

### **Task 1.1: Supabase Project Setup**

**Technical Achievement:** Cloud PostgreSQL instance with auto-generated REST API

#### Steps:

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up with GitHub or email
   - Create new organization: "Zomato"

2. **Create New Project**
   - Project name: `zomato-drive-dashboard`
   - Database password: (save securely!)
   - Region: `ap-south-1` (Mumbai, India)
   - Pricing plan: Free tier (upgrade later)

3. **Save Credentials**
   - Go to Project Settings → API
   - Copy `Project URL`
   - Copy `anon public` key
   - Copy `service_role` key (keep secret!)

4. **Create `.env.local` File**
   ```bash
   # In project root: d:\Projects\WARP\zomato-loveable
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

**Deliverable:** Supabase project ready with credentials saved

---

### **Task 1.2: Database Schema Creation**

**Technical Achievement:** Normalized relational schema with foreign keys and performance indexes

#### Steps:

1. **Open Supabase SQL Editor**
   - Go to Supabase Dashboard → SQL Editor
   - Click "New query"

2. **Create `restaurants` Table**
   ```sql
   CREATE TABLE restaurants (
     res_id VARCHAR(50) PRIMARY KEY,
     res_name VARCHAR(200) NOT NULL,
     kam_name VARCHAR(100),
     kam_email VARCHAR(100),
     tl_email VARCHAR(100),
     cuisine VARCHAR(100),
     locality VARCHAR(100),
     account_type VARCHAR(50),
     sept_ov INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create index for faster KAM queries
   CREATE INDEX idx_restaurants_kam ON restaurants(kam_name);
   ```

3. **Create `drives` Table**
   ```sql
   CREATE TABLE drives (
     id SERIAL PRIMARY KEY,
     drive_name VARCHAR(100) NOT NULL,
     drive_type VARCHAR(50) NOT NULL, -- 'discount', 'menu', 'ads'
     city VARCHAR(50),
     start_date DATE,
     end_date DATE,
     status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create index for active drives
   CREATE INDEX idx_drives_status ON drives(status);
   ```

4. **Create `drive_data` Table**
   ```sql
   CREATE TABLE drive_data (
     id SERIAL PRIMARY KEY,
     res_id VARCHAR(50) REFERENCES restaurants(res_id) ON DELETE CASCADE,
     drive_id INTEGER REFERENCES drives(id) ON DELETE CASCADE,
     um INTEGER DEFAULT 0,
     mm INTEGER DEFAULT 0,
     la INTEGER DEFAULT 0,
     la_base_code_suggested VARCHAR(50),
     la_step1 VARCHAR(50),
     la_step2 VARCHAR(50),
     la_step3 VARCHAR(50),
     mm_base_code_suggested VARCHAR(50),
     um_base_code_suggested VARCHAR(50),
     approached BOOLEAN DEFAULT FALSE,
     converted_stepper BOOLEAN DEFAULT FALSE,
     priority_score INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     UNIQUE(res_id, drive_id)
   );

   -- Create indexes for common queries
   CREATE INDEX idx_drive_data_res ON drive_data(res_id);
   CREATE INDEX idx_drive_data_drive ON drive_data(drive_id);
   CREATE INDEX idx_drive_data_approached ON drive_data(approached);
   CREATE INDEX idx_drive_data_converted ON drive_data(converted_stepper);
   ```

5. **Create `conversion_tracking` Table**
   ```sql
   CREATE TABLE conversion_tracking (
     id SERIAL PRIMARY KEY,
     res_id VARCHAR(50) REFERENCES restaurants(res_id),
     drive_id INTEGER REFERENCES drives(id),
     kam_name VARCHAR(100),
     action_type VARCHAR(50), -- 'approached', 'converted', 'activated', 'rejected'
     action_date TIMESTAMP DEFAULT NOW(),
     discount_applied VARCHAR(50),
     notes TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create index for KAM performance queries
   CREATE INDEX idx_conversion_kam ON conversion_tracking(kam_name, action_date);
   ```

6. **Run All Queries**
   - Execute each CREATE TABLE statement
   - Verify tables created: Go to Table Editor

**Deliverable:** 4 tables created with proper indexes

---

### **Task 1.3: Load Sample Data**

**Technical Achievement:** CSV-to-database ETL with validation and referential integrity

#### Steps:

1. **Prepare Sample Data**
   - Use `/zomato/Special 35 __ Shiv - Sheet10.csv`
   - Clean data (remove empty rows)

2. **Create Drive Record**
   ```sql
   INSERT INTO drives (drive_name, drive_type, city, start_date, end_date, status)
   VALUES ('Special 35', 'discount', 'Pune', '2024-11-01', '2024-11-30', 'active');
   ```

3. **Import Restaurants (Manual for now)**
   ```sql
   INSERT INTO restaurants (res_id, res_name, kam_name, kam_email, cuisine, locality, account_type, sept_ov)
   VALUES 
   ('19195746', 'Shahi Darbar', 'Anudeep Pawar', 'anudeep@zomato.com', 'Chinese', 'Camp Area', 'CA', 52),
   ('19195747', 'Sardarji Paratha & Chaap House', 'Anudeep Pawar', 'anudeep@zomato.com', 'North Indian', 'Kothrud', 'LA', 38),
   ('19195748', 'Naadbramha Idli', 'Anudeep Pawar', 'anudeep@zomato.com', 'South Indian', 'Deccan', 'UM', 65);
   -- Add more rows...
   ```

4. **Import Drive Data**
   ```sql
   INSERT INTO drive_data (res_id, drive_id, um, mm, la, la_base_code_suggested, approached, converted_stepper)
   VALUES 
   ('19195746', 1, 23, 12, 15, '40 upto 80', FALSE, FALSE),
   ('19195747', 1, 10, 18, 8, '35 upto 70', FALSE, FALSE),
   ('19195748', 1, 30, 20, 12, '45 upto 90', FALSE, FALSE);
   -- Add more rows...
   ```

5. **Verify Data**
   ```sql
   -- Check restaurant count
   SELECT COUNT(*) FROM restaurants;

   -- Check drive data
   SELECT r.res_name, r.kam_name, dd.la_base_code_suggested, dd.approached
   FROM restaurants r
   JOIN drive_data dd ON r.res_id = dd.res_id
   WHERE r.kam_name = 'Anudeep Pawar';
   ```

**Deliverable:** 20+ restaurants loaded with drive data

---

### **Task 1.4: Install Supabase Client**

**Technical Achievement:** Type-safe Supabase client with environment-based configuration

#### Steps:

1. **Install Dependencies**
   ```bash
   cd d:\Projects\WARP\zomato-loveable
   npm install @supabase/supabase-js
   ```

2. **Create Supabase Client**
   - Create file: `src/lib/supabase.ts`
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   if (!supabaseUrl || !supabaseAnonKey) {
     throw new Error('Missing Supabase environment variables')
   }

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

3. **Create TypeScript Types**
   - Create file: `src/types/database.ts`
   ```typescript
   export interface Restaurant {
     res_id: string
     res_name: string
     kam_name: string | null
     kam_email: string | null
     cuisine: string | null
     locality: string | null
     account_type: string | null
     sept_ov: number
     created_at: string
     updated_at: string
   }

   export interface Drive {
     id: number
     drive_name: string
     drive_type: string
     city: string | null
     start_date: string | null
     end_date: string | null
     status: string
     created_at: string
   }

   export interface DriveData {
     id: number
     res_id: string
     drive_id: number
     um: number
     mm: number
     la: number
     la_base_code_suggested: string | null
     approached: boolean
     converted_stepper: boolean
     priority_score: number
     created_at: string
     updated_at: string
   }
   ```

**Deliverable:** Supabase client configured and ready to use

---

### **Task 1.5: Connect KAM Hub to Real Data**

**Technical Achievement:** React Query hooks with cache invalidation and optimistic updates

#### Steps:

1. **Create API Hook**
   - Create file: `src/hooks/useRestaurants.ts`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'
   import type { Restaurant, DriveData } from '@/types/database'

   export function useRestaurants(kamName: string) {
     return useQuery({
       queryKey: ['restaurants', kamName],
       queryFn: async () => {
         const { data, error } = await supabase
           .from('restaurants')
           .select(`
             *,
             drive_data (*)
           `)
           .eq('kam_name', kamName)

         if (error) throw error
         return data as (Restaurant & { drive_data: DriveData[] })[]
       }
     })
   }
   ```

2. **Update KAM Hub Page**
   - Edit: `src/pages/KAMHub.tsx`
   - Replace mock data with real API call
   ```typescript
   import { useRestaurants } from '@/hooks/useRestaurants'

   const KAMHub = () => {
     const kamName = 'Anudeep Pawar' // TODO: Get from auth
     const { data: restaurants, isLoading, error } = useRestaurants(kamName)

     if (isLoading) return <div>Loading...</div>
     if (error) return <div>Error: {error.message}</div>

     return (
       // ... existing UI code
       {restaurants?.map(restaurant => (
         <Card key={restaurant.res_id}>
           <h3>{restaurant.res_name}</h3>
           <p>{restaurant.locality}</p>
           {/* ... */}
         </Card>
       ))}
     )
   }
   ```

**Deliverable:** KAM Hub showing real restaurants from database

---

## ✅ Phase 1 Completion Checklist

- [ ] Supabase project created
- [ ] 4 database tables created
- [ ] Sample data loaded (20+ restaurants)
- [ ] Supabase client installed
- [ ] TypeScript types defined
- [ ] KAM Hub connected to real data
- [ ] Restaurant Detail page connected to real data
- [ ] No console errors
- [ ] Data displays correctly

---

**Next Phase:** [Phase 2 - Core Features](PHASE-2-CORE-FEATURES.md)

