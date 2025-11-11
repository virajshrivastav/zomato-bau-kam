# Zomato BAU KAM Dashboard - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Development Mode (set to false for production)
VITE_RESTRICT_DOMAIN=false
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 4. Build for Production
```bash
npm run build
```

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Supabase (Backend)
- TanStack Query (State Management)
- React Router v6

## Routes
- `/` - Auth Page
- `/dashboard` - Main Dashboard
- `/kam-hub` - Restaurant Portfolio
- `/restaurant/:id` - Restaurant Detail
- `/kam-analytics` - KAM Analytics
- `/zonal-head-view` - Zonal Head View
- `/live-sprints` - Live Sprints Leaderboard

