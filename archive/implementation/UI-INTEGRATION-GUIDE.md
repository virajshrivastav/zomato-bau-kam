# 🎨 UI Integration Guide

This guide shows how to connect the existing UI components to the Supabase backend.

---

## 🎯 Overview

**Current State:** UI components using mock/hardcoded data  
**Target State:** UI components fetching real data from Supabase  
**Approach:** Incremental replacement, screen by screen

---

## 📋 Integration Checklist

### **Screen 1: Main Dashboard** (`/`)
- [ ] Replace mock drive list with real drives
- [ ] Replace mock metrics with real stats
- [ ] Connect email login to Supabase Auth

### **Screen 2: KAM Hub** (`/kam-hub`)
- [ ] Replace mock restaurant list with real data
- [ ] Connect search/filter to database queries
- [ ] Show real drive metrics

### **Screen 3: Restaurant Detail** (`/restaurant/:id`)
- [ ] Fetch restaurant data by ID
- [ ] Show all drives for restaurant
- [ ] Connect "Mark as Approached" button
- [ ] Connect "Mark as Converted" button
- [ ] Make discount codes editable

### **Screen 4: KAM Analytics** (`/kam-analytics`)
- [ ] Replace mock chart data with real data
- [ ] Connect conversion trend chart
- [ ] Connect drive distribution chart
- [ ] Show real KPI metrics

### **Screen 5: Zonal Head View** (`/zonal-head-view`)
- [ ] Replace mock team data with real data
- [ ] Show real KAM leaderboard
- [ ] Connect performance metrics

---

## 🔧 Step-by-Step Integration

### **Step 1: Install Dependencies** (5 minutes)

```bash
cd d:\Projects\WARP\zomato-loveable
npm install @supabase/supabase-js date-fns
```

---

### **Step 2: Create Supabase Client** (10 minutes)

**Create file:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Create file:** `.env.local`

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

### **Step 3: Create TypeScript Types** (15 minutes)

**Create file:** `src/types/database.ts`

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
  la_step1: string | null
  la_step2: string | null
  la_step3: string | null
  mm_base_code_suggested: string | null
  um_base_code_suggested: string | null
  approached: boolean
  converted_stepper: boolean
  priority_score: number
  created_at: string
  updated_at: string
}

export interface ConversionTracking {
  id: number
  res_id: string
  drive_id: number
  kam_name: string
  action_type: string
  action_date: string
  discount_applied: string | null
  notes: string | null
  created_at: string
}

export type RestaurantWithDrives = Restaurant & {
  drive_data: (DriveData & { drives: Drive })[]
}
```

---

### **Step 4: Create API Hooks** (30 minutes)

**Create file:** `src/hooks/useRestaurants.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { RestaurantWithDrives } from '@/types/database'

export function useRestaurants(kamName: string) {
  return useQuery({
    queryKey: ['restaurants', kamName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          *,
          drive_data (
            *,
            drives (*)
          )
        `)
        .eq('kam_name', kamName)
        .order('res_name', { ascending: true })

      if (error) throw error
      return data as RestaurantWithDrives[]
    },
    enabled: !!kamName
  })
}

export function useRestaurant(resId: string) {
  return useQuery({
    queryKey: ['restaurant', resId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          *,
          drive_data (
            *,
            drives (*)
          )
        `)
        .eq('res_id', resId)
        .single()

      if (error) throw error
      return data as RestaurantWithDrives
    },
    enabled: !!resId
  })
}
```

**Create file:** `src/hooks/useKAMStats.ts`

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useKAMStats(kamName: string) {
  return useQuery({
    queryKey: ['kam-stats', kamName],
    queryFn: async () => {
      // Get restaurant IDs for this KAM
      const { data: restaurants } = await supabase
        .from('restaurants')
        .select('res_id')
        .eq('kam_name', kamName)

      const resIds = restaurants?.map(r => r.res_id) || []

      // Get total count
      const totalRestaurants = resIds.length

      // Get approached count
      const { count: approachedCount } = await supabase
        .from('drive_data')
        .select('*', { count: 'exact', head: true })
        .in('res_id', resIds)
        .eq('approached', true)

      // Get converted count
      const { count: convertedCount } = await supabase
        .from('drive_data')
        .select('*', { count: 'exact', head: true })
        .in('res_id', resIds)
        .eq('converted_stepper', true)

      // Get today's conversions
      const today = new Date().toISOString().split('T')[0]
      const { count: todayConversions } = await supabase
        .from('conversion_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('kam_name', kamName)
        .eq('action_type', 'converted')
        .gte('action_date', today)

      const conversionRate = totalRestaurants 
        ? Math.round((convertedCount! / totalRestaurants) * 100)
        : 0

      return {
        totalRestaurants,
        approachedCount: approachedCount || 0,
        convertedCount: convertedCount || 0,
        todayConversions: todayConversions || 0,
        conversionRate,
        pendingCount: totalRestaurants - (approachedCount || 0)
      }
    },
    enabled: !!kamName
  })
}
```

---

### **Step 5: Update KAM Hub Page** (45 minutes)

**Edit:** `src/pages/KAMHub.tsx`

**Before:**
```typescript
const restaurants = [
  { id: 1, name: "Viraj Restaurant", status: "poor", revenue: "₹12K" },
  // ... hardcoded data
];
```

**After:**
```typescript
import { useRestaurants } from '@/hooks/useRestaurants'
import { useKAMStats } from '@/hooks/useKAMStats'

const KAMHub = () => {
  const kamName = 'Anudeep Pawar' // TODO: Get from auth context
  const { data: restaurants, isLoading, error } = useRestaurants(kamName)
  const { data: stats } = useKAMStats(kamName)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with real stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard 
          title="Total Restaurants"
          value={stats?.totalRestaurants || 0}
          icon={Store}
        />
        <KPICard 
          title="Conversion Rate"
          value={`${stats?.conversionRate || 0}%`}
          icon={Target}
        />
        <KPICard 
          title="Today's Conversions"
          value={stats?.todayConversions || 0}
          icon={TrendingUp}
        />
        <KPICard 
          title="Pending"
          value={stats?.pendingCount || 0}
          icon={Clock}
        />
      </div>

      {/* Restaurant list with real data */}
      <div className="space-y-3">
        {restaurants?.map((restaurant) => (
          <Card
            key={restaurant.res_id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/restaurant/${restaurant.res_id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{restaurant.res_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {restaurant.locality} • {restaurant.cuisine}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    OV: {restaurant.sept_ov}
                  </Badge>
                  {restaurant.drive_data.length > 1 && (
                    <Badge variant="secondary">
                      {restaurant.drive_data.length} Drives
                    </Badge>
                  )}
                  <StatusPill 
                    status={
                      restaurant.drive_data[0]?.converted_stepper ? 'converted' :
                      restaurant.drive_data[0]?.approached ? 'approached' :
                      'pending'
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

### **Step 6: Update Restaurant Detail Page** (60 minutes)

**Edit:** `src/pages/RestaurantDetail.tsx`

**Replace mock data with:**
```typescript
import { useRestaurant } from '@/hooks/useRestaurants'
import { useParams } from 'react-router-dom'

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data: restaurant, isLoading } = useRestaurant(id!)

  if (isLoading) return <div>Loading...</div>
  if (!restaurant) return <div>Restaurant not found</div>

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Restaurant Header */}
        <RestaurantHeader 
          name={restaurant.res_name}
          id={restaurant.res_id}
          location={restaurant.locality || ''}
          cuisine={restaurant.cuisine || ''}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <KPICard 
            title="Order Volume"
            value={restaurant.sept_ov}
            icon={TrendingUp}
          />
          <KPICard 
            title="Active Drives"
            value={restaurant.drive_data.length}
            icon={Target}
          />
          {/* ... more KPIs */}
        </div>

        {/* Drives Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {restaurant.drive_data.map((driveData) => (
            <Card key={driveData.id}>
              <CardHeader>
                <CardTitle>{driveData.drives.drive_name}</CardTitle>
                <Badge>{driveData.drives.drive_type}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Segments</p>
                    <p>LA: {driveData.la} | MM: {driveData.mm} | UM: {driveData.um}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Suggested Discount</p>
                    <p className="font-medium">{driveData.la_base_code_suggested}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge 
                      approached={driveData.approached}
                      converted={driveData.converted_stepper}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
```

---

### **Step 7: Add Conversion Actions** (45 minutes)

**Create file:** `src/api/conversions.ts`

```typescript
import { supabase } from '@/lib/supabase'

export async function markAsApproached(
  resId: string,
  driveId: number,
  kamName: string,
  notes?: string
) {
  // Update drive_data
  const { error: updateError } = await supabase
    .from('drive_data')
    .update({ approached: true, updated_at: new Date().toISOString() })
    .eq('res_id', resId)
    .eq('drive_id', driveId)

  if (updateError) throw updateError

  // Log conversion tracking
  const { error: trackError } = await supabase
    .from('conversion_tracking')
    .insert({
      res_id: resId,
      drive_id: driveId,
      kam_name: kamName,
      action_type: 'approached',
      notes: notes || null
    })

  if (trackError) throw trackError

  return { success: true }
}

export async function markAsConverted(
  resId: string,
  driveId: number,
  kamName: string,
  discountApplied: string,
  notes?: string
) {
  // Update drive_data
  const { error: updateError } = await supabase
    .from('drive_data')
    .update({ 
      converted_stepper: true, 
      approached: true,
      updated_at: new Date().toISOString() 
    })
    .eq('res_id', resId)
    .eq('drive_id', driveId)

  if (updateError) throw updateError

  // Log conversion tracking
  const { error: trackError } = await supabase
    .from('conversion_tracking')
    .insert({
      res_id: resId,
      drive_id: driveId,
      kam_name: kamName,
      action_type: 'converted',
      discount_applied: discountApplied,
      notes: notes || null
    })

  if (trackError) throw trackError

  return { success: true }
}
```

**Create hook:** `src/hooks/useConversions.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markAsApproached, markAsConverted } from '@/api/conversions'
import { useToast } from '@/hooks/use-toast'

export function useMarkApproached() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: markAsApproached,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
      toast({
        title: 'Success',
        description: 'Restaurant marked as approached'
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

export function useMarkConverted() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: markAsConverted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
      queryClient.invalidateQueries({ queryKey: ['kam-stats'] })
      toast({
        title: 'Success! 🎉',
        description: 'Restaurant marked as converted'
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}
```

---

## ✅ Integration Checklist

- [ ] Supabase client created
- [ ] Environment variables configured
- [ ] TypeScript types defined
- [ ] API hooks created
- [ ] KAM Hub connected to real data
- [ ] Restaurant Detail connected to real data
- [ ] Conversion actions working
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Toast notifications working

---

**Next:** [Testing Checklist](TESTING-CHECKLIST.md)

