# ⚡ Sprint 3: Core Features - Multi-Drive View & Activation

**Duration:** 5-7 days  
**Goal:** Build the essential KAM workflow features - multi-drive visibility, discount editing, and activation.

**Prerequisites:** Sprint 2 completed ✅ (Basic dashboard working)

---

## 🎯 Sprint Objectives

By the end of this sprint, you will have:

✅ Restaurant detail page showing all drives  
✅ Multi-drive indicator on restaurant cards  
✅ Editable discount fields  
✅ One-click activation button  
✅ Status tracking (Pending → Approached → Converted)  
✅ Conversion event logging  
✅ Real-time status updates  

---

## 📋 Task Breakdown

### Task 3.1: Build Restaurant Detail Page (Priority: CRITICAL)

**Estimated Time:** 4 hours

**Steps:**

1. **Create Detail Page Route**

   Create `app/restaurant/[id]/page.tsx`:
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { useParams } from 'next/navigation'
   import { supabase } from '@/lib/supabase'
   import type { Restaurant, DriveData } from '@/lib/database.types'
   
   export default function RestaurantDetailPage() {
     const params = useParams()
     const resId = params.id as string
     
     const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
     const [driveData, setDriveData] = useState<any[]>([])
     const [loading, setLoading] = useState(true)
     
     useEffect(() => {
       async function loadData() {
         // Fetch restaurant
         const { data: resData } = await supabase
           .from('restaurants')
           .select('*')
           .eq('res_id', resId)
           .single()
         
         // Fetch all drives for this restaurant
         const { data: drivesData } = await supabase
           .from('drive_data')
           .select(`
             *,
             drives (
               id,
               drive_name,
               drive_type,
               status
             )
           `)
           .eq('res_id', resId)
         
         setRestaurant(resData)
         setDriveData(drivesData || [])
         setLoading(false)
       }
       
       loadData()
     }, [resId])
     
     if (loading) return <div>Loading...</div>
     if (!restaurant) return <div>Restaurant not found</div>
     
     return (
       <div className="max-w-6xl mx-auto">
         <RestaurantHeader restaurant={restaurant} />
         <DrivesList drives={driveData} resId={resId} />
       </div>
     )
   }
   ```

2. **Create Restaurant Header Component**

   Create `components/restaurant-header.tsx`:
   ```typescript
   import { Card, CardContent } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { MapPin, Utensils, TrendingUp } from 'lucide-react'
   import type { Restaurant } from '@/lib/database.types'
   
   export function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
     return (
       <Card className="mb-6">
         <CardContent className="pt-6">
           <div className="flex items-start justify-between mb-4">
             <div>
               <h1 className="text-3xl font-bold mb-2">{restaurant.res_name}</h1>
               <p className="text-gray-500">ID: {restaurant.res_id}</p>
             </div>
             <Badge variant="outline" className="text-lg px-4 py-2">
               OV: {restaurant.sept_ov}
             </Badge>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
             <div className="flex items-center gap-2">
               <Utensils className="h-5 w-5 text-gray-400" />
               <div>
                 <p className="text-sm text-gray-500">Cuisine</p>
                 <p className="font-medium">{restaurant.cuisine}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
               <MapPin className="h-5 w-5 text-gray-400" />
               <div>
                 <p className="text-sm text-gray-500">Locality</p>
                 <p className="font-medium">{restaurant.locality}</p>
               </div>
             </div>
             
             <div className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-gray-400" />
               <div>
                 <p className="text-sm text-gray-500">Account Type</p>
                 <p className="font-medium">{restaurant.account_type}</p>
               </div>
             </div>
           </div>
           
           <div className="mt-4 pt-4 border-t">
             <p className="text-sm text-gray-500">KAM: {restaurant.kam_name}</p>
             <p className="text-sm text-gray-500">{restaurant.kam_email}</p>
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

**Deliverable:** Restaurant detail page with header

---

### Task 3.2: Build Multi-Drive Display (Priority: CRITICAL)

**Estimated Time:** 5 hours

**Steps:**

1. **Create Drive Card Component**

   Create `components/drive-card.tsx`:
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { Button } from '@/components/ui/button'
   import { CheckCircle, Circle, Clock } from 'lucide-react'
   
   interface DriveCardProps {
     drive: any // TODO: proper type
     onApproach: () => void
     onConvert: () => void
   }
   
   export function DriveCard({ drive, onApproach, onConvert }: DriveCardProps) {
     const driveInfo = drive.drives
     
     // Determine status icon
     const StatusIcon = drive.converted_stepper 
       ? CheckCircle 
       : drive.approached 
       ? Clock 
       : Circle
     
     const statusColor = drive.converted_stepper
       ? 'text-green-600'
       : drive.approached
       ? 'text-yellow-600'
       : 'text-gray-400'
     
     const statusText = drive.converted_stepper
       ? 'Converted'
       : drive.approached
       ? 'Approached'
       : 'Pending'
     
     return (
       <Card>
         <CardHeader>
           <div className="flex items-start justify-between">
             <div>
               <CardTitle className="text-xl">{driveInfo.drive_name}</CardTitle>
               <Badge variant="secondary" className="mt-2">
                 {driveInfo.drive_type}
               </Badge>
             </div>
             <div className={`flex items-center gap-2 ${statusColor}`}>
               <StatusIcon className="h-5 w-5" />
               <span className="font-medium">{statusText}</span>
             </div>
           </div>
         </CardHeader>
         
         <CardContent>
           <div className="space-y-4">
             {/* Customer Segments */}
             <div>
               <h4 className="font-semibold mb-2">Order Volume by Segment</h4>
               <div className="grid grid-cols-3 gap-2 text-sm">
                 <div className="bg-blue-50 p-2 rounded">
                   <p className="text-gray-600">LA</p>
                   <p className="font-bold">{drive.la}</p>
                 </div>
                 <div className="bg-green-50 p-2 rounded">
                   <p className="text-gray-600">MM</p>
                   <p className="font-bold">{drive.mm}</p>
                 </div>
                 <div className="bg-purple-50 p-2 rounded">
                   <p className="text-gray-600">UM</p>
                   <p className="font-bold">{drive.um}</p>
                 </div>
               </div>
             </div>
             
             {/* Suggested Discounts */}
             <div>
               <h4 className="font-semibold mb-2">Suggested Discounts</h4>
               <div className="space-y-2 text-sm">
                 {drive.la_base_code_suggested && (
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600">LA:</span>
                     <Badge variant="outline">{drive.la_base_code_suggested}</Badge>
                   </div>
                 )}
                 {drive.mm_base_code_suggested && (
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600">MM:</span>
                     <Badge variant="outline">{drive.mm_base_code_suggested}</Badge>
                   </div>
                 )}
                 {drive.um_base_code_suggested && (
                   <div className="flex justify-between items-center">
                     <span className="text-gray-600">UM:</span>
                     <Badge variant="outline">{drive.um_base_code_suggested}</Badge>
                   </div>
                 )}
               </div>
             </div>
             
             {/* Actions */}
             <div className="flex gap-2 pt-4 border-t">
               {!drive.approached && (
                 <Button onClick={onApproach} variant="outline" className="flex-1">
                   Mark as Approached
                 </Button>
               )}
               {drive.approached && !drive.converted_stepper && (
                 <Button onClick={onConvert} className="flex-1">
                   Mark as Converted
                 </Button>
               )}
               {drive.converted_stepper && (
                 <Button disabled className="flex-1">
                   ✓ Completed
                 </Button>
               )}
             </div>
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

2. **Create Drives List Component**

   Create `components/drives-list.tsx`:
   ```typescript
   'use client'
   
   import { useState } from 'react'
   import { DriveCard } from './drive-card'
   import { supabase } from '@/lib/supabase'
   import { useToast } from '@/components/ui/use-toast'
   
   export function DrivesList({ drives, resId }: { drives: any[]; resId: string }) {
     const [driveData, setDriveData] = useState(drives)
     const { toast } = useToast()
     
     const handleApproach = async (driveId: number) => {
       try {
         // Update drive_data
         await supabase
           .from('drive_data')
           .update({ approached: true })
           .eq('res_id', resId)
           .eq('drive_id', driveId)
         
         // Log conversion event
         await supabase
           .from('conversion_tracking')
           .insert({
             res_id: resId,
             drive_id: driveId,
             kam_name: 'Anudeep Pawar', // TODO: Get from auth
             action_type: 'approached'
           })
         
         // Update local state
         setDriveData(prev => prev.map(d => 
           d.drive_id === driveId ? { ...d, approached: true } : d
         ))
         
         toast({
           title: 'Success',
           description: 'Restaurant marked as approached'
         })
       } catch (error) {
         toast({
           title: 'Error',
           description: 'Failed to update status',
           variant: 'destructive'
         })
       }
     }
     
     const handleConvert = async (driveId: number) => {
       try {
         await supabase
           .from('drive_data')
           .update({ converted_stepper: true })
           .eq('res_id', resId)
           .eq('drive_id', driveId)
         
         await supabase
           .from('conversion_tracking')
           .insert({
             res_id: resId,
             drive_id: driveId,
             kam_name: 'Anudeep Pawar',
             action_type: 'converted'
           })
         
         setDriveData(prev => prev.map(d => 
           d.drive_id === driveId ? { ...d, converted_stepper: true } : d
         ))
         
         toast({
           title: 'Success',
           description: 'Restaurant marked as converted! 🎉'
         })
       } catch (error) {
         toast({
           title: 'Error',
           description: 'Failed to update status',
           variant: 'destructive'
         })
       }
     }
     
     if (driveData.length === 0) {
       return (
         <div className="text-center py-12 text-gray-500">
           No active drives for this restaurant
         </div>
       )
     }
     
     return (
       <div>
         <h2 className="text-2xl font-bold mb-4">
           Active Drives ({driveData.length})
         </h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {driveData.map((drive) => (
             <DriveCard
               key={drive.id}
               drive={drive}
               onApproach={() => handleApproach(drive.drive_id)}
               onConvert={() => handleConvert(drive.drive_id)}
             />
           ))}
         </div>
       </div>
     )
   }
   ```

**Deliverable:** Multi-drive view with status tracking

---

### Task 3.3: Add Editable Discount Fields (Priority: HIGH)

**Estimated Time:** 4 hours

**Steps:**

1. **Create Discount Editor Component**

   Create `components/discount-editor.tsx`:
   ```typescript
   'use client'
   
   import { useState } from 'react'
   import { Input } from '@/components/ui/input'
   import { Button } from '@/components/ui/button'
   import { Label } from '@/components/ui/label'
   import { Pencil, Check, X } from 'lucide-react'
   
   interface DiscountEditorProps {
     segment: 'LA' | 'MM' | 'UM'
     initialValue: string
     onSave: (newValue: string) => Promise<void>
   }
   
   export function DiscountEditor({ segment, initialValue, onSave }: DiscountEditorProps) {
     const [isEditing, setIsEditing] = useState(false)
     const [value, setValue] = useState(initialValue)
     const [saving, setSaving] = useState(false)
     
     const handleSave = async () => {
       setSaving(true)
       try {
         await onSave(value)
         setIsEditing(false)
       } catch (error) {
         console.error('Failed to save:', error)
       } finally {
         setSaving(false)
       }
     }
     
     const handleCancel = () => {
       setValue(initialValue)
       setIsEditing(false)
     }
     
     if (!isEditing) {
       return (
         <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
           <div>
             <Label className="text-xs text-gray-500">{segment}</Label>
             <p className="font-medium">{value || 'Not set'}</p>
           </div>
           <Button
             size="sm"
             variant="ghost"
             onClick={() => setIsEditing(true)}
           >
             <Pencil className="h-4 w-4" />
           </Button>
         </div>
       )
     }
     
     return (
       <div className="p-2 border rounded">
         <Label className="text-xs text-gray-500">{segment}</Label>
         <div className="flex gap-2 mt-1">
           <Input
             value={value}
             onChange={(e) => setValue(e.target.value)}
             placeholder="e.g., 40 upto 80"
             className="flex-1"
           />
           <Button
             size="sm"
             onClick={handleSave}
             disabled={saving}
           >
             <Check className="h-4 w-4" />
           </Button>
           <Button
             size="sm"
             variant="outline"
             onClick={handleCancel}
             disabled={saving}
           >
             <X className="h-4 w-4" />
           </Button>
         </div>
       </div>
     )
   }
   ```

2. **Integrate into Drive Card**

   Update `drive-card.tsx` to use `DiscountEditor`:
   ```typescript
   import { DiscountEditor } from './discount-editor'
   
   // In DriveCard component:
   const handleDiscountSave = async (segment: string, newValue: string) => {
     const field = `${segment.toLowerCase()}_base_code_suggested`
     
     await supabase
       .from('drive_data')
       .update({ [field]: newValue })
       .eq('id', drive.id)
     
     // Update local state
     // ...
   }
   
   // In render:
   <div className="space-y-2">
     <DiscountEditor
       segment="LA"
       initialValue={drive.la_base_code_suggested}
       onSave={(val) => handleDiscountSave('LA', val)}
     />
     <DiscountEditor
       segment="MM"
       initialValue={drive.mm_base_code_suggested}
       onSave={(val) => handleDiscountSave('MM', val)}
     />
     <DiscountEditor
       segment="UM"
       initialValue={drive.um_base_code_suggested}
       onSave={(val) => handleDiscountSave('UM', val)}
     />
   </div>
   ```

**Deliverable:** Editable discount fields with save functionality

---

### Task 3.4: Build Activation Flow (Priority: HIGH)

**Estimated Time:** 4 hours

**Steps:**

1. **Create Activation Dialog**

   Create `components/activation-dialog.tsx`:
   ```typescript
   'use client'
   
   import { useState } from 'react'
   import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
   } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'
   import { Textarea } from '@/components/ui/textarea'
   import { Label } from '@/components/ui/label'
   
   interface ActivationDialogProps {
     open: boolean
     onClose: () => void
     onConfirm: (notes: string) => Promise<void>
     restaurantName: string
     discount: string
   }
   
   export function ActivationDialog({
     open,
     onClose,
     onConfirm,
     restaurantName,
     discount
   }: ActivationDialogProps) {
     const [notes, setNotes] = useState('')
     const [loading, setLoading] = useState(false)
     
     const handleConfirm = async () => {
       setLoading(true)
       try {
         await onConfirm(notes)
         onClose()
       } catch (error) {
         console.error('Activation failed:', error)
       } finally {
         setLoading(false)
       }
     }
     
     return (
       <Dialog open={open} onOpenChange={onClose}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Activate Discount</DialogTitle>
             <DialogDescription>
               Confirm activation for {restaurantName}
             </DialogDescription>
           </DialogHeader>
           
           <div className="space-y-4 py-4">
             <div>
               <Label>Discount to Activate</Label>
               <p className="text-lg font-bold text-green-600">{discount}</p>
             </div>
             
             <div>
               <Label htmlFor="notes">Notes (Optional)</Label>
               <Textarea
                 id="notes"
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 placeholder="Add any notes about this activation..."
                 rows={3}
               />
             </div>
           </div>
           
           <DialogFooter>
             <Button variant="outline" onClick={onClose} disabled={loading}>
               Cancel
             </Button>
             <Button onClick={handleConfirm} disabled={loading}>
               {loading ? 'Activating...' : 'Confirm Activation'}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     )
   }
   ```

2. **Add Activation Button to Drive Card**
   - Add "Activate" button
   - Open dialog on click
   - Trigger n8n webhook on confirmation

**Deliverable:** Complete activation workflow

---

### Task 3.5: Add Multi-Drive Indicator (Priority: MEDIUM)

**Estimated Time:** 2 hours

**Steps:**

1. **Update Restaurant Card Query**
   ```typescript
   // In getRestaurantsByKAM function
   const { data } = await supabase
     .from('restaurants')
     .select(`
       *,
       drive_data (
         drive_id
       )
     `)
     .eq('kam_name', kamName)
   
   // Count drives per restaurant
   const restaurantsWithDriveCount = data.map(r => ({
     ...r,
     driveCount: r.drive_data.length
   }))
   ```

2. **Highlight Multi-Drive Restaurants**
   - Add colored border for restaurants in >1 drive
   - Show badge with drive count
   - Sort by drive count (descending)

**Deliverable:** Visual indicator for multi-drive restaurants

---

## ✅ Sprint Completion Checklist

- [ ] Restaurant detail page working
- [ ] All drives displayed for a restaurant
- [ ] Status tracking (Pending/Approached/Converted)
- [ ] Discount fields are editable
- [ ] Activation dialog functional
- [ ] Multi-drive indicator visible
- [ ] Conversion events logged to database
- [ ] Toast notifications working

---

**Next Sprint:** [Sprint 4 - Analytics & Insights](SPRINT-04-ANALYTICS.md)

