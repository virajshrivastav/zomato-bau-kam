# Zomato Drive Dashboard - Integrated MVP

This is the integrated Zomato Drive Dashboard MVP, combining all 5 Lovable repositories into one cohesive application.

## 🎯 Application Flow

The application follows this user journey:

1. **Main Dashboard (/)** - Public landing page with high-level metrics
   - Shows City View, Zone View, and KAM View summaries
   - Displays current/live drives, post drives, and upcoming drives
   - Email login to access personalized KAM Hub

2. **KAM Hub (/kam-hub)** - Personalized dashboard for Key Account Managers
   - Restaurant View: List of assigned restaurants with status pills
   - Drive View: Personal drive performance metrics
   - Two navigation paths:
     - Click restaurant → Restaurant Detail page
     - Click drive stats → KAM Analytics page

3. **Restaurant Detail (/restaurant/:id)** - Detailed action page for a specific restaurant
   - Restaurant overview and information
   - Active drives tags
   - Promo management (active & suggested)
   - Task/item conversion tracking
   - Notes and comments section

4. **KAM Analytics (/kam-analytics)** - Personal performance analytics
   - Detailed breakdown by drive (N2R, NCN, MRP, ADS)
   - Data visualizations (bar charts, pie charts)
   - Performance metrics and trends

5. **Zonal Head View (/zonal-head-view)** - Manager's overview dashboard
   - Table view of all KAMs
   - Performance comparison across team
   - Key metrics: Drive Performance, Conversion Avg, Approach Rate

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build

```bash
# Preview production build
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DashboardCard.tsx
│   ├── SearchBar.tsx
│   ├── StatusPill.tsx
│   ├── KPICard.tsx
│   └── ...
├── pages/              # Route pages
│   ├── MainDashboard.tsx
│   ├── KAMHub.tsx
│   ├── RestaurantDetail.tsx
│   ├── KAMAnalytics.tsx
│   └── ZonalHeadView.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.tsx             # Main app component with routing
└── main.tsx            # Application entry point
```

## 🎨 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Charts**: Recharts

## 🔗 Route Structure

- `/` - Main Dashboard (Screen 1)
- `/kam-hub` - KAM Hub (Screen 2)
- `/restaurant/:id` - Restaurant Detail (Screen 3)
- `/kam-analytics` - KAM Analytics (Screen 4)
- `/zonal-head-view` - Zonal Head View (Screen 5)

## 📝 Source Repositories

This integrated project combines the following repositories:

1. **zomato-drive-dash** - Main Dashboard
2. **drive-kam-central** - KAM Hub
3. **kam-action-center** - Restaurant Detail View
4. **drive-focus-view** - KAM Analytics
5. **drivehub-zonal** - Zonal Head View

## 🎯 Key Features

- ✅ Unified navigation flow across all screens
- ✅ Consistent UI/UX with shared component library
- ✅ Status pills for restaurant conversion tracking
- ✅ Smart search and filters
- ✅ Performance metrics and analytics
- ✅ Multi-level user personas (KAM, Zonal Head)
- ✅ Responsive design for mobile and desktop

## 📄 License

Private - Zomato Internal Use Only

