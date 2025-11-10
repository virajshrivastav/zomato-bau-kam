# Zomato Drive Dashboard - Project Context

**Version:** 1.0 MVP  
**Status:** Production Ready (Core Features Complete)  
**Last Updated:** November 10, 2025

---

## Project Overview

The Zomato Drive Dashboard is a unified web application that replaces multiple Google Sheets with a single dashboard for managing restaurant partnership drives (discounts, menu photoshoots, ad boosts). The system serves Key Account Managers (KAMs), Zonal Heads, and Central Operations teams.

### Problem Statement

KAMs currently manage 5-10 different Google Sheets with 50+ columns each, manually tracking hundreds of restaurants across multiple drives. This leads to inefficiency, errors, and lack of visibility.

### Solution

A centralized dashboard where KAMs can:
- View all their restaurants in one place
- Track which restaurants are in multiple drives
- Mark restaurants as "Approached" or "Converted" with one click
- See conversion rates and analytics
- Navigate data with better UX

---

## Tech Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19
- **Routing:** React Router v6.30.1
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Styling:** Tailwind CSS 3.4.17
- **State Management:** TanStack Query 5.83.0 (React Query)
- **Icons:** Lucide React 0.462.0
- **Charts:** Recharts 2.15.4
- **Forms:** React Hook Form 7.61.1 with Zod 3.25.76

### Backend
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth with Google OAuth
- **Client Library:** @supabase/supabase-js 2.80.0

### Development
- **Package Manager:** npm
- **Dev Server Port:** 8080
- **TypeScript Config:** Relaxed mode (noImplicitAny: false, strictNullChecks: false)

---

## Application Architecture

### Route Structure

1. **`/`** - Auth Page (Login/Signup)
   - Google OAuth sign-in (primary)
   - Email/password sign-in (fallback)
   - Sign Up tab for new accounts
   - Manager Access Code feature
   - Domain restriction (@zomato.com in production)

2. **`/dashboard`** - Main Dashboard (BAU Dashboard)
   - High-level metrics and KPIs
   - Current/Live Drives overview
   - City View, Zone View, KAM View
   - Restaurant Portfolio CTA card
   - Navigation to other sections

3. **`/kam-hub`** - Restaurant Portfolio / KAM Hub
   - List of assigned restaurants (filtered by logged-in KAM)
   - Real-time search by name, locality, cuisine
   - Status pills (Best/Approached/Good/Pending)
   - Drive count badges
   - Click restaurant to view details

4. **`/restaurant/:id`** - Restaurant Detail Page
   - Restaurant overview and information
   - Active drives tags
   - Conversion tracking (Mark Approached/Converted buttons)
   - Promo management (active & suggested)
   - Task/item tracking
   - Notes and comments section

5. **`/kam-analytics`** - KAM Analytics Dashboard
   - Personal performance analytics
   - Drive-specific breakdowns (N2R, NCN, MRP, ADS)
   - Data visualizations (bar charts, pie charts)
   - Performance metrics and trends
   - **Note:** Currently uses mock data

6. **`/zonal-head-view`** - Zonal Head View
   - KPI cards (Total KAMs, Avg Conversion Rate, Avg Approach Rate, Total Drives)
   - KAM Performance Rankings Table
   - Search and sort functionality
   - Export to CSV functionality
   - **Note:** Currently uses mock data

7. **`/live-sprints`** - Live Sprints Leaderboard
   - Podium display for top performers
   - Live rankings and achievements
   - Zonal performance tracking

### Protected Routes

All routes except `/` (Auth) are protected by the `ProtectedRoute` component, which redirects unauthenticated users to the login page.

---

## Database Schema

### Tables

#### 1. `restaurants` (Master Data)
Stores master restaurant data. Each restaurant has one assigned KAM.

**Columns:**
- `res_id` (TEXT, PRIMARY KEY) - Unique restaurant identifier
- `res_name` (TEXT, NOT NULL) - Restaurant name
- `kam_name` (TEXT) - Assigned KAM name
- `kam_email` (TEXT) - Assigned KAM email
- `tl_email` (TEXT) - Team lead email
- `cuisine` (TEXT) - Cuisine type
- `locality` (TEXT) - Location/area
- `concat_field` (TEXT) - Combined locality-cuisine field
- `account_type` (TEXT) - Premium/Standard
- `sept_ov` (INTEGER) - September order value
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

#### 2. `drives` (Campaign Data)
Stores information about marketing drives/campaigns.

**Columns:**
- `id` (SERIAL, PRIMARY KEY) - Auto-incrementing ID
- `drive_name` (TEXT, NOT NULL) - Drive name (e.g., "Special 35 Discount")
- `drive_type` (TEXT) - Type of drive (Discount/Content/Marketing)
- `city` (TEXT) - Target city
- `start_date` (DATE) - Drive start date
- `end_date` (DATE) - Drive end date
- `status` (TEXT, DEFAULT 'active') - Drive status
- `created_at` (TIMESTAMPTZ) - Creation timestamp

#### 3. `drive_data` (Restaurant-Drive Assignments)
Junction table linking restaurants to drives with performance metrics.

**Columns:**
- `id` (SERIAL, PRIMARY KEY) - Auto-incrementing ID
- `res_id` (TEXT, FOREIGN KEY → restaurants.res_id) - Restaurant reference
- `drive_id` (INTEGER, FOREIGN KEY → drives.id) - Drive reference
- `um` (INTEGER, DEFAULT 0) - Upper Menu metric
- `mm` (INTEGER, DEFAULT 0) - Middle Menu metric
- `la` (INTEGER, DEFAULT 0) - Lower Area metric
- `la_base_code_suggested` (TEXT) - Suggested LA base code
- `la_step1`, `la_step2`, `la_step3` (TEXT) - LA progression steps
- `mm_base_code_suggested` (TEXT) - Suggested MM base code
- `um_base_code_suggested` (TEXT) - Suggested UM base code
- `la_active_promos`, `mm_active_promos`, `um_active_promos` (TEXT) - Active promotions
- `approached` (BOOLEAN, DEFAULT FALSE) - Whether restaurant was approached
- `converted_stepper` (BOOLEAN, DEFAULT FALSE) - Whether restaurant converted
- `priority_score` (INTEGER, DEFAULT 0) - Priority ranking
- `last_updated` (TIMESTAMPTZ) - Last update timestamp
- **UNIQUE CONSTRAINT:** (res_id, drive_id)

#### 4. `conversion_tracking` (Audit Trail)
Logs all conversion actions for audit and analytics.

**Columns:**
- `id` (SERIAL, PRIMARY KEY) - Auto-incrementing ID
- `res_id` (TEXT, FOREIGN KEY → restaurants.res_id) - Restaurant reference
- `drive_id` (INTEGER, FOREIGN KEY → drives.id) - Drive reference
- `kam_email` (TEXT, NOT NULL) - KAM who performed action
- `action_type` (TEXT, NOT NULL) - 'approached' or 'converted'
- `action_date` (TIMESTAMPTZ, DEFAULT NOW()) - When action occurred
- `notes` (TEXT) - Optional notes
- `created_at` (TIMESTAMPTZ) - Creation timestamp

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

1. **KAMs see own restaurants:** KAMs can only SELECT restaurants where `kam_email` matches their authenticated email
2. **Everyone can see drives:** All authenticated users can SELECT from drives table
3. **KAMs see own drive data:** KAMs can only SELECT drive_data for their restaurants
4. **KAMs update own drive data:** KAMs can only UPDATE drive_data for their restaurants
5. **KAMs track own conversions:** KAMs can only INSERT conversion_tracking with their email
6. **KAMs see own conversion history:** KAMs can only SELECT their conversion_tracking records

### Sample Data

- **10 sample restaurants** across 4 KAMs
- **3 active drives:** Special 35 Discount, Menu Photoshoot Drive, Ad Boost Campaign
- **13 restaurant-drive assignments** (some restaurants in multiple drives)
- **4 test KAM accounts** created in Supabase Auth

---

## Authentication System

### Google OAuth (Primary Method)

**Configuration:**
- Provider: Google OAuth 2.0
- Domain Restriction: @zomato.com (in production mode)
- Redirect URL: Configured in Supabase and Google Cloud Console
- Test Email Whitelist: Available in development mode

**Environment Variables:**
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_RESTRICT_DOMAIN` - 'true' for production, 'false' for development

### Email/Password (Fallback)

Standard Supabase email/password authentication available as fallback method.

### Development vs Production Mode

**Development Mode** (`VITE_RESTRICT_DOMAIN=false`):
- Allows test emails from whitelist (configured in `src/contexts/AuthContext.tsx`)
- Useful for local testing without @zomato.com emails

**Production Mode** (`VITE_RESTRICT_DOMAIN=true`):
- Restricts authentication to @zomato.com emails only
- Enforces domain validation

### Test Accounts

```
Email: shiv.kumar@zomato.com | Password: zomato123 | Restaurants: 3
Email: amdeep.singh@zomato.com | Password: zomato123 | Restaurants: 3
Email: shrawani.patil@zomato.com | Password: zomato123 | Restaurants: 2
Email: rutuja.deshmukh@zomato.com | Password: zomato123 | Restaurants: 2
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # 48+ shadcn/ui components (Button, Card, Input, etc.)
│   ├── ActiveDrivesCard.tsx
│   ├── AppSidebar.tsx
│   ├── DashboardCard.tsx
│   ├── DashboardLayout.tsx
│   ├── KAMPerformanceTable.tsx
│   ├── KPICard.tsx
│   ├── LeaderboardBar.tsx
│   ├── MetricItem.tsx
│   ├── NavLink.tsx
│   ├── NotesCard.tsx
│   ├── PerformanceBadge.tsx
│   ├── PodiumDisplay.tsx
│   ├── PromosCard.tsx
│   ├── ProtectedRoute.tsx
│   ├── RestaurantHeader.tsx
│   ├── RestaurantOverviewCard.tsx
│   ├── SearchBar.tsx
│   ├── StatusBadge.tsx
│   ├── StatusPill.tsx
│   ├── TasksCard.tsx
│   └── ZonalHeader.tsx
├── contexts/
│   └── AuthContext.tsx  # Authentication context provider
├── hooks/
│   ├── use-mobile.tsx   # Mobile breakpoint detection
│   ├── use-toast.ts     # Toast notification system
│   ├── useRestaurants.ts # Restaurant data hooks
│   └── useDrives.ts     # Drive data hooks
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions (cn, getPerformanceBadgeVariant)
├── pages/
│   ├── Auth.tsx         # Login/Signup page
│   ├── MainDashboard.tsx # Main dashboard
│   ├── KAMHub.tsx       # Restaurant portfolio
│   ├── RestaurantDetail.tsx # Restaurant detail page
│   ├── KAMAnalytics.tsx # KAM analytics (mock data)
│   ├── ZonalHeadView.tsx # Zonal head view (mock data)
│   ├── LiveSprints.tsx  # Live sprints leaderboard
│   └── NotFound.tsx     # 404 page
├── App.tsx              # Main app with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

---

## Data Hooks & API Layer

### useRestaurants Hook

**File:** `src/hooks/useRestaurants.ts`

**Exports:**

1. **`useRestaurants()`** - Fetch all restaurants for logged-in KAM
   - Uses TanStack Query with queryKey: `["restaurants"]`
   - Automatically filtered by RLS (kam_email)
   - Includes nested drive_data and drives
   - Sorted by restaurant name (ascending)

2. **`useRestaurant(resId: string)`** - Fetch single restaurant by ID
   - Uses TanStack Query with queryKey: `["restaurant", resId]`
   - Includes nested drive_data and drives
   - Enabled only when resId is provided

3. **`useMarkApproached()`** - Mark restaurant as approached for a drive
   - Mutation hook
   - Updates `drive_data.approached = true`
   - Logs to `conversion_tracking` table with action_type: 'approached'
   - Invalidates restaurant queries on success

4. **`useMarkConverted()`** - Mark restaurant as converted for a drive
   - Mutation hook
   - Updates `drive_data.converted_stepper = true` and `approached = true`
   - Logs to `conversion_tracking` table with action_type: 'converted'
   - Invalidates restaurant queries on success

**TypeScript Interfaces:**

```typescript
interface Restaurant {
  res_id: string;
  res_name: string;
  kam_name: string | null;
  kam_email: string | null;
  tl_email: string | null;
  cuisine: string | null;
  locality: string | null;
  concat_field: string | null;
  account_type: string | null;
  sept_ov: number | null;
  created_at: string;
  updated_at: string;
  drive_data?: DriveData[];
}

interface DriveData {
  id: number;
  res_id: string;
  drive_id: number;
  um: number;
  mm: number;
  la: number;
  la_base_code_suggested: string | null;
  la_step1: string | null;
  la_step2: string | null;
  la_step3: string | null;
  mm_base_code_suggested: string | null;
  um_base_code_suggested: string | null;
  la_active_promos: string | null;
  mm_active_promos: string | null;
  um_active_promos: string | null;
  approached: boolean;
  converted_stepper: boolean;
  priority_score: number;
  last_updated: string;
  drives?: Drive;
}

interface Drive {
  id: number;
  drive_name: string;
  drive_type: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
}
```

### useDrives Hook

**File:** `src/hooks/useDrives.ts`

**Exports:**

1. **`useDrives()`** - Fetch all active drives
   - Uses TanStack Query with queryKey: `["drives"]`
   - Filters by status: 'active'
   - Sorted by start_date (descending)

2. **`useDrive(driveId: number)`** - Fetch single drive by ID
   - Uses TanStack Query with queryKey: `["drive", driveId]`
   - Enabled only when driveId is provided

---

## Key Components

### Custom Business Components (21 total)

1. **ActiveDrivesCard** - Displays active drives for a restaurant
2. **AppSidebar** - Navigation sidebar with logout
3. **DashboardCard** - Reusable card component with title and footer
4. **DashboardLayout** - Main layout wrapper with sidebar
5. **KAMPerformanceTable** - Zonal head performance table with search/sort/export
6. **KPICard** - Key performance indicator card with icon and change indicator
7. **LeaderboardBar** - Horizontal bar for leaderboard rankings
8. **MetricItem** - Individual metric display component
9. **NavLink** - Navigation link component
10. **NotesCard** - Notes section for restaurant detail page
11. **PerformanceBadge** - Performance indicator badge
12. **PodiumDisplay** - Top 3 performers podium display
13. **PromosCard** - Active/suggested promos card
14. **ProtectedRoute** - Route wrapper for authentication
15. **RestaurantHeader** - Header for restaurant detail page
16. **RestaurantOverviewCard** - Restaurant information overview
17. **SearchBar** - Search input with icon
18. **StatusBadge** - Status indicator badge
19. **StatusPill** - Status pill with auto-variant calculation
20. **TasksCard** - Tasks/items card for restaurant detail
21. **ZonalHeader** - Header for zonal head view

### shadcn/ui Components (48+ total)

Accordion, Alert Dialog, Alert, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, Context Menu, Dialog, Drawer, Dropdown Menu, Form, Hover Card, Input OTP, Input, Label, Menubar, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toaster, Toggle Group, Toggle, Tooltip

---

## Environment Configuration

### Required Environment Variables

**File:** `.env.local` (not committed to git)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Development Mode (set to 'false' for development, 'true' for production)
VITE_RESTRICT_DOMAIN=false
```

### Build Configuration

**Vite Config** (`vite.config.ts`):
- Server port: 8080
- Server host: "::" (IPv6)
- Path alias: `@` → `./src`
- Plugins: react-swc, lovable-tagger (dev only)

**Tailwind Config** (`tailwind.config.ts`):
- Custom colors: status (success/warning/danger), sidebar, gold/silver/bronze, race-blue
- Custom animations: fade-in, scale-in, shimmer, accordion
- Typography plugin enabled

**TypeScript Config** (`tsconfig.json`):
- Relaxed mode: noImplicitAny: false, strictNullChecks: false
- Path alias: `@/*` → `./src/*`
- skipLibCheck: true, allowJs: true

---

## Features Status

### ✅ Fully Implemented (Production Ready)

1. **Authentication System**
   - Google OAuth with domain restriction
   - Email/password fallback
   - Session management with auto-refresh
   - Protected routes
   - Logout functionality

2. **Database & Backend**
   - 4 tables with proper relationships
   - Row Level Security (RLS) policies
   - Sample data loaded
   - Indexes for performance

3. **KAM Hub**
   - Real-time restaurant list (filtered by KAM)
   - Search by name, locality, cuisine
   - Status calculation (Best/Approached/Good/Pending)
   - Drive count badges
   - Navigation to restaurant details

4. **Restaurant Detail Page**
   - Full conversion tracking workflow
   - Mark as Approached/Converted buttons
   - Visual status indicators
   - Automatic UI updates
   - Audit trail logging

5. **Live Sprints**
   - Leaderboard display
   - Performance tracking
   - Podium visualization

### 📊 Using Mock Data (Intentionally)

1. **KAM Analytics** (`/kam-analytics`)
   - Weekly conversion trends (bar chart)
   - Restaurant status distribution (pie chart)
   - Drive-specific KPIs
   - **Reason:** Real analytics data is still evolving

2. **Zonal Head View** (`/zonal-head-view`)
   - Team performance metrics
   - KAM rankings table
   - Average conversion/approach rates
   - **Reason:** Team performance data structure not finalized

---

## Build & Deployment

### Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev

# Run linter
npm run lint

# Format code
npm run format
npm run format:check
```

### Production Build

```bash
# Build for production
npm run build

# Build for development mode
npm run build:dev

# Preview production build
npm run preview
```

### Build Output

- **Output Directory:** `dist/`
- **Entry Point:** `dist/index.html`
- **Assets:** `dist/assets/` (JS, CSS, images)

---

## Integration History

This project integrates 5 separate Lovable repositories into one cohesive application:

1. **zomato-drive-dash** → Main Dashboard (`/dashboard`)
2. **drive-kam-central** → KAM Hub (`/kam-hub`)
3. **kam-action-center** → Restaurant Detail (`/restaurant/:id`)
4. **drive-focus-view** → KAM Analytics (`/kam-analytics`)
5. **drivehub-zonal** → Zonal Head View (`/zonal-head-view`)

All screens have been integrated with unified routing, shared components extracted, and consistent styling applied.

---

## Database Setup Script

**File:** `supabase-setup.sql`

This SQL script contains:
1. Table creation statements (4 tables)
2. Index creation for performance
3. Sample data insertion (10 restaurants, 3 drives, 13 assignments)
4. RLS policy enablement
5. RLS policy creation (6 policies)
6. Verification query

**Execution:** Run entire script in Supabase SQL Editor (estimated time: 2-3 minutes)

---

## License

Private - Zomato Internal Use Only

