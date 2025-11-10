# 🎨 Sprint 2: Basic UI - Dashboard Foundation

**Duration:** 5-7 days  
**Goal:** Build the core KAM dashboard with restaurant list, filters, and basic interactions.

**Prerequisites:** Sprint 1 completed ✅ (Data pipeline working)

---

## 🎯 Sprint Objectives

By the end of this sprint, you will have:

✅ Next.js project initialized with Shadcn/ui  
✅ Supabase client configured  
✅ KAM dashboard showing restaurant list  
✅ Filtering by city, KAM, drive type, status  
✅ Search functionality  
✅ Responsive design (mobile + desktop)  
✅ Basic authentication (KAM login)  

---

## 📋 Task Breakdown

### Task 2.1: Initialize Next.js Project (Priority: CRITICAL)

**Estimated Time:** 1 hour

**Steps:**

1. **Create Next.js App**
   ```bash
   npx create-next-app@latest zomato-dashboard
   
   # Options:
   # ✅ TypeScript
   # ✅ ESLint
   # ✅ Tailwind CSS
   # ✅ App Router
   # ✅ Import alias (@/*)
   # ❌ src/ directory (optional)
   ```

2. **Install Dependencies**
   ```bash
   cd zomato-dashboard
   pnpm install @supabase/supabase-js
   pnpm install @supabase/auth-helpers-nextjs
   pnpm install date-fns
   pnpm install lucide-react
   ```

3. **Initialize Shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   
   # Options:
   # Style: Default
   # Base color: Slate
   # CSS variables: Yes
   ```

4. **Install Required Shadcn Components**
   ```bash
   npx shadcn-ui@latest add button
   npx shadcn-ui@latest add card
   npx shadcn-ui@latest add input
   npx shadcn-ui@latest add table
   npx shadcn-ui@latest add select
   npx shadcn-ui@latest add badge
   npx shadcn-ui@latest add dialog
   npx shadcn-ui@latest add dropdown-menu
   npx shadcn-ui@latest add avatar
   ```

5. **Configure Environment Variables**
   ```env
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

6. **Test Development Server**
   ```bash
   pnpm dev
   # Open http://localhost:3000
   ```

**Deliverable:** Next.js app running with Shadcn/ui

---

### Task 2.2: Set Up Supabase Client (Priority: CRITICAL)

**Estimated Time:** 1 hour

**Steps:**

1. **Create Supabase Client Utility**

   Create `lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

2. **Create Database Types**

   Create `lib/database.types.ts`:
   ```typescript
   export interface Restaurant {
     res_id: string
     res_name: string
     kam_name: string
     kam_email: string
     tl_email: string
     cuisine: string
     locality: string
     account_type: string
     sept_ov: number
     created_at: string
     updated_at: string
   }
   
   export interface Drive {
     id: number
     drive_name: string
     drive_type: 'discount' | 'menu' | 'ads'
     city: string
     zone?: string
     start_date: string
     end_date: string
     status: 'active' | 'completed' | 'paused'
   }
   
   export interface DriveData {
     id: number
     res_id: string
     drive_id: number
     um: number
     mm: number
     la: number
     la_base_code_suggested?: string
     mm_base_code_suggested?: string
     um_base_code_suggested?: string
     approached: boolean
     converted_stepper: boolean
     priority_score: number
     last_updated: string
   }
   
   export interface ConversionEvent {
     id: number
     res_id: string
     drive_id: number
     kam_name: string
     action_type: 'approached' | 'converted' | 'activated' | 'rejected'
     action_date: string
     discount_applied?: string
     notes?: string
     created_at: string
   }
   ```

3. **Create API Helper Functions**

   Create `lib/api.ts`:
   ```typescript
   import { supabase } from './supabase'
   import type { Restaurant, DriveData } from './database.types'
   
   export async function getRestaurantsByKAM(kamName: string) {
     const { data, error } = await supabase
       .from('restaurants')
       .select('*')
       .eq('kam_name', kamName)
       .order('sept_ov', { ascending: false })
     
     if (error) throw error
     return data as Restaurant[]
   }
   
   export async function getDriveDataForRestaurant(resId: string) {
     const { data, error } = await supabase
       .from('drive_data')
       .select(`
         *,
         drives (
           drive_name,
           drive_type,
           status
         )
       `)
       .eq('res_id', resId)
     
     if (error) throw error
     return data
   }
   
   export async function markAsApproached(resId: string, driveId: number, kamName: string) {
     // Update drive_data
     const { error: updateError } = await supabase
       .from('drive_data')
       .update({ approached: true })
       .eq('res_id', resId)
       .eq('drive_id', driveId)
     
     if (updateError) throw updateError
     
     // Log conversion event
     const { error: logError } = await supabase
       .from('conversion_tracking')
       .insert({
         res_id: resId,
         drive_id: driveId,
         kam_name: kamName,
         action_type: 'approached'
       })
     
     if (logError) throw logError
   }
   ```

**Deliverable:** Supabase client configured with type-safe API functions

---

### Task 2.3: Build Main Layout (Priority: HIGH)

**Estimated Time:** 3 hours

**Steps:**

1. **Create App Layout**

   Create `app/layout.tsx`:
   ```typescript
   import './globals.css'
   import { Inter } from 'next/font/google'
   import { Navbar } from '@/components/navbar'
   
   const inter = Inter({ subsets: ['latin'] })
   
   export const metadata = {
     title: 'Zomato Drive Dashboard',
     description: 'Centralized dashboard for KAM drive management',
   }
   
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body className={inter.className}>
           <Navbar />
           <main className="container mx-auto px-4 py-8">
             {children}
           </main>
         </body>
       </html>
     )
   }
   ```

2. **Create Navbar Component**

   Create `components/navbar.tsx`:
   ```typescript
   import { Avatar, AvatarFallback } from '@/components/ui/avatar'
   import { Button } from '@/components/ui/button'
   import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
   } from '@/components/ui/dropdown-menu'
   
   export function Navbar() {
     return (
       <nav className="border-b bg-white">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <h1 className="text-2xl font-bold text-red-600">Zomato</h1>
             <span className="text-gray-600">Drive Dashboard</span>
           </div>
           
           <div className="flex items-center gap-4">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                   <Avatar>
                     <AvatarFallback>AP</AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem>Profile</DropdownMenuItem>
                 <DropdownMenuItem>Settings</DropdownMenuItem>
                 <DropdownMenuItem>Logout</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
         </div>
       </nav>
     )
   }
   ```

**Deliverable:** Professional layout with navigation

---

### Task 2.4: Build Restaurant List Component (Priority: CRITICAL)

**Estimated Time:** 4 hours

**Steps:**

1. **Create Restaurant Card Component**

   Create `components/restaurant-card.tsx`:
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { Button } from '@/components/ui/button'
   import type { Restaurant } from '@/lib/database.types'
   
   interface RestaurantCardProps {
     restaurant: Restaurant
     driveCount?: number
     onViewDetails: () => void
   }
   
   export function RestaurantCard({ restaurant, driveCount = 0, onViewDetails }: RestaurantCardProps) {
     return (
       <Card className="hover:shadow-lg transition-shadow">
         <CardHeader>
           <div className="flex items-start justify-between">
             <div>
               <CardTitle className="text-lg">{restaurant.res_name}</CardTitle>
               <p className="text-sm text-gray-500">ID: {restaurant.res_id}</p>
             </div>
             {driveCount > 1 && (
               <Badge variant="secondary">{driveCount} Drives</Badge>
             )}
           </div>
         </CardHeader>
         <CardContent>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-gray-600">Cuisine:</span>
               <span className="font-medium">{restaurant.cuisine}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600">Locality:</span>
               <span className="font-medium">{restaurant.locality}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600">Order Volume:</span>
               <span className="font-bold text-green-600">{restaurant.sept_ov}</span>
             </div>
           </div>
           <Button 
             className="w-full mt-4" 
             variant="outline"
             onClick={onViewDetails}
           >
             View Details
           </Button>
         </CardContent>
       </Card>
     )
   }
   ```

2. **Create Restaurant List Page**

   Create `app/page.tsx`:
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { RestaurantCard } from '@/components/restaurant-card'
   import { getRestaurantsByKAM } from '@/lib/api'
   import type { Restaurant } from '@/lib/database.types'
   
   export default function DashboardPage() {
     const [restaurants, setRestaurants] = useState<Restaurant[]>([])
     const [loading, setLoading] = useState(true)
     
     useEffect(() => {
       async function loadData() {
         try {
           // TODO: Get KAM name from auth context
           const data = await getRestaurantsByKAM('Anudeep Pawar')
           setRestaurants(data)
         } catch (error) {
           console.error('Error loading restaurants:', error)
         } finally {
           setLoading(false)
         }
       }
       
       loadData()
     }, [])
     
     if (loading) {
       return <div className="text-center py-12">Loading...</div>
     }
     
     return (
       <div>
         <div className="mb-6">
           <h2 className="text-3xl font-bold">My Restaurants</h2>
           <p className="text-gray-600">Total: {restaurants.length}</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {restaurants.map((restaurant) => (
             <RestaurantCard
               key={restaurant.res_id}
               restaurant={restaurant}
               onViewDetails={() => {
                 // TODO: Navigate to details page
                 console.log('View details:', restaurant.res_id)
               }}
             />
           ))}
         </div>
       </div>
     )
   }
   ```

**Deliverable:** Restaurant list displaying real data from Supabase

---

### Task 2.5: Add Filtering & Search (Priority: HIGH)

**Estimated Time:** 4 hours

**Steps:**

1. **Create Filter Bar Component**

   Create `components/filter-bar.tsx`:
   ```typescript
   'use client'
   
   import { Input } from '@/components/ui/input'
   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
   import { Search } from 'lucide-react'
   
   interface FilterBarProps {
     onSearchChange: (value: string) => void
     onCityChange: (value: string) => void
     onStatusChange: (value: string) => void
   }
   
   export function FilterBar({ onSearchChange, onCityChange, onStatusChange }: FilterBarProps) {
     return (
       <div className="bg-white p-4 rounded-lg shadow mb-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Search */}
           <div className="relative">
             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
             <Input
               placeholder="Search restaurants..."
               className="pl-10"
               onChange={(e) => onSearchChange(e.target.value)}
             />
           </div>
           
           {/* City Filter */}
           <Select onValueChange={onCityChange}>
             <SelectTrigger>
               <SelectValue placeholder="All Cities" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Cities</SelectItem>
               <SelectItem value="pune">Pune</SelectItem>
               <SelectItem value="mumbai">Mumbai</SelectItem>
               <SelectItem value="bangalore">Bangalore</SelectItem>
             </SelectContent>
           </Select>
           
           {/* Status Filter */}
           <Select onValueChange={onStatusChange}>
             <SelectTrigger>
               <SelectValue placeholder="All Status" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="approached">Approached</SelectItem>
               <SelectItem value="converted">Converted</SelectItem>
             </SelectContent>
           </Select>
           
           {/* OV Range - TODO */}
           <div className="text-sm text-gray-500 flex items-center">
             Showing {/* count */} restaurants
           </div>
         </div>
       </div>
     )
   }
   ```

2. **Add Filtering Logic to Dashboard**

   Update `app/page.tsx`:
   ```typescript
   const [searchTerm, setSearchTerm] = useState('')
   const [cityFilter, setCityFilter] = useState('all')
   const [statusFilter, setStatusFilter] = useState('all')
   
   const filteredRestaurants = restaurants.filter((restaurant) => {
     // Search filter
     if (searchTerm && !restaurant.res_name.toLowerCase().includes(searchTerm.toLowerCase())) {
       return false
     }
     
     // City filter (based on locality for now)
     if (cityFilter !== 'all' && !restaurant.locality.toLowerCase().includes(cityFilter)) {
       return false
     }
     
     // Status filter - TODO: join with drive_data
     
     return true
   })
   ```

**Deliverable:** Working filters and search

---

### Task 2.6: Add Loading & Error States (Priority: MEDIUM)

**Estimated Time:** 2 hours

**Steps:**

1. **Create Loading Skeleton**

   Create `components/restaurant-skeleton.tsx`:
   ```typescript
   import { Card, CardContent, CardHeader } from '@/components/ui/card'
   
   export function RestaurantSkeleton() {
     return (
       <Card>
         <CardHeader>
           <div className="h-6 bg-gray-200 rounded animate-pulse" />
           <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
         </CardHeader>
         <CardContent>
           <div className="space-y-2">
             <div className="h-4 bg-gray-200 rounded animate-pulse" />
             <div className="h-4 bg-gray-200 rounded animate-pulse" />
             <div className="h-4 bg-gray-200 rounded animate-pulse" />
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

2. **Add Error Boundary**

   Create `components/error-state.tsx`:
   ```typescript
   import { AlertCircle } from 'lucide-react'
   import { Button } from '@/components/ui/button'
   
   export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
     return (
       <div className="text-center py-12">
         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
         <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
         <p className="text-gray-600 mb-4">{message}</p>
         <Button onClick={onRetry}>Try Again</Button>
       </div>
     )
   }
   ```

**Deliverable:** Better UX with loading and error states

---

## ✅ Sprint Completion Checklist

- [ ] Next.js app running on localhost:3000
- [ ] Shadcn/ui components installed and working
- [ ] Supabase client configured
- [ ] Restaurant list displays real data
- [ ] Filters work (search, city, status)
- [ ] Responsive design (test on mobile)
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Code committed to Git

---

## 🧪 Testing Checklist

- [ ] Dashboard loads within 2 seconds
- [ ] Search filters results in real-time
- [ ] Filters can be combined (search + city)
- [ ] Mobile view is usable
- [ ] No console errors
- [ ] Data refreshes correctly

---

## 📊 Success Metrics

- **Page Load Time:** <2 seconds
- **Filter Response Time:** <100ms
- **Mobile Usability:** All features accessible
- **Data Accuracy:** 100% match with database

---

**Next Sprint:** [Sprint 3 - Core Features (Multi-Drive & Activation)](SPRINT-03-FEATURES.md)

