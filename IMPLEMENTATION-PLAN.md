# 🗺️ Implementation Plan - MVP Dashboard

**Last Updated:** November 10, 2025
**System Type:** MVP Dashboard
**Method:** Reason backwards from business endpoint to current state

---

## ✅ IMPORTANT: This is an MVP Dashboard

**This IS an MVP.** This is a **dashboard to view and navigate Google Sheets data** with better UX.

**Key Features:**
- ✅ View restaurants from Google Sheets in one place
- ✅ Track conversions (approached/converted)
- ✅ Search and filter restaurants
- ✅ Display analytics and metrics
- ✅ Support multiple user roles (KAMs, Zonal Heads)
- 📊 Recommended: Google Sheets API integration for live data

**Timeline:** 5-7 days (Sprints 0-1) for core MVP, 2-3 days for Google Sheets integration

---

## 🎯 The Endpoint (North Star)

**Business Goal:** KAM Shiv can view and navigate all his restaurant drive data **in one easy-to-use dashboard** instead of opening multiple Google Sheets.

**What This Means:**
1. Shiv logs in with his email
2. Sees only HIS 200 restaurants (not all 1000+ in database)
3. Sees which restaurants are in multiple drives
4. **Views drive data** from Google Sheets in organized interface
5. Clicks "Mark as Approached" → timestamp saved in dashboard
6. Clicks "Mark as Converted" → conversion tracked in dashboard
7. **Searches and filters** restaurants to find what he needs
8. Sees his **conversion rate** displayed in analytics
9. Zonal Head Samrudhh sees Shiv's **performance** vs. team
10. **Data comes from Google Sheets** (source of truth)
11. **Google Sheets remains** the primary data storage

---

## 🔄 Backwards Reasoning

### Layer 5: Analytics (Endpoint)
**What:** Shiv sees "53% conversion rate today"

**Requires:**
- Conversion events table with timestamps
- Database function to calculate: `converted_count / approached_count`
- API hook: `useKAMStats(kam_email)`
- Chart component with real data

**Blocks:** Nothing (this is the endpoint)

---

### Layer 4: Actions (Conversion Tracking)
**What:** Shiv clicks "Mark as Approached" → timestamp saved

**Requires:**
- `conversion_tracking` table
- Mutation hook: `useMarkApproached(res_id, kam_email)`
- Button with onClick handler
- Optimistic UI update

**Blocks:** Layer 5 (Analytics) - Can't calculate conversion rate without conversion events

---

### Layer 3: Data Display (Restaurant List)
**What:** Shiv sees his 200 restaurants

**Requires:**
- `restaurants` table with `kam_email` column
- `drive_data` table with restaurant-drive assignments
- Query hook: `useRestaurants(kam_email)`
- Filter: `WHERE kam_email = 'shiv.kumar@zomato.com'`

**Blocks:** Layer 4 (Actions) - Can't mark restaurant as approached if can't see it

---

### Layer 2: Data Layer (Database)
**What:** Database has restaurant data

**Requires:**
- Supabase project created
- 4 tables created (restaurants, drives, drive_data, conversion_tracking)
- Sample data loaded from `sample-data.csv`
- RLS policies (KAM sees only their restaurants)

**Blocks:** Layer 3 (Data Display) - Can't query data that doesn't exist

---

### Layer 1: Identity Layer (Authentication)
**What:** System knows Shiv is logged in

**Requires:**
- Supabase Auth configured
- `users` table with KAM emails
- Login form with email/password
- Auth context: `useAuth()` hook
- Protected routes

**Blocks:** Layer 2 (Data Layer) - Can't filter by KAM email if don't know who's logged in

---

### Layer 0: Foundation (Infrastructure)
**What:** Project can connect to backend

**Requires:**
- Supabase project created
- Environment variables configured (`.env.local`)
- Supabase client initialized
- TanStack Query provider setup

**Blocks:** Layer 1 (Identity) - Can't authenticate if no backend connection

---

## 📋 Sprint Breakdown (MVP + Optional Enhancements)

### Sprint 0: Foundation (2-3 days) ✅ COMPLETE
**Goal:** Backend infrastructure ready

**Tasks:**
1. ✅ Create Supabase project
2. ✅ Configure environment variables
3. ✅ Set up database schema (4 tables)
4. ✅ Load sample data
5. ✅ Create KAM user accounts
6. ✅ Test database connection

**Deliverable:** Can query restaurants from database in browser console

**Status:** ✅ Complete

---

### Sprint 1: Core Workflow (3-4 days) ✅ COMPLETE
**Goal:** KAM can see their restaurants and track conversions

**Tasks:**
1. ✅ Implement authentication (login/logout)
2. ✅ Create API hooks (`useRestaurants`, `useMarkApproached`, `useMarkConverted`)
3. ✅ Update KAM Hub to use real data
4. ✅ Update Restaurant Detail to use real data
5. ✅ Implement conversion tracking buttons
6. ✅ Add optimistic UI updates
7. ✅ Add search and filter functionality
8. ✅ Add analytics display

**Deliverable:** KAM can log in, see their restaurants, mark as approached/converted

**Status:** ✅ Complete - **MVP READY**

---

### Sprint 2: Google Sheets Integration (2-3 days) 📊 RECOMMENDED
**Goal:** Connect dashboard to Google Sheets API for live data

**Tasks:**
1. Set up Google Sheets API access
2. Create sync logic to read restaurant data from sheets
3. Create sync logic to read drive data from sheets
4. Implement data transformation from sheets to database
5. Add periodic or on-demand sync functionality
6. Add sync status monitoring

**Deliverable:** Dashboard displays live data from Google Sheets

**Verification:**
- Data syncs from Google Sheets to database
- Dashboard shows current Google Sheets data
- Can trigger manual sync or automatic periodic sync

**Blockers:** Sprint 1 must be complete

**Why Recommended:** Connects dashboard to actual data source instead of sample data

---

### Sprint 3: Enhanced Filtering (1-2 days) 📊 OPTIONAL
**Goal:** Add advanced filtering options for better navigation

**Tasks:**
1. Add drive type filter dropdown (Discount, Menu, Ads)
2. Add status filter (Pending, Approached, Converted, All)
3. Add OV range slider (₹0 - ₹100K)
4. Add multi-select filters
5. Add "Clear All Filters" button

**Deliverable:** KAM can filter restaurants by multiple criteria

**Verification:**
- Filter by "Discount Drive" + "Pending" + "OV > ₹50K" → shows only matching restaurants
- Clear filters → shows all restaurants

**Blockers:** Sprint 1 must be complete

**Why Optional:** Basic search is sufficient for MVP

---

### Sprint 4: Real Analytics Calculations (2-3 days) 📊 OPTIONAL
**Goal:** Calculate real-time analytics from tracking data

**Tasks:**
1. Create database functions for metrics calculation
2. Create `useKAMStats()` hook for real conversion data
3. Create `useZonalStats()` hook for team performance
4. Update KAM Analytics with calculated data
5. Update Zonal Head View with calculated data
6. Add historical trend charts (daily, weekly, monthly)

**Deliverable:** All analytics show calculated data from tracking

**Verification:**
- KAM Analytics shows real conversion rate from database
- Zonal Head View shows real KAM rankings
- Mark restaurant as converted → conversion rate updates

**Blockers:** Sprint 1 must be complete

**Why Optional:** Sample data demonstrates the concept

---

### Sprint 5: Promo/Task/Notes CRUD (1-2 days) 📊 OPTIONAL
**Goal:** Add ability to create/edit notes and tasks in dashboard

**Tasks:**
1. Add notes table to database
2. Create API hooks for notes CRUD
3. Create API hooks for tasks CRUD
4. Update Restaurant Detail page with edit functionality
5. Add validation and error handling

**Deliverable:** Can add/edit notes and tasks from dashboard

**Verification:**
- Add note to restaurant → saves and displays
- Edit task → updates in database
- Delete note → removes from display

**Blockers:** Sprint 1 must be complete

**Why Optional:** Viewing is sufficient for MVP

---

### Sprint 6: Export & Polish (1-2 days) 📊 OPTIONAL
**Goal:** Add export functionality and polish UX

**Tasks:**
1. Add export to Excel/CSV functionality
2. Performance optimization (lazy loading, caching)
3. Enhanced error handling and logging
4. Add loading states improvements
5. UX polish and refinements

**Deliverable:** Enhanced MVP with export and better UX

**Verification:**
- Export restaurant list → downloads Excel file
- Dashboard loads quickly
- All errors handled gracefully

**Blockers:** Sprint 1 must be complete

**Why Optional:** Not required for MVP

---

## 🎯 Critical Path (Dependencies)

```
Sprint 0: Foundation ✅
    ↓
Sprint 1: Core Workflow ✅ (MVP COMPLETE)
    ↓
    ├─→ Sprint 2: Google Sheets Integration 📊 (RECOMMENDED)
    ├─→ Sprint 3: Enhanced Filtering 📊 (OPTIONAL)
    ├─→ Sprint 4: Real Analytics Calculations 📊 (OPTIONAL)
    ├─→ Sprint 5: Promo/Task/Notes CRUD 📊 (OPTIONAL)
    └─→ Sprint 6: Export & Polish 📊 (OPTIONAL)
```

**Sprints 2-6 can run in parallel** after Sprint 1 is complete.
**All optional sprints are independent** and can be done in any order.

---

## 📊 Detailed Sprint Plans

### Sprint 0: Foundation

#### Task 1: Create Supabase Project (30 min)
1. Go to supabase.com
2. Create new project: "zomato-drive-dashboard"
3. Choose region: Mumbai (closest to users)
4. Save database password

#### Task 2: Configure Environment (15 min)
1. Copy `.env.example` to `.env.local`
2. Add Supabase URL and anon key
3. Test connection: `npm run dev`

#### Task 3: Create Database Schema (1 hour)
1. Open Supabase SQL Editor
2. Run schema from `archive/zomato/docs/02-DATABASE-SCHEMA.md`
3. Verify tables created

**Tables:**
- `restaurants` (res_id, res_name, kam_email, cuisine, locality, sept_ov)
- `drives` (drive_id, drive_name, drive_type, start_date, end_date)
- `drive_data` (res_id, drive_id, approached, converted_stepper, priority_score)
- `conversion_tracking` (id, res_id, drive_id, kam_email, action, timestamp)

#### Task 4: Load Sample Data (1 hour)
1. Convert `sample-data.csv` to SQL INSERT statements
2. Run in SQL Editor
3. Verify: `SELECT COUNT(*) FROM restaurants` → 10 rows

#### Task 5: Create KAM Users (30 min)
1. Create auth users for 4 KAMs:
   - shiv.kumar@zomato.com
   - amdeep.singh@zomato.com
   - shrawani.patil@zomato.com
   - rutuja.deshmukh@zomato.com
2. Password: `zomato123` (change in production)

#### Task 6: Set Up RLS Policies (1 hour)
1. Enable RLS on all tables
2. Policy: KAM sees only their restaurants
   ```sql
   CREATE POLICY "KAMs see own restaurants"
   ON restaurants FOR SELECT
   USING (kam_email = auth.jwt() ->> 'email');
   ```

**Sprint 0 Complete:** Backend ready for integration

---

### Sprint 1: Core Features

#### Task 1: Implement Authentication (2 hours)
1. Create `src/contexts/AuthContext.tsx`
2. Create `src/hooks/useAuth.ts`
3. Update `MainDashboard.tsx` with real login
4. Add logout button to KAM Hub
5. Protect routes (redirect to `/` if not logged in)

#### Task 2: Create API Hooks (2 hours)
1. `src/hooks/useRestaurants.ts`
   ```typescript
   export const useRestaurants = (kamEmail: string) => {
     return useQuery({
       queryKey: ['restaurants', kamEmail],
       queryFn: async () => {
         const { data } = await supabase
           .from('restaurants')
           .select('*, drive_data(*)')
           .eq('kam_email', kamEmail)
         return data
       }
     })
   }
   ```

2. `src/hooks/useMarkApproached.ts`
3. `src/hooks/useMarkConverted.ts`

#### Task 3: Update KAM Hub (2 hours)
1. Replace hardcoded `restaurants` array
2. Use `useRestaurants(user.email)`
3. Add loading state
4. Add error handling

#### Task 4: Update Restaurant Detail (2 hours)
1. Fetch restaurant by ID
2. Show real drives
3. Show real promos
4. Add "Mark as Approached" button

#### Task 5: Implement Conversion Tracking (3 hours)
1. Add mutation hooks
2. Add onClick handlers
3. Add optimistic updates
4. Add toast notifications
5. Test: Mark → Refresh → Status persists

**Sprint 1 Complete:** Core KAM workflow works

---

### Sprint 2: Analytics

#### Task 1: Create Database Functions (2 hours)
1. `get_kam_stats(kam_email)` - Returns approached, converted, conversion_rate
2. `get_zonal_stats(zone)` - Returns team performance
3. Test in SQL Editor

#### Task 2: Create Analytics Hooks (1 hour)
1. `src/hooks/useKAMStats.ts`
2. `src/hooks/useZonalStats.ts`

#### Task 3: Update KAM Analytics (2 hours)
1. Replace hardcoded `barData`
2. Use real conversion data
3. Update charts with real metrics

#### Task 4: Update Zonal Head View (2 hours)
1. Replace hardcoded `kamData`
2. Use `useZonalStats()`
3. Show real KAM performance

#### Task 5: Add Real-Time Updates (2 hours)
1. Enable Supabase Realtime
2. Subscribe to conversion_tracking changes
3. Invalidate queries on change
4. Test: Mark converted → Chart updates instantly

**Sprint 2 Complete:** All screens show real data

---

## ✅ Success Criteria

### Sprint 0 ✅ COMPLETE
- [x] Can log into Supabase dashboard
- [x] Can see 4 tables with data
- [x] Can query restaurants in SQL Editor
- [x] RLS policies block unauthorized access

### Sprint 1 ✅ COMPLETE
- [x] Can log in as shiv.kumar@zomato.com
- [x] See only Shiv's restaurants (not all)
- [x] Click "Mark as Approached" → timestamp saved
- [x] Refresh page → status persists
- [x] Log out → redirected to login

### Sprint 2 (Discount Management) ⚠️ REQUIRED
- [ ] Can edit la_base_code_suggested field
- [ ] Can edit mm_base_code_suggested field
- [ ] Can edit um_base_code_suggested field
- [ ] Changes save to database
- [ ] "Activate" button appears for each drive
- [ ] Activation dialog shows confirmation
- [ ] Activation logged to database with timestamp
- [ ] Can activate for multiple drives at once

### Sprint 3 (Advanced Filtering) ⚠️ REQUIRED
- [ ] Drive type filter works (Discount, Menu, Ads)
- [ ] Status filter works (Pending, Approached, Converted)
- [ ] OV range slider filters correctly
- [ ] Multiple filters work together
- [ ] Can save filter presets
- [ ] Can clear all filters

### Sprint 4 (Real Analytics) ⚠️ REQUIRED
- [ ] KAM Analytics shows real conversion rate (not mock)
- [ ] Zonal Head View shows real KAM rankings (not mock)
- [ ] Charts show real historical data
- [ ] Mark converted → conversion rate updates instantly
- [ ] No mock data anywhere

### Sprint 5 (Google Sheets Sync) ⚠️ REQUIRED
- [ ] n8n workflow configured
- [ ] Google Sheets API connected
- [ ] Daily sync runs automatically
- [ ] Data validation works
- [ ] Sync errors are logged and alerted
- [ ] Can view sync status in dashboard

### Sprint 6 (Production Polish) � RECOMMENDED
- [ ] Can add/edit notes for restaurants
- [ ] Can add/edit tasks for restaurants
- [ ] Can export restaurant list to Excel
- [ ] Daily email summary sent to KAMs
- [ ] Dashboard loads in <2 seconds
- [ ] All errors handled gracefully

---

## 📊 Production Readiness Checklist

### Core Features (Must-Have)
- [x] Authentication & Authorization
- [x] View restaurants (filtered by KAM)
- [x] Conversion tracking (approached/converted)
- [ ] **Discount editing** ⚠️ Sprint 2
- [ ] **Discount activation** ⚠️ Sprint 2
- [ ] **Advanced filtering** ⚠️ Sprint 3
- [ ] **Real analytics** ⚠️ Sprint 4
- [ ] **Google Sheets sync** ⚠️ Sprint 5

### User Groups (Must Support)
- [x] KAMs (view & track)
- [ ] **KAMs (edit & activate)** ⚠️ Sprint 2
- [ ] **Zonal Heads (real data)** ⚠️ Sprint 4

### Data Management
- [x] Manual data entry
- [ ] **Automated sync** ⚠️ Sprint 5
- [ ] **Data validation** ⚠️ Sprint 5

### Performance & Scale
- [x] Handles 10 restaurants
- [ ] **Handles 1000+ restaurants** ⚠️ Sprint 5-6
- [ ] **Loads in <2 seconds** ⚠️ Sprint 6

---

## ⏱️ Timeline Summary

| Sprint | Duration | Status | Deliverable |
|--------|----------|--------|-------------|
| Sprint 0 | 2-3 days | ✅ Complete | Backend infrastructure |
| Sprint 1 | 3-4 days | ✅ Complete | Core workflow |
| **Sprint 2** | **3-4 days** | ⚠️ **Required** | **Discount management** |
| **Sprint 3** | **2-3 days** | ⚠️ **Required** | **Advanced filtering** |
| **Sprint 4** | **3-4 days** | ⚠️ **Required** | **Real analytics** |
| **Sprint 5** | **3-5 days** | ⚠️ **Required** | **Google Sheets sync** |
| Sprint 6 | 2-3 days | 📊 Recommended | Production polish |
| **TOTAL** | **18-26 days** | **~35% Complete** | **Production-ready system** |

---

## 🚫 Out of Scope (Future Enhancements)

These features are **NOT required** for production launch:

- ❌ AI prioritization (use static priority_score for now)
- ❌ Incentive tracker (manual calculation acceptable)
- ❌ Mobile native app (responsive web is sufficient)
- ❌ Advanced notifications (basic email is enough)
- ❌ Slack integration (email notifications sufficient)

**Rationale:** These are nice-to-haves that can be added based on user feedback after production launch.

---

## 🎯 Next Steps

### Immediate (This Week)
1. ✅ MVP is complete and ready for deployment
2. 📊 Recommended: Start Sprint 2 (Google Sheets Integration) - 2-3 days
3. Deploy MVP with live Google Sheets data

### Short-term (Next 2-3 Weeks) - Optional
1. Gather user feedback on MVP
2. Prioritize enhancements based on feedback
3. Optionally execute Sprints 3-6 as needed

### Medium-term (1-2 Months) - Future Enhancements
1. Consider adding write capabilities to Google Sheets
2. Add advanced features based on user requests
3. Expand to additional use cases

---

**Next:** See detailed sprint guides:
- [SPRINT-0-FOUNDATION.md](SPRINT-0-FOUNDATION.md) - ✅ Complete
- [SPRINT-1-COMPLETE.md](SPRINT-1-COMPLETE.md) - ✅ Complete (MVP READY)
- **SPRINT-2-GOOGLE-SHEETS-INTEGRATION.md** - 📊 Recommended
- **SPRINT-3-ENHANCED-FILTERING.md** - 📊 Optional
- **SPRINT-4-REAL-ANALYTICS.md** - 📊 Optional
- **SPRINT-5-PROMO-TASK-NOTES.md** - 📊 Optional
- **SPRINT-6-EXPORT-POLISH.md** - 📊 Optional

