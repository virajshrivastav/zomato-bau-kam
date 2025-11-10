# Zomato Drive Dashboard - Complete Project Overview

## What This System Is

**A centralized MVP dashboard for viewing and managing Google Sheets data** for Zomato's restaurant partnership drives.

### Core Purpose
KAMs (Key Account Managers) currently manage 200+ restaurants across multiple Google Sheets with 50+ columns each. This dashboard provides a better UI to view, navigate, and track this data in one place.

### System Type
**MVP Dashboard** - View-only interface with basic tracking capabilities. Google Sheets remains the source of truth.

---

## Business Context

### The Problem
- **Data Fragmentation**: Same restaurant appears in 3 different sheets (Discount Drive, Menu Drive, Ad Drive)
- **Manual Tracking**: KAMs manually update "Approached" and "Converted" columns
- **Poor Visibility**: No consolidated view of multi-drive opportunities
- **Inefficiency**: KAMs contact same restaurant 3 times instead of once

### The Solution
One dashboard where KAMs can:
1. View all their restaurants in one place
2. See which restaurants are in multiple drives
3. Track approached/converted status with one click
4. Search and filter efficiently
5. View analytics and performance metrics

### Success Metrics
- 80% reduction in manual tracking time
- 50% reduction in duplicate restaurant contacts
- 15% improvement in conversion rates
- 90%+ daily active usage

---

## What Has Been Built

### Authentication System
- Email/password login with Supabase Auth
- Google OAuth with domain restriction (@zomato.com)
- Session management with auto-refresh
- Protected routes
- Row Level Security (RLS) - KAMs see only their data

### Database & Backend
- Supabase PostgreSQL database
- 4 tables: restaurants, drives, drive_data, conversion_tracking
- 10 sample restaurants loaded
- 3 active drives (NCN, N2R, MRP)
- RLS policies active

### Functional Screens (7)
- Auth Page (Login/Signup)
- Main Dashboard (BAU Dashboard with metrics)
- KAM Hub (Restaurant portfolio view)
- Restaurant Detail (Conversion tracking)
- KAM Analytics (Performance charts with mock data)
- Zonal Head View (Team performance with mock data)
- Live Sprints (Leaderboard with mock data)

### Core Workflows
- Real-time search by restaurant name, locality, cuisine
- Mark restaurants as "Approached" for each drive
- Mark restaurants as "Converted" for each drive
- All actions logged with timestamps
- Automatic UI updates (React Query)

---

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **API**: Supabase REST API (auto-generated)
- **Security**: Row Level Security (RLS)

### Development
- **Package Manager**: npm
- **TypeScript**: 100% coverage
- **Linting**: ESLint
- **Formatting**: Prettier

---

## Project Structure

```
zomato-loveable/
├── src/
│   ├── components/          # 21 custom + 48 shadcn/ui components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AppSidebar.tsx  # Navigation with logout
│   │   ├── DashboardLayout.tsx
│   │   ├── SearchBar.tsx
│   │   ├── StatusPill.tsx
│   │   └── ...
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/
│   │   ├── useRestaurants.ts  # Restaurant data hooks
│   │   ├── useDrives.ts       # Drive data hooks
│   │   └── use-toast.ts
│   ├── pages/
│   │   ├── Auth.tsx           # Login/Signup
│   │   ├── MainDashboard.tsx  # BAU Dashboard
│   │   ├── KAMHub.tsx         # Restaurant portfolio
│   │   ├── RestaurantDetail.tsx
│   │   ├── KAMAnalytics.tsx
│   │   ├── ZonalHeadView.tsx
│   │   └── LiveSprints.tsx
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   └── utils.ts
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── supabase-setup.sql      # Database setup script
├── .env.local              # Environment variables (not in git)
├── package.json
└── vite.config.ts
```

---

## Key Features Breakdown

### 1. Authentication & Authorization
- Email/password authentication
- Google OAuth with @zomato.com domain restriction
- Test email whitelist for development
- Session persistence
- Protected routes
- Row Level Security (database-level filtering)

### 2. KAM Hub (Restaurant Portfolio)
- View all assigned restaurants (filtered by KAM email)
- Real-time search (name, locality, cuisine)
- Smart status indicators:
  - **Best**: Converted in at least one drive
  - **Approached**: Approached but not converted
  - **Good**: High revenue (Sept OV > 60K)
  - **Pending**: Not yet approached
- Multi-drive badges (shows how many drives restaurant is in)
- Click to view restaurant details

### 3. Restaurant Detail Page
- Restaurant header with key metrics
- Active drives tracking card
- "Mark as Approached" button for each drive
- "Mark as Converted" button for each drive
- Visual status badges (Pending → Approached → Converted)
- Promos card (active and suggested)
- Tasks card
- Notes card
- All actions logged to conversion_tracking table

### 4. Main Dashboard (BAU Dashboard)
- Current/Live Drives with rankings
- City View, Zone View, KAM View
- Past Drives, Upcoming Drives
- Performance Metrics (extended section)
- Quick navigation to Live Sprints and Analytics

### 5. Analytics Screens
- KAM Analytics: Personal performance charts
- Zonal Head View: Team performance table
- Live Sprints: Leaderboard with podium display

---

## Data Model

### Tables

**1. restaurants** (Master Data)
- res_id (PK)
- res_name, cuisine, locality
- kam_name, kam_email, tl_email
- account_type, sept_ov (September Order Volume)
- created_at, updated_at

**2. drives** (Campaign Data)
- id (PK)
- drive_name, drive_type, city
- start_date, end_date, status
- created_at

**3. drive_data** (Restaurant-Drive Assignments)
- id (PK)
- res_id (FK), drive_id (FK)
- um, mm, la (customer segments)
- la_base_code_suggested, mm_base_code_suggested, um_base_code_suggested
- la_active_promos, mm_active_promos, um_active_promos
- approached (boolean), converted_stepper (boolean)
- priority_score
- last_updated

**4. conversion_tracking** (Audit Trail)
- id (PK)
- res_id (FK), drive_id (FK)
- kam_email
- action_type ('approached' or 'converted')
- action_date, notes
- created_at

### Row Level Security (RLS)
- KAMs see only restaurants where kam_email matches their email
- KAMs can only update drive_data for their restaurants
- KAMs can only insert conversion_tracking for their email
- Everyone can see all drives

---

## User Roles

### 1. KAM (Key Account Manager) - Primary User
- Manages 200 restaurants
- Handles 3 active drives
- Daily tasks: Call restaurants, activate discounts, track conversions
- **Needs**: See all restaurants in one list, mark approached/converted, view conversion %

### 2. Zonal Head - Secondary User
- Oversees 5 KAMs in a zone
- Conducts weekly performance reviews
- **Needs**: Team summary dashboard, KAM leaderboard, drive performance comparison

### 3. Central Ops Analyst - Tertiary User
- Analyzes city-wide drive performance
- **Needs**: City-level aggregation, historical trends, export to BI tools

---

## Test Accounts

```
Email: shiv.kumar@zomato.com
Password: zomato123
Restaurants: 3 (Viraj, Snehil, Rakesh)

Email: amdeep.singh@zomato.com
Password: zomato123
Restaurants: 3 (Priya, Ananya, Rohan)

Email: shrawani.patil@zomato.com
Password: zomato123
Restaurants: 2 (Kavya, Arjun)

Email: rutuja.deshmukh@zomato.com
Password: zomato123
Restaurants: 2 (Neha, Siddharth)
```

---

## Final Goal

### System Goal
A fully functional dashboard that:
- Integrates with Google Sheets as the source of truth
- Provides KAMs with a better UI to view and manage restaurant data
- Tracks approached/converted status for each restaurant-drive combination
- Shows analytics and performance metrics
- Reduces manual tracking time by 80%
- Improves conversion rates by 15%

### Target Users
- **Primary**: KAMs managing 200+ restaurants across multiple drives
- **Secondary**: Zonal Heads overseeing team performance
- **Tertiary**: Central Ops Analysts analyzing city-wide performance

### Success Metrics
- 90%+ KAM daily active usage
- 80% reduction in manual tracking time
- 15% improvement in conversion rates
- 99%+ data accuracy vs. source sheets

