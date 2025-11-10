# 📊 Sprint 4: Analytics & Visual Insights

**Duration:** 5-7 days  
**Goal:** Build analytics dashboards with charts, metrics, and insights for KAMs and Zonal Heads.

**Prerequisites:** Sprint 3 completed ✅ (Core features working)

---

## 🎯 Sprint Objectives

By the end of this sprint, you will have:

✅ KAM performance dashboard with key metrics  
✅ Conversion rate tracking (today/week/overall)  
✅ Priority restaurant list (AI-ranked)  
✅ Performance charts (line, bar, pie)  
✅ Zonal Head dashboard  
✅ KAM leaderboard  
✅ City-level summary view  
✅ Exportable reports  

---

## 📋 Task Breakdown

### Task 4.1: Build KAM Stats Dashboard (Priority: CRITICAL)

**Estimated Time:** 4 hours

**Steps:**

1. **Create Stats API Endpoint**

   Create `app/api/stats/kam/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import { supabase } from '@/lib/supabase'
   
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const kamName = searchParams.get('kam_name')
     
     if (!kamName) {
       return NextResponse.json({ error: 'KAM name required' }, { status: 400 })
     }
     
     // Total restaurants
     const { count: totalRestaurants } = await supabase
       .from('restaurants')
       .select('*', { count: 'exact', head: true })
       .eq('kam_name', kamName)
     
     // Approached count
     const { count: approachedCount } = await supabase
       .from('drive_data')
       .select('restaurants!inner(*)', { count: 'exact', head: true })
       .eq('approached', true)
       .eq('restaurants.kam_name', kamName)
     
     // Converted count
     const { count: convertedCount } = await supabase
       .from('drive_data')
       .select('restaurants!inner(*)', { count: 'exact', head: true })
       .eq('converted_stepper', true)
       .eq('restaurants.kam_name', kamName)
     
     // Today's conversions
     const today = new Date().toISOString().split('T')[0]
     const { count: todayConversions } = await supabase
       .from('conversion_tracking')
       .select('*', { count: 'exact', head: true })
       .eq('kam_name', kamName)
       .eq('action_type', 'converted')
       .gte('action_date', today)
     
     // This week's conversions
     const weekAgo = new Date()
     weekAgo.setDate(weekAgo.getDate() - 7)
     const { count: weekConversions } = await supabase
       .from('conversion_tracking')
       .select('*', { count: 'exact', head: true })
       .eq('kam_name', kamName)
       .eq('action_type', 'converted')
       .gte('action_date', weekAgo.toISOString().split('T')[0])
     
     // Calculate rates
     const conversionRate = totalRestaurants 
       ? ((convertedCount || 0) / totalRestaurants * 100).toFixed(2)
       : '0.00'
     
     return NextResponse.json({
       totalRestaurants: totalRestaurants || 0,
       approached: approachedCount || 0,
       converted: convertedCount || 0,
       pending: (totalRestaurants || 0) - (approachedCount || 0),
       conversionRate,
       todayConversions: todayConversions || 0,
       weekConversions: weekConversions || 0
     })
   }
   ```

2. **Create Stats Cards Component**

   Create `components/stats-cards.tsx`:
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { TrendingUp, Target, CheckCircle, Clock } from 'lucide-react'
   
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
   
   export function StatsCards({ stats }: StatsCardsProps) {
     return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-gray-600">
               Total Restaurants
             </CardTitle>
             <Target className="h-4 w-4 text-gray-400" />
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold">{stats.totalRestaurants}</div>
             <p className="text-xs text-gray-500 mt-1">
               Assigned to you
             </p>
           </CardContent>
         </Card>
         
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-gray-600">
               Converted
             </CardTitle>
             <CheckCircle className="h-4 w-4 text-green-500" />
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold text-green-600">
               {stats.converted}
             </div>
             <p className="text-xs text-gray-500 mt-1">
               {stats.conversionRate}% conversion rate
             </p>
           </CardContent>
         </Card>
         
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-gray-600">
               Pending
             </CardTitle>
             <Clock className="h-4 w-4 text-yellow-500" />
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold text-yellow-600">
               {stats.pending}
             </div>
             <p className="text-xs text-gray-500 mt-1">
               Need attention
             </p>
           </CardContent>
         </Card>
         
         <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-medium text-gray-600">
               This Week
             </CardTitle>
             <TrendingUp className="h-4 w-4 text-blue-500" />
           </CardHeader>
           <CardContent>
             <div className="text-3xl font-bold text-blue-600">
               {stats.weekConversions}
             </div>
             <p className="text-xs text-gray-500 mt-1">
               {stats.todayConversions} today
             </p>
           </CardContent>
         </Card>
       </div>
     )
   }
   ```

3. **Add to Dashboard Page**
   ```typescript
   // In app/page.tsx
   const [stats, setStats] = useState(null)
   
   useEffect(() => {
     async function loadStats() {
       const res = await fetch('/api/stats/kam?kam_name=Anudeep Pawar')
       const data = await res.json()
       setStats(data)
     }
     loadStats()
   }, [])
   
   // In render:
   {stats && <StatsCards stats={stats} />}
   ```

**Deliverable:** KAM stats dashboard with key metrics

---

### Task 4.2: Build Priority Restaurant List (Priority: HIGH)

**Estimated Time:** 3 hours

**Steps:**

1. **Create Priority Algorithm**

   Create `lib/priority.ts`:
   ```typescript
   import type { Restaurant } from './database.types'
   
   export function calculatePriority(restaurant: any): number {
     let score = 0
     
     // High OV = higher priority
     if (restaurant.sept_ov > 500) score += 40
     else if (restaurant.sept_ov > 200) score += 30
     else if (restaurant.sept_ov > 100) score += 20
     else score += 10
     
     // Not approached yet = higher priority
     if (!restaurant.approached) score += 30
     
     // Multiple drives = higher priority
     if (restaurant.driveCount > 1) score += 20
     
     // Active promos = lower priority (already engaged)
     if (restaurant.la_active_promos || restaurant.mm_active_promos) {
       score -= 10
     }
     
     return Math.min(100, Math.max(0, score))
   }
   ```

2. **Create Priority List Component**

   Create `components/priority-list.tsx`:
   ```typescript
   'use client'
   
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { Button } from '@/components/ui/button'
   import { ArrowRight, Flame } from 'lucide-react'
   import Link from 'next/link'
   
   export function PriorityList({ restaurants }: { restaurants: any[] }) {
     // Sort by priority score
     const prioritized = restaurants
       .sort((a, b) => b.priority_score - a.priority_score)
       .slice(0, 10)
     
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Flame className="h-5 w-5 text-orange-500" />
             Top Priority Restaurants
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3">
             {prioritized.map((restaurant, index) => (
               <div
                 key={restaurant.res_id}
                 className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
               >
                 <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                     {index + 1}
                   </div>
                   <div>
                     <p className="font-medium">{restaurant.res_name}</p>
                     <p className="text-sm text-gray-500">
                       OV: {restaurant.sept_ov} • {restaurant.locality}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <Badge variant="secondary">
                     Score: {restaurant.priority_score}
                   </Badge>
                   <Link href={`/restaurant/${restaurant.res_id}`}>
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

### Task 4.3: Add Performance Charts (Priority: HIGH)

**Estimated Time:** 5 hours

**Steps:**

1. **Install Recharts**
   ```bash
   pnpm install recharts
   ```

2. **Create Conversion Trend Chart**

   Create `components/charts/conversion-trend.tsx`:
   ```typescript
   'use client'
   
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
   
   export function ConversionTrendChart({ data }: { data: any[] }) {
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
                 stroke="#22c55e" 
                 strokeWidth={2}
               />
             </LineChart>
           </ResponsiveContainer>
         </CardContent>
       </Card>
     )
   }
   ```

3. **Create Drive Type Distribution Chart**

   Create `components/charts/drive-distribution.tsx`:
   ```typescript
   'use client'
   
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
   
   const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
   
   export function DriveDistributionChart({ data }: { data: any[] }) {
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
                 {data.map((entry, index) => (
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

4. **Fetch Chart Data**

   Create `app/api/stats/charts/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import { supabase } from '@/lib/supabase'
   
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const kamName = searchParams.get('kam_name')
     
     // Last 30 days conversion trend
     const { data: trendData } = await supabase
       .from('conversion_tracking')
       .select('action_date')
       .eq('kam_name', kamName)
       .eq('action_type', 'converted')
       .gte('action_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
     
     // Group by date
     const trendByDate = trendData?.reduce((acc, item) => {
       const date = item.action_date
       acc[date] = (acc[date] || 0) + 1
       return acc
     }, {} as Record<string, number>)
     
     const trend = Object.entries(trendByDate || {}).map(([date, conversions]) => ({
       date,
       conversions
     }))
     
     // Drive type distribution
     const { data: driveData } = await supabase
       .from('conversion_tracking')
       .select(`
         drive_id,
         drives (drive_type)
       `)
       .eq('kam_name', kamName)
       .eq('action_type', 'converted')
     
     const driveDistribution = driveData?.reduce((acc, item) => {
       const type = item.drives?.drive_type || 'unknown'
       acc[type] = (acc[type] || 0) + 1
       return acc
     }, {} as Record<string, number>)
     
     const distribution = Object.entries(driveDistribution || {}).map(([name, value]) => ({
       name,
       value
     }))
     
     return NextResponse.json({
       trend,
       distribution
     })
   }
   ```

**Deliverable:** Interactive charts showing performance trends

---

### Task 4.4: Build Zonal Head Dashboard (Priority: MEDIUM)

**Estimated Time:** 6 hours

**Steps:**

1. **Create Zonal Dashboard Page**

   Create `app/zonal/page.tsx`:
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { KAMLeaderboard } from '@/components/kam-leaderboard'
   import { CitySummary } from '@/components/city-summary'
   import { TeamPerformance } from '@/components/team-performance'
   
   export default function ZonalDashboard() {
     const [teamData, setTeamData] = useState([])
     
     useEffect(() => {
       async function loadData() {
         const res = await fetch('/api/stats/team')
         const data = await res.json()
         setTeamData(data)
       }
       loadData()
     }, [])
     
     return (
       <div className="space-y-6">
         <h1 className="text-3xl font-bold">Zonal Dashboard</h1>
         
         <CitySummary />
         <KAMLeaderboard data={teamData} />
         <TeamPerformance data={teamData} />
       </div>
     )
   }
   ```

2. **Create KAM Leaderboard Component**

   Create `components/kam-leaderboard.tsx`:
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { Trophy, Medal } from 'lucide-react'
   
   export function KAMLeaderboard({ data }: { data: any[] }) {
     const sorted = data.sort((a, b) => b.conversion_rate - a.conversion_rate)
     
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Trophy className="h-5 w-5 text-yellow-500" />
             KAM Leaderboard
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-3">
             {sorted.map((kam, index) => (
               <div
                 key={kam.kam_name}
                 className="flex items-center justify-between p-4 rounded-lg border"
               >
                 <div className="flex items-center gap-4">
                   <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                     index === 0 ? 'bg-yellow-100 text-yellow-600' :
                     index === 1 ? 'bg-gray-100 text-gray-600' :
                     index === 2 ? 'bg-orange-100 text-orange-600' :
                     'bg-blue-50 text-blue-600'
                   } font-bold`}>
                     {index + 1}
                   </div>
                   <div>
                     <p className="font-semibold">{kam.kam_name}</p>
                     <p className="text-sm text-gray-500">
                       {kam.converted} / {kam.total_restaurants} converted
                     </p>
                   </div>
                 </div>
                 <Badge variant="secondary" className="text-lg px-4 py-2">
                   {kam.conversion_rate}%
                 </Badge>
               </div>
             ))}
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

3. **Create Team Stats API**

   Create `app/api/stats/team/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import { supabase } from '@/lib/supabase'
   
   export async function GET() {
     const { data } = await supabase
       .from('kam_performance')
       .select('*')
       .order('conversion_rate', { ascending: false })
     
     return NextResponse.json(data || [])
   }
   ```

**Deliverable:** Zonal Head dashboard with team overview

---

### Task 4.5: Add Export Functionality (Priority: LOW)

**Estimated Time:** 2 hours

**Steps:**

1. **Install Export Library**
   ```bash
   pnpm install xlsx
   ```

2. **Create Export Button**
   ```typescript
   import * as XLSX from 'xlsx'
   
   function exportToExcel(data: any[], filename: string) {
     const ws = XLSX.utils.json_to_sheet(data)
     const wb = XLSX.utils.book_new()
     XLSX.utils.book_append_sheet(wb, ws, 'Data')
     XLSX.writeFile(wb, `${filename}.xlsx`)
   }
   ```

**Deliverable:** Export reports to Excel

---

## ✅ Sprint Completion Checklist

- [ ] KAM stats cards showing correct data
- [ ] Priority list ranking restaurants
- [ ] Conversion trend chart working
- [ ] Drive distribution pie chart
- [ ] Zonal dashboard accessible
- [ ] KAM leaderboard functional
- [ ] Export to Excel working

---

**Next Sprint:** [Sprint 5 - Advanced Features (AI & Automation)](SPRINT-05-ADVANCED.md)

