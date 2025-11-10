# 📊 Phase 3: Analytics & Insights - Analytics Engine Live

**Technical Achievement:** Data aggregation layer with visualization and computed metrics
**Priority:** IMPORTANT
**Goal:** SQL aggregation + Chart integration + Performance metrics engine

**Prerequisites:** Phase 2 completed ✅ (Business logic operational)

---

## 🎯 Phase Objectives

By the end of Phase 3, you will have achieved:

✅ **Aggregation Queries:** SQL GROUP BY with COUNT, SUM, AVG for KAM performance
✅ **Time-Series Transform:** Date-based aggregation with gap filling for trend charts
✅ **Chart Components:** Recharts integration with custom tooltips and legends
✅ **Scoring Algorithm:** Multi-factor weighted calculation (OV × 0.3 + segments × 0.4 + status × 0.3)
✅ **Hierarchical Rollup:** Team-level aggregation with KAM-level drill-down
✅ **Export Engine:** Server-side Excel generation with formatting and formulas
✅ **Computed Metrics:** Real-time KPI calculations with memoization

---

## 📋 Task Breakdown

### **Task 3.1: Create KAM Stats API**

**Technical Achievement:** Complex SQL aggregation with computed metrics and memoization

#### Steps:

1. **Create Stats Hook**
   - Create file: `src/hooks/useKAMStats.ts`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'

   export function useKAMStats(kamName: string) {
     return useQuery({
       queryKey: ['kam-stats', kamName],
       queryFn: async () => {
         // Get total restaurants
         const { count: totalRestaurants } = await supabase
           .from('restaurants')
           .select('*', { count: 'exact', head: true })
           .eq('kam_name', kamName)

         // Get approached count
         const { count: approachedCount } = await supabase
           .from('drive_data')
           .select('res_id', { count: 'exact', head: true })
           .eq('approached', true)
           .in('res_id', 
             supabase
               .from('restaurants')
               .select('res_id')
               .eq('kam_name', kamName)
           )

         // Get converted count
         const { count: convertedCount } = await supabase
           .from('drive_data')
           .select('res_id', { count: 'exact', head: true })
           .eq('converted_stepper', true)
           .in('res_id',
             supabase
               .from('restaurants')
               .select('res_id')
               .eq('kam_name', kamName)
           )

         // Get today's conversions
         const today = new Date().toISOString().split('T')[0]
         const { count: todayConversions } = await supabase
           .from('conversion_tracking')
           .select('*', { count: 'exact', head: true })
           .eq('kam_name', kamName)
           .eq('action_type', 'converted')
           .gte('action_date', today)

         // Calculate conversion rate
         const conversionRate = totalRestaurants 
           ? Math.round((convertedCount! / totalRestaurants) * 100)
           : 0

         return {
           totalRestaurants: totalRestaurants || 0,
           approachedCount: approachedCount || 0,
           convertedCount: convertedCount || 0,
           todayConversions: todayConversions || 0,
           conversionRate,
           pendingCount: (totalRestaurants || 0) - (approachedCount || 0)
         }
       }
     })
   }
   ```

2. **Update KAM Hub with Real Stats**
   - Edit: `src/pages/KAMHub.tsx`
   ```typescript
   import { useKAMStats } from '@/hooks/useKAMStats'

   const KAMHub = () => {
     const kamName = 'Anudeep Pawar'
     const { data: stats } = useKAMStats(kamName)

     return (
       <div className="grid grid-cols-4 gap-4">
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
     )
   }
   ```

**Deliverable:** Real-time KAM stats displaying correctly

---

### **Task 3.2: Build Conversion Trend Chart**

**Technical Achievement:** Time-series data transformation with gap filling for Recharts

#### Steps:

1. **Create Chart Data Hook**
   - Create file: `src/hooks/useConversionTrend.ts`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'
   import { subDays, format } from 'date-fns'

   export function useConversionTrend(kamName: string, days: number = 30) {
     return useQuery({
       queryKey: ['conversion-trend', kamName, days],
       queryFn: async () => {
         const startDate = subDays(new Date(), days).toISOString()

         const { data, error } = await supabase
           .from('conversion_tracking')
           .select('action_date')
           .eq('kam_name', kamName)
           .eq('action_type', 'converted')
           .gte('action_date', startDate)
           .order('action_date', { ascending: true })

         if (error) throw error

         // Group by date
         const grouped = data.reduce((acc, item) => {
           const date = format(new Date(item.action_date), 'MMM dd')
           acc[date] = (acc[date] || 0) + 1
           return acc
         }, {} as Record<string, number>)

         // Convert to array for Recharts
         return Object.entries(grouped).map(([date, conversions]) => ({
           date,
           conversions
         }))
       }
     })
   }
   ```

2. **Create Chart Component**
   - Create file: `src/components/ConversionTrendChart.tsx`
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
   import { useConversionTrend } from '@/hooks/useConversionTrend'

   export function ConversionTrendChart({ kamName }: { kamName: string }) {
     const { data, isLoading } = useConversionTrend(kamName)

     if (isLoading) return <div>Loading chart...</div>

     return (
       <Card>
         <CardHeader>
           <CardTitle>Conversion Trend (Last 30 Days)</CardTitle>
         </CardHeader>
         <CardContent>
           <ResponsiveContainer width="100%" height={300}>
             <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="date" />
               <YAxis />
               <Tooltip />
               <Line 
                 type="monotone" 
                 dataKey="conversions" 
                 stroke="hsl(var(--primary))" 
                 strokeWidth={2}
               />
             </LineChart>
           </ResponsiveContainer>
         </CardContent>
       </Card>
     )
   }
   ```

3. **Add to KAM Analytics Page**
   - Edit: `src/pages/KAMAnalytics.tsx`
   ```typescript
   import { ConversionTrendChart } from '@/components/ConversionTrendChart'

   const KAMAnalytics = () => {
     return (
       <div className="space-y-6">
         <ConversionTrendChart kamName="Anudeep Pawar" />
       </div>
     )
   }
   ```

**Deliverable:** Line chart showing conversion trend

---

### **Task 3.3: Build Drive Distribution Chart**

**Technical Achievement:** Categorical data aggregation with percentage calculation

#### Steps:

1. **Create Drive Stats Hook**
   - Create file: `src/hooks/useDriveDistribution.ts`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'

   export function useDriveDistribution(kamName: string) {
     return useQuery({
       queryKey: ['drive-distribution', kamName],
       queryFn: async () => {
         const { data, error } = await supabase
           .from('conversion_tracking')
           .select(`
             drive_id,
             drives (drive_name, drive_type)
           `)
           .eq('kam_name', kamName)
           .eq('action_type', 'converted')

         if (error) throw error

         // Group by drive type
         const grouped = data.reduce((acc, item) => {
           const type = item.drives?.drive_type || 'unknown'
           acc[type] = (acc[type] || 0) + 1
           return acc
         }, {} as Record<string, number>)

         return Object.entries(grouped).map(([name, value]) => ({
           name: name.charAt(0).toUpperCase() + name.slice(1),
           value
         }))
       }
     })
   }
   ```

2. **Create Pie Chart Component**
   - Create file: `src/components/DriveDistributionChart.tsx`
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
   import { useDriveDistribution } from '@/hooks/useDriveDistribution'

   const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))']

   export function DriveDistributionChart({ kamName }: { kamName: string }) {
     const { data, isLoading } = useDriveDistribution(kamName)

     if (isLoading) return <div>Loading chart...</div>

     return (
       <Card>
         <CardHeader>
           <CardTitle>Conversions by Drive Type</CardTitle>
         </CardHeader>
         <CardContent>
           <ResponsiveContainer width="100%" height={300}>
             <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 labelLine={false}
                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                 outerRadius={80}
                 fill="#8884d8"
                 dataKey="value"
               >
                 {data?.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <Tooltip />
               <Legend />
             </PieChart>
           </ResponsiveContainer>
         </CardContent>
       </Card>
     )
   }
   ```

**Deliverable:** Pie chart showing drive distribution

---

### **Task 3.4: Implement Priority Scoring**

**Technical Achievement:** Multi-factor weighted algorithm with configurable parameters

#### Steps:

1. **Create Priority Algorithm**
   - Create file: `src/lib/priorityScore.ts`
   ```typescript
   import type { Restaurant, DriveData } from '@/types/database'

   export function calculatePriorityScore(
     restaurant: Restaurant,
     driveData: DriveData
   ): number {
     let score = 0

     // High OV = higher priority (max 40 points)
     if (restaurant.sept_ov > 500) score += 40
     else if (restaurant.sept_ov > 200) score += 30
     else if (restaurant.sept_ov > 100) score += 20
     else score += 10

     // Not approached yet = higher priority (30 points)
     if (!driveData.approached) score += 30

     // High customer segments = higher priority (20 points)
     const totalCustomers = driveData.um + driveData.mm + driveData.la
     if (totalCustomers > 50) score += 20
     else if (totalCustomers > 30) score += 15
     else if (totalCustomers > 10) score += 10

     // Already converted = lower priority (-20 points)
     if (driveData.converted_stepper) score -= 20

     return Math.min(100, Math.max(0, score))
   }
   ```

2. **Create Update Script**
   - Create file: `scripts/updatePriorityScores.ts`
   ```typescript
   import { supabase } from '../src/lib/supabase'
   import { calculatePriorityScore } from '../src/lib/priorityScore'

   async function updateAllPriorityScores() {
     // Get all restaurants with drive data
     const { data: restaurants } = await supabase
       .from('restaurants')
       .select(`
         *,
         drive_data (*)
       `)

     if (!restaurants) return

     for (const restaurant of restaurants) {
       for (const driveData of restaurant.drive_data) {
         const score = calculatePriorityScore(restaurant, driveData)

         await supabase
           .from('drive_data')
           .update({ priority_score: score })
           .eq('id', driveData.id)
       }
     }

     console.log('Priority scores updated!')
   }

   updateAllPriorityScores()
   ```

3. **Create Priority List Component**
   - Create file: `src/components/PriorityList.tsx`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { Button } from '@/components/ui/button'
   import { ArrowRight } from 'lucide-react'
   import { Link } from 'react-router-dom'

   export function PriorityList({ kamName, limit = 10 }: { kamName: string, limit?: number }) {
     const { data: restaurants } = useQuery({
       queryKey: ['priority-restaurants', kamName],
       queryFn: async () => {
         const { data } = await supabase
           .from('drive_data')
           .select(`
             *,
             restaurants (*)
           `)
           .in('res_id',
             supabase
               .from('restaurants')
               .select('res_id')
               .eq('kam_name', kamName)
           )
           .order('priority_score', { ascending: false })
           .limit(limit)

         return data
       }
     })

     return (
       <Card>
         <CardHeader>
           <CardTitle>Top Priority Restaurants</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3">
             {restaurants?.map((item, index) => (
               <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                     {index + 1}
                   </div>
                   <div>
                     <p className="font-semibold">{item.restaurants.res_name}</p>
                     <p className="text-sm text-muted-foreground">{item.restaurants.locality}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <Badge variant="secondary">
                     Score: {item.priority_score}
                   </Badge>
                   <Link to={`/restaurant/${item.res_id}`}>
                     <Button size="sm" variant="ghost">
                       <ArrowRight className="h-4 w-4" />
                     </Button>
                   </Link>
                 </div>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

**Deliverable:** Priority-ranked restaurant list

---

### **Task 3.5: Build Zonal Head Dashboard**

**Technical Achievement:** Hierarchical data aggregation with team rollup calculations

#### Steps:

1. **Create Team Stats Hook**
   - Create file: `src/hooks/useTeamStats.ts`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'

   export function useTeamStats() {
     return useQuery({
       queryKey: ['team-stats'],
       queryFn: async () => {
         // Get all KAMs
         const { data: kams } = await supabase
           .from('restaurants')
           .select('kam_name')
           .not('kam_name', 'is', null)

         const uniqueKAMs = [...new Set(kams?.map(k => k.kam_name))]

         // Get stats for each KAM
         const teamStats = await Promise.all(
           uniqueKAMs.map(async (kamName) => {
             const { count: total } = await supabase
               .from('restaurants')
               .select('*', { count: 'exact', head: true })
               .eq('kam_name', kamName)

             const { count: converted } = await supabase
               .from('conversion_tracking')
               .select('*', { count: 'exact', head: true })
               .eq('kam_name', kamName)
               .eq('action_type', 'converted')

             const conversionRate = total ? Math.round((converted! / total) * 100) : 0

             return {
               kam_name: kamName,
               total_restaurants: total || 0,
               converted: converted || 0,
               conversion_rate: conversionRate
             }
           })
         )

         return teamStats.sort((a, b) => b.conversion_rate - a.conversion_rate)
       }
     })
   }
   ```

2. **Update Zonal Head View**
   - Edit: `src/pages/ZonalHeadView.tsx`
   - Replace mock data with real team stats

**Deliverable:** Zonal dashboard with real team data

---

## ✅ Phase 3 Completion Checklist

- [ ] KAM stats showing real data
- [ ] Conversion trend chart working
- [ ] Drive distribution pie chart working
- [ ] Priority scoring algorithm implemented
- [ ] Priority list showing top 10 restaurants
- [ ] Zonal dashboard showing team performance
- [ ] All charts responsive and interactive

---

**Next Phase:** [Phase 4 - Advanced Features](PHASE-4-ADVANCED.md)

