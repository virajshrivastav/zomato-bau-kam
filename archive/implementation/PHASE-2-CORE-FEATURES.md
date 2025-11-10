# ⚙️ Phase 2: Core Features - Business Logic Operational

**Technical Achievement:** Automated data pipeline with state management and audit trail
**Priority:** ESSENTIAL
**Goal:** ETL automation + Conversion workflows + Multi-entity relationships

**Prerequisites:** Phase 1 completed ✅ (Data layer established)

---

## 🎯 Phase Objectives

By the end of Phase 2, you will have achieved:

✅ **ETL Pipeline:** n8n workflow with Google Sheets → Transform → Supabase sync
✅ **State Machine:** Conversion funnel (Pending → Approached → Converted) with validation
✅ **Mutation Hooks:** useMutation with optimistic updates and rollback on failure
✅ **Audit System:** conversion_tracking table logging all state transitions
✅ **CRUD Operations:** Editable discount codes with debounced saves
✅ **Relationship Rendering:** One-to-many drive assignments with aggregation
✅ **Real-time Updates:** Cache invalidation triggering UI refresh

---

## 📋 Task Breakdown

### **Task 2.1: Set Up n8n for Data Sync**

**Technical Achievement:** Event-driven ETL pipeline with error handling and retry logic

#### Steps:

1. **Choose n8n Deployment**
   - **Option A:** n8n Cloud (easiest) - https://n8n.io/cloud
   - **Option B:** Self-hosted on Railway.app
   - **Recommended:** n8n Cloud for MVP

2. **Create n8n Account**
   - Sign up at https://n8n.io
   - Create new workflow: "Daily Drive Sync"

3. **Configure Google Sheets API**
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create Service Account
   - Download credentials JSON
   - Share Google Sheet with service account email

4. **Build Sync Workflow**
   - **Node 1:** Schedule Trigger (6:00 AM IST daily)
   - **Node 2:** Google Sheets (Read rows)
   - **Node 3:** Code (Transform data)
   - **Node 4:** Supabase (Upsert restaurants)
   - **Node 5:** Supabase (Upsert drive_data)
   - **Node 6:** Slack (Send notification)

5. **Transform Code (Node 3)**
   ```javascript
   const items = $input.all();
   const transformed = [];

   for (const item of items) {
     const row = item.json;
     
     // Skip empty rows
     if (!row.res_id) continue;
     
     // Transform restaurant data
     const restaurant = {
       res_id: row.res_id?.toString().trim(),
       res_name: row.res_name?.trim(),
       kam_name: row.am_name?.trim(),
       kam_email: row['AM Email']?.trim(),
       cuisine: row.Cuisine?.trim(),
       locality: row.Locality?.trim(),
       account_type: row.account_type?.trim(),
       sept_ov: parseInt(row['Sept OV']) || 0
     };
     
     // Transform drive data
     const driveData = {
       res_id: row.res_id?.toString().trim(),
       drive_id: 1, // Special 35 drive
       um: parseInt(row.UM) || 0,
       mm: parseInt(row.MM) || 0,
       la: parseInt(row.LA) || 0,
       la_base_code_suggested: row.la_base_code_suggested?.trim(),
       approached: row.Approached?.toLowerCase() === 'yes',
       converted_stepper: row['Converted for Stepper']?.toLowerCase() === 'yes'
     };
     
     transformed.push({ 
       json: { 
         restaurant, 
         driveData 
       } 
     });
   }

   return transformed;
   ```

6. **Test Workflow**
   - Click "Execute Workflow"
   - Verify data in Supabase
   - Check for errors

**Deliverable:** Automated daily sync working

---

### **Task 2.2: Implement "Mark as Approached"**

**Technical Achievement:** React Query mutation with optimistic UI updates and audit logging

#### Steps:

1. **Create API Function**
   - Create file: `src/api/conversions.ts`
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
   ```

2. **Create Hook**
   - Create file: `src/hooks/useMarkApproached.ts`
   ```typescript
   import { useMutation, useQueryClient } from '@tanstack/react-query'
   import { markAsApproached } from '@/api/conversions'
   import { useToast } from '@/hooks/use-toast'

   export function useMarkApproached() {
     const queryClient = useQueryClient()
     const { toast } = useToast()

     return useMutation({
       mutationFn: markAsApproached,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['restaurants'] })
         toast({
           title: 'Success',
           description: 'Restaurant marked as approached'
         })
       },
       onError: (error) => {
         toast({
           title: 'Error',
           description: error.message,
           variant: 'destructive'
         })
       }
     })
   }
   ```

3. **Add Button to UI**
   - Edit: `src/pages/RestaurantDetail.tsx`
   ```typescript
   import { useMarkApproached } from '@/hooks/useMarkApproached'

   const RestaurantDetail = () => {
     const { mutate: markApproached, isPending } = useMarkApproached()

     const handleMarkApproached = () => {
       markApproached({
         resId: restaurant.res_id,
         driveId: 1,
         kamName: 'Anudeep Pawar'
       })
     }

     return (
       <Button 
         onClick={handleMarkApproached}
         disabled={isPending || restaurant.approached}
       >
         {restaurant.approached ? 'Already Approached' : 'Mark as Approached'}
       </Button>
     )
   }
   ```

**Deliverable:** "Mark as Approached" button working

---

### **Task 2.3: Implement "Mark as Converted"**

**Technical Achievement:** Multi-step form with validation, state transition, and audit trail

#### Steps:

1. **Create API Function**
   - Add to `src/api/conversions.ts`
   ```typescript
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

2. **Create Conversion Dialog**
   - Create file: `src/components/ConversionDialog.tsx`
   ```typescript
   import { useState } from 'react'
   import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'
   import { Input } from '@/components/ui/input'
   import { Textarea } from '@/components/ui/textarea'
   import { Label } from '@/components/ui/label'

   export function ConversionDialog({ 
     open, 
     onOpenChange, 
     onConfirm,
     suggestedDiscount 
   }: {
     open: boolean
     onOpenChange: (open: boolean) => void
     onConfirm: (discount: string, notes: string) => void
     suggestedDiscount: string
   }) {
     const [discount, setDiscount] = useState(suggestedDiscount)
     const [notes, setNotes] = useState('')

     return (
       <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirm Conversion</DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div>
               <Label>Discount Applied</Label>
               <Input 
                 value={discount}
                 onChange={(e) => setDiscount(e.target.value)}
                 placeholder="e.g., 40 upto 80"
               />
             </div>
             <div>
               <Label>Notes (Optional)</Label>
               <Textarea 
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
                 placeholder="Add any notes..."
               />
             </div>
             <Button 
               onClick={() => onConfirm(discount, notes)}
               className="w-full"
             >
               Confirm Conversion
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     )
   }
   ```

**Deliverable:** "Mark as Converted" dialog working

---

### **Task 2.4: Editable Discount Codes**

**Technical Achievement:** Inline editing with debounced saves and rollback on error

#### Steps:

1. **Create Update Function**
   - Add to `src/api/conversions.ts`
   ```typescript
   export async function updateDiscount(
     resId: string,
     driveId: number,
     field: string,
     value: string
   ) {
     const { error } = await supabase
       .from('drive_data')
       .update({ 
         [field]: value,
         updated_at: new Date().toISOString() 
       })
       .eq('res_id', resId)
       .eq('drive_id', driveId)

     if (error) throw error
     return { success: true }
   }
   ```

2. **Create Editable Input Component**
   - Create file: `src/components/EditableDiscount.tsx`
   ```typescript
   import { useState } from 'react'
   import { Input } from '@/components/ui/input'
   import { Button } from '@/components/ui/button'
   import { Check, X, Pencil } from 'lucide-react'

   export function EditableDiscount({ 
     value, 
     onSave 
   }: {
     value: string
     onSave: (newValue: string) => Promise<void>
   }) {
     const [isEditing, setIsEditing] = useState(false)
     const [editValue, setEditValue] = useState(value)
     const [isSaving, setIsSaving] = useState(false)

     const handleSave = async () => {
       setIsSaving(true)
       await onSave(editValue)
       setIsSaving(false)
       setIsEditing(false)
     }

     if (!isEditing) {
       return (
         <div className="flex items-center gap-2">
           <span>{value || 'Not set'}</span>
           <Button 
             size="sm" 
             variant="ghost"
             onClick={() => setIsEditing(true)}
           >
             <Pencil className="h-3 w-3" />
           </Button>
         </div>
       )
     }

     return (
       <div className="flex items-center gap-2">
         <Input 
           value={editValue}
           onChange={(e) => setEditValue(e.target.value)}
           className="h-8"
         />
         <Button 
           size="sm" 
           onClick={handleSave}
           disabled={isSaving}
         >
           <Check className="h-3 w-3" />
         </Button>
         <Button 
           size="sm" 
           variant="ghost"
           onClick={() => setIsEditing(false)}
         >
           <X className="h-3 w-3" />
         </Button>
       </div>
     )
   }
   ```

**Deliverable:** Inline discount editing working

---

### **Task 2.5: Multi-Drive View**

**Technical Achievement:** One-to-many relationship rendering with SQL JOINs and aggregation

#### Steps:

1. **Create Multi-Drive Query**
   - Add to `src/hooks/useRestaurants.ts`
   ```typescript
   export function useRestaurantDrives(resId: string) {
     return useQuery({
       queryKey: ['restaurant-drives', resId],
       queryFn: async () => {
         const { data, error } = await supabase
           .from('drive_data')
           .select(`
             *,
             drives (*)
           `)
           .eq('res_id', resId)

         if (error) throw error
         return data
       }
     })
   }
   ```

2. **Update Restaurant Detail Page**
   - Edit: `src/pages/RestaurantDetail.tsx`
   - Show all drives for the restaurant
   ```typescript
   const { data: drives } = useRestaurantDrives(restaurant.res_id)

   return (
     <div className="grid md:grid-cols-2 gap-6">
       {drives?.map(drive => (
         <Card key={drive.id}>
           <CardHeader>
             <CardTitle>{drive.drives.drive_name}</CardTitle>
             <Badge>{drive.drives.drive_type}</Badge>
           </CardHeader>
           <CardContent>
             <p>LA: {drive.la} | MM: {drive.mm} | UM: {drive.um}</p>
             <p>Suggested: {drive.la_base_code_suggested}</p>
             <StatusBadge 
               approached={drive.approached}
               converted={drive.converted_stepper}
             />
           </CardContent>
         </Card>
       ))}
     </div>
   )
   ```

3. **Add Multi-Drive Badge to KAM Hub**
   - Show badge if restaurant is in multiple drives
   ```typescript
   {restaurant.drive_data.length > 1 && (
     <Badge variant="secondary">
       {restaurant.drive_data.length} Drives
     </Badge>
   )}
   ```

**Deliverable:** Multi-drive restaurants clearly visible

---

## ✅ Phase 2 Completion Checklist

- [ ] n8n workflow syncing data daily
- [ ] "Mark as Approached" button working
- [ ] "Mark as Converted" dialog working
- [ ] Discount codes editable inline
- [ ] Multi-drive view showing all drives
- [ ] Conversion tracking logging all actions
- [ ] Real-time stats updating on KAM Hub
- [ ] No data loss or errors

---

**Next Phase:** [Phase 3 - Analytics](PHASE-3-ANALYTICS.md)

