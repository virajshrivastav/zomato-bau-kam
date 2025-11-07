# 🎨 UI Components Guide

## Overview

This document describes the component library for the Zomato Drive Dashboard, built with:
- **Next.js 14** (App Router)
- **Shadcn/ui** (Radix UI + Tailwind CSS)
- **TypeScript**
- **Lucide React** (Icons)

---

## 🎯 Design System

### Color Palette

```css
/* Primary Colors */
--zomato-red: #ef4444;
--zomato-red-dark: #dc2626;
--zomato-red-light: #fca5a5;

/* Status Colors */
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-500: #6b7280;
--gray-900: #111827;
```

### Typography

```css
/* Headings */
h1: text-3xl font-bold (30px)
h2: text-2xl font-bold (24px)
h3: text-xl font-semibold (20px)
h4: text-lg font-semibold (18px)

/* Body */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)
```

### Spacing

```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

---

## 📦 Component Library

### 1. Layout Components

#### Navbar
**Location:** `components/navbar.tsx`

**Usage:**
```tsx
import { Navbar } from '@/components/navbar'

<Navbar 
  userName="Anudeep Pawar"
  userEmail="anudeep.pawar@zomato.com"
  onLogout={() => {}}
/>
```

**Props:**
```typescript
interface NavbarProps {
  userName: string
  userEmail: string
  onLogout: () => void
}
```

---

#### Sidebar
**Location:** `components/sidebar.tsx`

**Usage:**
```tsx
import { Sidebar } from '@/components/sidebar'

<Sidebar 
  activeRoute="/dashboard"
  userRole="kam"
/>
```

**Props:**
```typescript
interface SidebarProps {
  activeRoute: string
  userRole: 'kam' | 'zonal_head' | 'admin'
}
```

**Menu Items:**
```typescript
const menuItems = {
  kam: [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'My Restaurants', icon: Store, href: '/restaurants' },
    { label: 'Analytics', icon: BarChart, href: '/analytics' },
    { label: 'Incentives', icon: DollarSign, href: '/incentives' }
  ],
  zonal_head: [
    { label: 'Team Dashboard', icon: Users, href: '/zonal' },
    { label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { label: 'Reports', icon: FileText, href: '/reports' }
  ]
}
```

---

### 2. Data Display Components

#### RestaurantCard
**Location:** `components/restaurant-card.tsx`

**Usage:**
```tsx
import { RestaurantCard } from '@/components/restaurant-card'

<RestaurantCard
  restaurant={restaurant}
  driveCount={2}
  onViewDetails={() => router.push(`/restaurant/${restaurant.res_id}`)}
/>
```

**Props:**
```typescript
interface RestaurantCardProps {
  restaurant: Restaurant
  driveCount?: number
  onViewDetails: () => void
  showCheckbox?: boolean
  isSelected?: boolean
  onSelect?: (resId: string) => void
}
```

**Features:**
- Displays restaurant name, ID, cuisine, locality
- Shows order volume with color coding
- Multi-drive badge indicator
- Hover effects and animations
- Optional checkbox for bulk selection

---

#### DriveCard
**Location:** `components/drive-card.tsx`

**Usage:**
```tsx
import { DriveCard } from '@/components/drive-card'

<DriveCard
  drive={driveData}
  onApproach={handleApproach}
  onConvert={handleConvert}
/>
```

**Props:**
```typescript
interface DriveCardProps {
  drive: DriveData & { drives: Drive }
  onApproach: () => void
  onConvert: () => void
  onActivate?: () => void
}
```

**Features:**
- Status indicator (Pending/Approached/Converted)
- Customer segment breakdown (LA, MM, UM)
- Suggested discounts display
- Editable discount fields
- Action buttons based on status

---

#### StatsCards
**Location:** `components/stats-cards.tsx`

**Usage:**
```tsx
import { StatsCards } from '@/components/stats-cards'

<StatsCards stats={kamStats} />
```

**Props:**
```typescript
interface StatsCardsProps {
  stats: {
    totalRestaurants: number
    approached: number
    converted: number
    pending: number
    conversionRate: string
    todayConversions: number
    weekConversions: number
  }
}
```

**Layout:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Total     │  Converted  │   Pending   │  This Week  │
│    227      │     45      │     77      │     12      │
│  Assigned   │  19.82%     │ Need Action │   3 today   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

### 3. Input Components

#### FilterBar
**Location:** `components/filter-bar.tsx`

**Usage:**
```tsx
import { FilterBar } from '@/components/filter-bar'

<FilterBar
  onSearchChange={setSearchTerm}
  onCityChange={setCityFilter}
  onStatusChange={setStatusFilter}
  onOVRangeChange={setOVRange}
/>
```

**Props:**
```typescript
interface FilterBarProps {
  onSearchChange: (value: string) => void
  onCityChange: (value: string) => void
  onStatusChange: (value: string) => void
  onOVRangeChange?: (range: [number, number]) => void
  onDriveTypeChange?: (value: string) => void
}
```

**Features:**
- Search input with debounce
- City dropdown
- Status dropdown
- Drive type filter
- OV range slider
- Clear all filters button

---

#### DiscountEditor
**Location:** `components/discount-editor.tsx`

**Usage:**
```tsx
import { DiscountEditor } from '@/components/discount-editor'

<DiscountEditor
  segment="LA"
  initialValue="40 upto 80"
  onSave={handleSave}
/>
```

**Props:**
```typescript
interface DiscountEditorProps {
  segment: 'LA' | 'MM' | 'UM'
  initialValue: string
  onSave: (newValue: string) => Promise<void>
  disabled?: boolean
}
```

**States:**
- View mode: Shows current value with edit icon
- Edit mode: Input field with save/cancel buttons
- Loading state: Disabled with spinner

---

### 4. Chart Components

#### ConversionTrendChart
**Location:** `components/charts/conversion-trend.tsx`

**Usage:**
```tsx
import { ConversionTrendChart } from '@/components/charts/conversion-trend'

<ConversionTrendChart data={trendData} />
```

**Data Format:**
```typescript
interface TrendData {
  date: string // "2025-11-01"
  conversions: number
  approached?: number
}
```

**Chart Type:** Line chart (Recharts)

---

#### DriveDistributionChart
**Location:** `components/charts/drive-distribution.tsx`

**Usage:**
```tsx
import { DriveDistributionChart } from '@/components/charts/drive-distribution'

<DriveDistributionChart data={distributionData} />
```

**Data Format:**
```typescript
interface DistributionData {
  name: string // "Discount", "Menu", "Ads"
  value: number
}
```

**Chart Type:** Pie chart (Recharts)

---

### 5. Dialog/Modal Components

#### ActivationDialog
**Location:** `components/activation-dialog.tsx`

**Usage:**
```tsx
import { ActivationDialog } from '@/components/activation-dialog'

<ActivationDialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleActivate}
  restaurantName="Shahi Darbar"
  discount="40 upto 80"
/>
```

**Props:**
```typescript
interface ActivationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (notes: string) => Promise<void>
  restaurantName: string
  discount: string
  segment?: 'LA' | 'MM' | 'UM'
}
```

**Features:**
- Confirmation message
- Discount details display
- Optional notes textarea
- Loading state during activation
- Success/error feedback

---

### 6. List Components

#### PriorityList
**Location:** `components/priority-list.tsx`

**Usage:**
```tsx
import { PriorityList } from '@/components/priority-list'

<PriorityList restaurants={prioritizedRestaurants} />
```

**Features:**
- Top 10 priority restaurants
- Numbered ranking (1-10)
- Priority score badge
- AI reasoning tooltip
- Quick action button

---

#### KAMLeaderboard
**Location:** `components/kam-leaderboard.tsx`

**Usage:**
```tsx
import { KAMLeaderboard } from '@/components/kam-leaderboard'

<KAMLeaderboard data={teamData} />
```

**Features:**
- Ranked list of KAMs
- Conversion count and rate
- Medal icons for top 3
- Sortable columns
- Highlight current user

---

### 7. Utility Components

#### LoadingSkeleton
**Location:** `components/loading-skeleton.tsx`

**Usage:**
```tsx
import { RestaurantSkeleton } from '@/components/loading-skeleton'

{loading ? (
  <RestaurantSkeleton count={6} />
) : (
  <RestaurantList />
)}
```

**Variants:**
- `RestaurantSkeleton` - For restaurant cards
- `TableSkeleton` - For data tables
- `ChartSkeleton` - For chart placeholders

---

#### ErrorState
**Location:** `components/error-state.tsx`

**Usage:**
```tsx
import { ErrorState } from '@/components/error-state'

<ErrorState
  message="Failed to load restaurants"
  onRetry={refetch}
/>
```

**Props:**
```typescript
interface ErrorStateProps {
  message: string
  onRetry?: () => void
  icon?: React.ReactNode
}
```

---

#### EmptyState
**Location:** `components/empty-state.tsx`

**Usage:**
```tsx
import { EmptyState } from '@/components/empty-state'

<EmptyState
  title="No restaurants found"
  description="Try adjusting your filters"
  action={<Button onClick={clearFilters}>Clear Filters</Button>}
/>
```

---

### 8. Badge Components

#### StatusBadge
**Location:** `components/status-badge.tsx`

**Usage:**
```tsx
import { StatusBadge } from '@/components/status-badge'

<StatusBadge status="converted" />
<StatusBadge status="approached" />
<StatusBadge status="pending" />
```

**Variants:**
```typescript
type Status = 'pending' | 'approached' | 'converted' | 'active' | 'completed'

const statusConfig = {
  pending: { color: 'gray', icon: Circle },
  approached: { color: 'yellow', icon: Clock },
  converted: { color: 'green', icon: CheckCircle },
  active: { color: 'blue', icon: Activity },
  completed: { color: 'green', icon: CheckCircle }
}
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Classes

**Common Patterns:**

```tsx
// Card
className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"

// Button Primary
className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"

// Button Secondary
className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md"

// Input
className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500"

// Badge
className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
```

---

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid Layouts

```tsx
// Restaurant cards
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Stats cards
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"

// Two-column layout
className="grid grid-cols-1 lg:grid-cols-2 gap-6"
```

---

## ♿ Accessibility

### ARIA Labels

```tsx
<button aria-label="Mark as approached">
  <CheckCircle />
</button>

<input 
  aria-label="Search restaurants"
  placeholder="Search..."
/>
```

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows visual flow
- Escape key closes dialogs
- Enter key submits forms

---

## 🧪 Component Testing

### Example Test (Jest + React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { RestaurantCard } from './restaurant-card'

test('displays restaurant information', () => {
  const restaurant = {
    res_id: '123',
    res_name: 'Test Restaurant',
    sept_ov: 100
  }
  
  render(<RestaurantCard restaurant={restaurant} />)
  
  expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
  expect(screen.getByText('100')).toBeInTheDocument()
})

test('calls onViewDetails when button clicked', () => {
  const handleClick = jest.fn()
  
  render(<RestaurantCard restaurant={restaurant} onViewDetails={handleClick} />)
  
  fireEvent.click(screen.getByText('View Details'))
  expect(handleClick).toHaveBeenCalled()
})
```

---

**Next:** See [Deployment Guide](06-DEPLOYMENT.md) for production setup.

