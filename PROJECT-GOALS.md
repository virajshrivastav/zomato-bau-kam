# 🎯 Zomato Drive Dashboard - Project Goals & Business Context

**Last Updated:** November 10, 2025
**System Type:** MVP Dashboard
**Status:** Foundation Document - Read This First

---

## ⚠️ CRITICAL: MVP Dashboard Requirements

**This IS an MVP.** This is a **dashboard to view and navigate Google Sheets data** in a better UI.

**Key MVP Goals:**
- ✅ Display data from Google Sheets in an easy-to-navigate interface
- ✅ Google Sheets remains the source of truth and data storage
- ✅ Provide better UX for viewing restaurant data, drives, and metrics
- ✅ Enable basic tracking (approached/converted status)
- ✅ Support filtering and search for efficient navigation
- ✅ Show analytics and performance metrics from the data
- ✅ Integrate with Google Sheets API to read data

**Success Criteria:** KAMs can easily view and navigate their Google Sheets data without opening multiple sheets.

---

## 📋 Executive Summary

**What:** A centralized MVP dashboard that **displays Google Sheets data** in an easy-to-navigate interface for managing restaurant partnership drives.

**Why:** KAMs currently manage 5-10 Google Sheets with 50+ columns each, leading to inefficiency and poor visibility. **They need a better way to view and navigate this data.**

**Who:** 
- **Primary Users:** Key Account Managers (KAMs) - Daily execution
- **Secondary Users:** Zonal Heads - Team performance monitoring
- **Tertiary Users:** Central Ops - Strategic analysis

**Success:** 80% reduction in manual tracking time, 15% improvement in conversion rates, 90%+ daily active usage.

---

## 🔥 The Core Problem

### Current Workflow (Google Sheets)

KAMs like "Shiv Kumar" manage restaurants across multiple drives:

```
Sheet 1: "Special 35" Discount Drive (200 restaurants)
Sheet 2: "Menu Photoshoot" Drive (150 restaurants)
Sheet 3: "Ad Boost" Drive (180 restaurants)
```

**Each sheet has 50+ columns:**
- Restaurant metadata (ID, name, cuisine, locality)
- KAM assignments (AM Name, AM Email, TL Email)
- Order volume metrics (Sept OV, UM, MM, LA segments)
- Active promotions (la_active_promos, mm_active_promos)
- System-suggested discounts (la_base_code_suggested)
- Conversion tracking (Approached, Converted for Stepper)
- Priority scores

### Pain Points

1. **Data Fragmentation**
   - Same restaurant appears in 3 different sheets
   - KAM contacts restaurant 3 separate times (inefficient)
   - No visibility into multi-drive opportunities

2. **Manual Tracking**
   - KAM manually updates "Approached" column after calling
   - KAM manually updates "Converted" after activation
   - No timestamp, no audit trail

3. **Poor Analytics**
   - Conversion rate = manual formula in sheet
   - No historical trends
   - No KAM performance comparison

4. **Scalability Issues**
   - Google Sheets slow with 1000+ rows
   - Formula errors break calculations
   - Version control nightmare

---

## 💡 The Solution

### Core Vision

**"One dashboard to view all drive data in one place"**

A KAM logs in and sees:

```
┌─────────────────────────────────────────────────────────┐
│  KAM Hub - Shiv Kumar                                   │
├─────────────────────────────────────────────────────────┤
│  📊 Your Stats Today:                                   │
│  • 15 restaurants approached                            │
│  • 8 converted (53% conversion rate)                    │
│  • 42 pending contacts                                  │
├─────────────────────────────────────────────────────────┤
│  🏪 Your Restaurants (200 total)                        │
│                                                          │
│  🔴 Viraj Restaurant                    [View Details]  │
│     OV: ₹75K | Koregaon Park                            │
│     🎯 In 3 drives: Special 35, Menu, Ads               │
│     Status: Pending                                     │
│     [Mark Approached] [Mark Converted]                  │
│                                                          │
│  🟢 Spice Garden                        [View Details]  │
│     OV: ₹45K | Viman Nagar                              │
│     🎯 In 2 drives: Special 35, Menu                    │
│     Status: Converted ✓                                 │
│                                                          │
│  🟡 The Breakfast Club                  [View Details]  │
│     OV: ₹62K | Kalyani Nagar                            │
│     🎯 In 1 drive: Special 35                           │
│     Status: Approached (2 hours ago)                    │
│     [Mark Converted]                                    │
└─────────────────────────────────────────────────────────┘
```

### Key Features

1. **Multi-Drive Visibility**
   - Instantly see which restaurants are in multiple drives
   - Contact once for all drives (save time)

2. **One-Click Actions**
   - "Mark as Approached" → timestamp saved
   - "Mark as Converted" → conversion tracked
   - No manual sheet updates

3. **Real-Time Analytics**
   - Live conversion rate (updates instantly)
   - Daily/weekly/monthly trends
   - KAM vs. team comparison

4. **Smart Prioritization**
   - High OV + Not Approached = Top priority
   - Multi-drive restaurants = High value
   - AI-powered ranking (future)

---

## 👥 User Personas

### 1. Shiv Kumar - Key Account Manager (Primary User)

**Profile:**
- Manages 200 restaurants in Pune
- Handles 3 active drives: Special 35, Menu Photoshoot, Ad Boost
- Daily tasks: Call restaurants, activate discounts, track conversions

**Current Pain:**
- Opens 3 Google Sheets every morning
- Manually searches for restaurant across sheets
- Forgets which restaurants are in multiple drives
- Updates "Approached" column manually (tedious)

**Dashboard Need:**
- See all 200 restaurants in one list
- Filter by drive, status, OV range
- Click "Mark Approached" button (instant)
- See conversion % update in real-time

**Success Metric:** Saves 2 hours/day on data management

---

### 2. Samrudhh Bhave - Zonal Head (Secondary User)

**Profile:**
- Oversees 5 KAMs in Pune zone
- Conducts weekly performance reviews
- Calculates monthly incentives

**Current Pain:**
- No consolidated view of team performance
- Manually compiles data from 5 KAMs' sheets
- Difficult to identify underperformers early

**Dashboard Need:**
- Team summary dashboard
- KAM-wise leaderboard (conversion %)
- Drive performance comparison
- Exportable reports

**Success Metric:** 90% reduction in report generation time

---

### 3. Central Ops Analyst (Tertiary User)

**Profile:**
- Analyzes city-wide drive performance
- Identifies best practices
- Provides strategic recommendations

**Current Pain:**
- Data scattered across 20+ regional sheets
- Inconsistent formats
- No historical data

**Dashboard Need:**
- City-level aggregation
- Historical trend charts
- Drive type comparison
- Export to BI tools

**Success Metric:** 50% faster strategic analysis

---

## 🎯 Functional Requirements (MVP)

### Must-Have Features

1. **Authentication & Authorization**
   - Email-based login (shiv.kumar@zomato.com)
   - Role-based access (KAM sees only their restaurants)
   - Zonal Head sees all KAMs in their zone

2. **KAM Dashboard**
   - Restaurant list filtered by logged-in KAM
   - Show multi-drive indicators
   - Display: Name, OV, Locality, Drives, Status
   - Search and filter (by drive, status, OV range)

3. **Conversion Tracking**
   - "Mark as Approached" button → saves timestamp
   - "Mark as Converted" button → saves timestamp
   - Display conversion % (today, this week, overall)
   - Audit trail (who, when, what)

4. **Restaurant Detail View**
   - All drives this restaurant is in
   - Active promotions
   - Suggested discounts
   - Conversion history
   - Notes section

5. **Basic Analytics**
   - KAM personal stats (approached, converted, %)
   - Daily trend chart
   - Priority list (high OV + not approached)

6. **Zonal Head Dashboard**
   - Team summary (total approached, converted)
   - KAM-wise leaderboard
   - Drive performance comparison

### Data Requirements

**Source:** Google Sheets (via Google Sheets API)

**Core Data (Read from Google Sheets):**
- Restaurants (res_id, res_name, cuisine, locality, OV)
- KAM assignments (AM Name, AM Email, TL Email)
- Drives (drive name, drive type, date range)
- Drive assignments (restaurant + drive + suggested discount)
- Active promotions and metrics

**Dashboard-Specific Data (Stored in Database):**
- Conversion events (timestamp, action, KAM)
- User sessions and authentication
- Notes and tracking data

---

## 📊 Success Metrics

### Adoption Metrics
- ✅ 90%+ KAM daily active usage within 1 month
- ✅ 80%+ Zonal Head weekly usage
- ✅ <5 minutes training time per user

### Efficiency Metrics
- ✅ 80% reduction in time spent on manual tracking
- ✅ 50% reduction in duplicate restaurant contacts
- ✅ 90% reduction in report generation time

### Business Metrics
- ✅ 15% improvement in conversion rates (through prioritization)
- ✅ 20% increase in multi-drive conversions
- ✅ 99%+ data accuracy vs. source sheets

---

## 🚫 Out of Scope (For MVP)

- ❌ Editing data in Google Sheets (view-only for MVP)
- ❌ Discount activation API integration
- ❌ Mobile native app (responsive web only)
- ❌ AI prioritization (use existing priority scores from sheets)
- ❌ Email/Slack notifications (future phase)
- ❌ Replacing Google Sheets as data source (Google Sheets remains source of truth)

---

## 🎯 The North Star

**End Goal:** A KAM can view and navigate all their restaurant drive data in one easy-to-use dashboard.

**How We'll Know We Succeeded:**
- KAMs prefer using the dashboard over opening multiple Google Sheets
- Time spent searching for restaurant data reduced by 50%+
- Conversion tracking is easier and more accurate
- Zonal Heads use dashboard for weekly reviews
- Better visibility into multi-drive opportunities

---

**Next:** See [CURRENT-STATE.md](CURRENT-STATE.md) for what's already built.

