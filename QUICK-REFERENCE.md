# ⚡ Quick Reference Guide

**Last Updated:** November 10, 2025
**System Type:** PRODUCTION (Not MVP)
**Status:** Foundation Complete (~35%) - Production Features Required
**Purpose:** Fast lookup for common tasks and information

---

## 📚 Documentation Map

**New to the project?** Read in this order:

1. **[README.md](README.md)** - Project overview (5 min)
2. **[PROJECT-GOALS.md](PROJECT-GOALS.md)** - Business context (10 min)
3. **[CURRENT-STATE.md](CURRENT-STATE.md)** - What's built vs. what's not (5 min)
4. **[IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md)** - Sprint breakdown (15 min)
5. **[SPRINT-0-FOUNDATION.md](SPRINT-0-FOUNDATION.md)** - Start building (5 hours)

**Total time to productivity:** 35 minutes reading + 5 hours setup = Ready to build!

---

## 🎯 Project Summary (30 seconds)

**Problem:** KAMs manage 10+ Google Sheets → inefficient, can't edit/activate discounts easily
**Solution:** Production dashboard that **completely replaces** Google Sheets
**System Type:** PRODUCTION (not MVP) - must support editing, activation, filtering, analytics, sync
**Status:** Foundation complete (~35%) - Sprints 2-6 required for production
**Current:** Sprints 0-1 done (viewing & tracking work)
**Next:** Sprint 2 (Discount Management) - 3-4 days

---

## 🏗️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- React Router v6 (routing)
- Tailwind CSS (styling)
- shadcn/ui (components)
- TanStack Query (data fetching)
- Recharts (charts)

**Backend:**
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)

**Data Source:**
- Google Sheets (to be synced)

---

## 📁 Project Structure

```
zomato-loveable/
├── src/
│   ├── pages/              # 5 screens (all with mock data)
│   ├── components/         # 21 custom + 48 shadcn/ui
│   ├── hooks/              # Custom React hooks
│   └── lib/
│       └── supabase.ts     # Supabase client
├── archive/
│   ├── lovable-repos/      # Original 5 Lovable repos
│   └── zomato/docs/        # Business requirements
├── PROJECT-GOALS.md        # Business context
├── CURRENT-STATE.md        # What's built
├── IMPLEMENTATION-PLAN.md  # Sprint breakdown
├── SPRINT-0-FOUNDATION.md  # Auth + Database setup
└── sample-data.csv         # Data structure
```

---

## 🚀 Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database (Supabase SQL Editor)
```sql
-- See all restaurants
SELECT * FROM restaurants;

-- See restaurants with drives
SELECT r.res_name, COUNT(dd.drive_id) as drive_count
FROM restaurants r
LEFT JOIN drive_data dd ON r.res_id = dd.res_id
GROUP BY r.res_id, r.res_name;

-- See conversion tracking
SELECT * FROM conversion_tracking
ORDER BY action_date DESC;
```

### Browser Console (Testing)
```javascript
// Import Supabase client
import { supabase } from './src/lib/supabase'

// Query restaurants
const { data } = await supabase.from('restaurants').select('*')
console.log(data)

// Login
await supabase.auth.signInWithPassword({
  email: 'shiv.kumar@zomato.com',
  password: 'zomato123'
})

// Logout
await supabase.auth.signOut()
```

---

## 👥 Test Users

| Email | Password | Restaurants |
|-------|----------|-------------|
| shiv.kumar@zomato.com | `zomato123` | 3 restaurants |
| amdeep.singh@zomato.com | `zomato123` | 3 restaurants |
| shrawani.patil@zomato.com | `zomato123` | 2 restaurants |
| rutuja.deshmukh@zomato.com | `zomato123` | 2 restaurants |

---

## 🗄️ Database Schema

### Tables

1. **restaurants** - Master restaurant data
   - Primary Key: `res_id`
   - Key Fields: `res_name`, `kam_email`, `cuisine`, `locality`, `sept_ov`

2. **drives** - Campaign data
   - Primary Key: `id`
   - Key Fields: `drive_name`, `drive_type`, `start_date`, `end_date`

3. **drive_data** - Restaurant-drive assignments
   - Primary Key: `id`
   - Foreign Keys: `res_id`, `drive_id`
   - Key Fields: `approached`, `converted_stepper`, `priority_score`

4. **conversion_tracking** - Audit trail
   - Primary Key: `id`
   - Foreign Keys: `res_id`, `drive_id`
   - Key Fields: `kam_email`, `action_type`, `action_date`

---

## 🎨 UI Screens

| Screen | Route | Status | Mock Data |
|--------|-------|--------|-----------|
| Main Dashboard | `/` | ✅ Complete | Hardcoded metrics |
| KAM Hub | `/kam-hub` | ✅ Complete | 7 restaurants |
| Restaurant Detail | `/restaurant/:id` | ✅ Complete | 2 restaurants |
| KAM Analytics | `/kam-analytics` | ✅ Complete | Chart data |
| Zonal Head View | `/zonal-head-view` | ✅ Complete | 5 KAMs |

---

## 🔧 Troubleshooting

### "Missing Supabase environment variables"
**Fix:** Create `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### "relation 'restaurants' does not exist"
**Fix:** Run database schema SQL in Supabase SQL Editor (see SPRINT-0-FOUNDATION.md Task 3)

### "RLS policy violation"
**Fix:** Make sure you're logged in with `supabase.auth.signInWithPassword()`

### "No restaurants showing after login"
**Fix:** Check that logged-in user's email matches `kam_email` in restaurants table

### Dev server not starting
**Fix:** 
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Current Progress (Production System)

**Overall:** ~35% complete (2 of 6 sprints done)

### Infrastructure & Foundation (100%)
- ✅ UI/UX: 100%
- ✅ Components: 100%
- ✅ Routing: 100%
- ✅ Authentication: 100%
- ✅ Database: 100%
- ✅ API Integration: 100%

### Core Features (50%)
- ✅ View Restaurants: 100%
- ✅ Conversion Tracking: 100%
- ✅ Basic Search: 100%
- ❌ Discount Editing: 0% (Sprint 2)
- ❌ Discount Activation: 0% (Sprint 2)
- ❌ Advanced Filtering: 0% (Sprint 3)

### Analytics & Reporting (0%)
- ❌ Real KAM Analytics: 0% (Sprint 4)
- ❌ Real Zonal Dashboard: 0% (Sprint 4)
- ❌ Export Functionality: 0% (Sprint 6)

### Data Management (0%)
- ❌ Google Sheets Sync: 0% (Sprint 5)
- ❌ Data Validation: 0% (Sprint 5)

**Next Sprint:** Sprint 2 (Discount Management) - 3-4 days

---

## 🎯 Sprint Overview (6 Sprints for Production)

### Sprint 0: Foundation ✅ COMPLETE (2-3 days)
**Goal:** Backend infrastructure ready

**Deliverable:** Can query restaurants from database

**Status:** ✅ Complete

---

### Sprint 1: Core Workflow ✅ COMPLETE (3-4 days)
**Goal:** KAM can see restaurants and track conversions

**Deliverable:** KAM can log in, see their restaurants, mark as approached/converted

**Status:** ✅ Complete

---

### Sprint 2: Discount Management ⚠️ REQUIRED (3-4 days)
**Goal:** KAMs can edit and activate discounts

**Tasks:**
1. Make discount fields editable
2. Add save functionality
3. Create activation dialog
4. Implement "Activate" button
5. Log activation events
6. Add bulk activation

**Deliverable:** KAM can edit discounts and activate them without Google Sheets

**Status:** ❌ Not Started

---

### Sprint 3: Advanced Filtering ⚠️ REQUIRED (2-3 days)
**Goal:** KAMs can efficiently filter 200+ restaurants

**Tasks:**
1. Add drive type filter
2. Add status filter
3. Add OV range slider
4. Add multi-select filters
5. Add save filter presets

**Deliverable:** KAM can filter restaurants by multiple criteria

**Status:** ❌ Not Started

---

### Sprint 4: Real Analytics ⚠️ REQUIRED (3-4 days)
**Goal:** Real-time analytics for KAMs and Zonal Heads

**Tasks:**
1. Create database functions for metrics
2. Create useKAMStats() hook
3. Create useZonalStats() hook
4. Update analytics pages with real data
5. Add historical trend charts
6. Add real-time updates

**Deliverable:** All analytics show real data, no mock data

**Status:** ❌ Not Started (currently using mock data)

---

### Sprint 5: Google Sheets Sync ⚠️ REQUIRED (3-5 days)
**Goal:** Automated daily data sync

**Tasks:**
1. Set up n8n workflow
2. Configure Google Sheets API
3. Create sync logic
4. Implement data validation
5. Add incremental updates
6. Set up daily schedule

**Deliverable:** Data syncs automatically from Google Sheets daily

**Status:** ❌ Not Started

---

### Sprint 6: Production Polish 📊 RECOMMENDED (2-3 days)
**Goal:** Complete remaining features

**Tasks:**
1. Implement Promo/Task/Notes CRUD
2. Add export to Excel
3. Add email notifications
4. Performance optimization
5. Error handling
6. Security audit

**Deliverable:** Production-ready system with all features

**Status:** ❌ Not Started
2. Create analytics hooks
3. Update KAM Analytics with real data
4. Update Zonal Head View with real data
5. Add real-time updates

**Deliverable:** All screens show real data, no mock data

---

## 🔗 Useful Links

**Supabase:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- SQL Editor: https://supabase.com/dashboard/project/_/sql

**React Query:**
- Docs: https://tanstack.com/query/latest/docs/react/overview

**shadcn/ui:**
- Components: https://ui.shadcn.com/docs/components

**Tailwind CSS:**
- Docs: https://tailwindcss.com/docs

---

## 📝 Key Files to Know

**Configuration:**
- `.env.local` - Environment variables (create this!)
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind configuration

**Source Code:**
- `src/App.tsx` - Main app with routing
- `src/lib/supabase.ts` - Supabase client
- `src/pages/KAMHub.tsx` - KAM Hub screen (needs real data)
- `src/pages/RestaurantDetail.tsx` - Restaurant detail (needs real data)

**Documentation:**
- `PROJECT-GOALS.md` - Business context
- `CURRENT-STATE.md` - What's built
- `IMPLEMENTATION-PLAN.md` - Sprint breakdown
- `SPRINT-0-FOUNDATION.md` - Setup guide

**Reference:**
- `sample-data.csv` - Data structure
- `archive/zomato/docs/02-DATABASE-SCHEMA.md` - Full schema details

---

## ❓ FAQ

**Q: Where do I start?**  
A: Read README.md → PROJECT-GOALS.md → CURRENT-STATE.md → IMPLEMENTATION-PLAN.md → SPRINT-0-FOUNDATION.md

**Q: What's already built?**  
A: All UI screens with mock data. No backend.

**Q: What needs to be built?**  
A: Authentication, database, API hooks, conversion tracking, analytics.

**Q: How long will it take?**  
A: 7-10 days for MVP (Sprint 0: 2-3 days, Sprint 1: 3-4 days, Sprint 2: 2-3 days)

**Q: Can I skip Sprint 0?**  
A: No. Sprint 0 blocks Sprint 1, Sprint 1 blocks Sprint 2. Must do in order.

**Q: Where are the old Lovable repos?**  
A: In root directory (drive-focus-view, drive-kam-central, etc.). Don't use them - use `src/` folder.

**Q: Why are there so many documentation files?**  
A: We cleaned up! Down from 31+ files to 9 core files.

---

**Last Updated:** November 9, 2025  
**Questions?** Check IMPLEMENTATION-PLAN.md or SPRINT-0-FOUNDATION.md

