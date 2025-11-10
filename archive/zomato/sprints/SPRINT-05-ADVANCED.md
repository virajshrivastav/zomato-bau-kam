# 🤖 Sprint 5: Advanced Features - AI & Automation

**Duration:** 7-10 days  
**Goal:** Implement AI-powered prioritization, automated notifications, and advanced features.

**Prerequisites:** Sprint 4 completed ✅ (Analytics working)

---

## 🎯 Sprint Objectives

By the end of this sprint, you will have:

✅ AI-powered restaurant prioritization engine  
✅ Automated daily email summaries for KAMs  
✅ Slack notifications for key events  
✅ Incentive tracker and calculator  
✅ Historical performance trends  
✅ Bulk actions (mark multiple as approached)  
✅ Advanced filtering (OV range, date range)  
✅ Mobile-optimized views  

---

## 📋 Task Breakdown

### Task 5.1: Build AI Prioritization Engine (Priority: HIGH)

**Estimated Time:** 6 hours

**Steps:**

1. **Create n8n Workflow for AI Prioritization**

   Workflow: "Daily AI Prioritization"
   
   **Nodes:**
   ```
   [Schedule Trigger: Daily 5 AM]
   ↓
   [Supabase: Fetch Pending Restaurants]
   ↓
   [Function: Prepare AI Prompt]
   ↓
   [OpenAI: GPT-4 Analysis]
   ↓
   [Function: Parse AI Response]
   ↓
   [Supabase: Update Priority Scores]
   ↓
   [Slack: Notify Completion]
   ```

2. **Create AI Prompt Template**

   In n8n Function node:
   ```javascript
   const restaurants = $input.all().map(item => item.json);
   
   const prompt = `You are a restaurant partnership expert at Zomato. Analyze these restaurants and rank them by conversion likelihood for discount drives.
   
   Consider:
   - Order Volume (higher = better)
   - Cuisine type (popular cuisines convert better)
   - Locality (high-traffic areas = better)
   - Current active promos (already engaged = lower priority)
   - Multiple drives (contact once for all = higher priority)
   
   Restaurants:
   ${restaurants.map((r, i) => `
   ${i + 1}. ${r.res_name}
      - OV: ${r.sept_ov}
      - Cuisine: ${r.cuisine}
      - Locality: ${r.locality}
      - Active Promos: ${r.la_active_promos || 'None'}
      - Drive Count: ${r.driveCount || 1}
   `).join('\n')}
   
   Return JSON array with priority scores (0-100) and reasoning:
   [
     {
       "res_id": "19195746",
       "priority_score": 85,
       "reasoning": "High OV (1095), popular cuisine, no active promos"
     },
     ...
   ]`;
   
   return [{
     json: {
       model: "gpt-4",
       messages: [
         { role: "system", content: "You are a data analyst specializing in restaurant partnerships." },
         { role: "user", content: prompt }
       ],
       temperature: 0.3,
       response_format: { type: "json_object" }
     }
   }];
   ```

3. **Parse AI Response**

   ```javascript
   const aiResponse = $json.choices[0].message.content;
   const scores = JSON.parse(aiResponse);
   
   return scores.map(score => ({
     json: {
       res_id: score.res_id,
       priority_score: score.priority_score,
       ai_reasoning: score.reasoning,
       last_ai_update: new Date().toISOString()
     }
   }));
   ```

4. **Update Database**

   Supabase node:
   - Operation: Update
   - Table: `drive_data`
   - Match on: `res_id`
   - Update: `priority_score`, `ai_reasoning`

5. **Add AI Reasoning to UI**

   Update `components/restaurant-card.tsx`:
   ```typescript
   {restaurant.ai_reasoning && (
     <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
       <p className="font-semibold text-blue-700">AI Insight:</p>
       <p className="text-blue-600">{restaurant.ai_reasoning}</p>
     </div>
   )}
   ```

**Deliverable:** AI-powered priority scoring running daily

---

### Task 5.2: Automated Daily Email Summaries (Priority: HIGH)

**Estimated Time:** 4 hours

**Steps:**

1. **Create n8n Email Workflow**

   Workflow: "Daily KAM Summary Email"
   
   **Nodes:**
   ```
   [Schedule: Daily 7 AM]
   ↓
   [Supabase: Get All KAMs]
   ↓
   [Loop Over KAMs]
   ↓
   [Supabase: Get KAM Stats]
   ↓
   [Function: Generate Email HTML]
   ↓
   [Send Email]
   ```

2. **Email Template**

   ```javascript
   const kamName = $json.kam_name;
   const stats = $json.stats;
   const topPriority = $json.topPriority;
   
   const emailHTML = `
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       body { font-family: Arial, sans-serif; }
       .header { background: #ef4444; color: white; padding: 20px; }
       .stats { display: flex; gap: 20px; margin: 20px 0; }
       .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; flex: 1; }
       .priority-list { background: #fff7ed; padding: 15px; border-radius: 8px; }
       .restaurant { padding: 10px; border-bottom: 1px solid #e5e7eb; }
     </style>
   </head>
   <body>
     <div class="header">
       <h1>Your Daily Drive Summary</h1>
       <p>Good morning, ${kamName}! 🌅</p>
     </div>
     
     <div style="padding: 20px;">
       <h2>📊 Today's Stats</h2>
       <div class="stats">
         <div class="stat-card">
           <h3>${stats.pending}</h3>
           <p>Pending Restaurants</p>
         </div>
         <div class="stat-card">
           <h3>${stats.todayConversions}</h3>
           <p>Conversions Today</p>
         </div>
         <div class="stat-card">
           <h3>${stats.conversionRate}%</h3>
           <p>Overall Conversion Rate</p>
         </div>
       </div>
       
       <h2>🎯 Top Priority Today</h2>
       <div class="priority-list">
         ${topPriority.map((r, i) => `
           <div class="restaurant">
             <strong>${i + 1}. ${r.res_name}</strong>
             <p>OV: ${r.sept_ov} | ${r.locality}</p>
             <p style="color: #3b82f6; font-size: 12px;">${r.ai_reasoning}</p>
           </div>
         `).join('')}
       </div>
       
       <p style="margin-top: 30px;">
         <a href="https://your-dashboard.vercel.app" 
            style="background: #ef4444; color: white; padding: 12px 24px; 
                   text-decoration: none; border-radius: 6px;">
           Open Dashboard
         </a>
       </p>
     </div>
   </body>
   </html>
   `;
   
   return [{
     json: {
       to: $json.kam_email,
       subject: `Your Daily Drive Summary - ${new Date().toLocaleDateString()}`,
       html: emailHTML
     }
   }];
   ```

3. **Configure Email Node**
   - Use Gmail, SendGrid, or AWS SES
   - Add credentials in n8n
   - Test with your email first

**Deliverable:** Daily automated email summaries

---

### Task 5.3: Slack Notifications (Priority: MEDIUM)

**Estimated Time:** 3 hours

**Steps:**

1. **Set Up Slack App**
   - Go to api.slack.com/apps
   - Create new app: "Zomato Drive Bot"
   - Add Bot Token Scopes: `chat:write`, `chat:write.public`
   - Install to workspace
   - Copy Bot Token

2. **Create Notification Workflow**

   Workflow: "Real-time Slack Notifications"
   
   **Trigger:** Webhook (called from Next.js app)
   
   **Nodes:**
   ```
   [Webhook Trigger]
   ↓
   [Function: Format Message]
   ↓
   [Slack: Send Message]
   ```

3. **Slack Message Templates**

   ```javascript
   const eventType = $json.event_type;
   const data = $json.data;
   
   let message = '';
   
   switch(eventType) {
     case 'conversion':
       message = `🎉 *Conversion Alert!*
       
   ${data.kam_name} just converted *${data.res_name}*!
   Drive: ${data.drive_name}
   Discount: ${data.discount_applied}
   
   Total conversions today: ${data.todayTotal}`;
       break;
       
     case 'milestone':
       message = `🏆 *Milestone Achieved!*
       
   ${data.kam_name} reached ${data.milestone} conversions!
   Conversion rate: ${data.conversion_rate}%
   
   Keep up the great work! 💪`;
       break;
       
     case 'sync_error':
       message = `⚠️ *Data Sync Failed*
       
   Drive: ${data.drive_name}
   Error: ${data.error_message}
   
   Action required: Check n8n logs`;
       break;
   }
   
   return [{
     json: {
       channel: '#drive-updates',
       text: message
     }
   }];
   ```

4. **Trigger from Next.js**

   Create `lib/notifications.ts`:
   ```typescript
   export async function sendSlackNotification(eventType: string, data: any) {
     await fetch('https://your-n8n.app.n8n.cloud/webhook/slack-notify', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ event_type: eventType, data })
     });
   }
   
   // Usage:
   // await sendSlackNotification('conversion', {
   //   kam_name: 'Anudeep Pawar',
   //   res_name: 'Shahi Darbar',
   //   drive_name: 'Special 35',
   //   discount_applied: '40 upto 80'
   // });
   ```

**Deliverable:** Real-time Slack notifications

---

### Task 5.4: Incentive Tracker (Priority: MEDIUM)

**Estimated Time:** 5 hours

**Steps:**

1. **Create Incentive Schema**

   ```sql
   CREATE TABLE incentive_rules (
     id SERIAL PRIMARY KEY,
     rule_name VARCHAR(100),
     min_conversions INTEGER,
     max_conversions INTEGER,
     amount_per_conversion DECIMAL(10,2),
     bonus_amount DECIMAL(10,2),
     active BOOLEAN DEFAULT TRUE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   INSERT INTO incentive_rules (rule_name, min_conversions, max_conversions, amount_per_conversion, bonus_amount) VALUES
   ('Tier 1', 0, 50, 100, 0),
   ('Tier 2', 51, 100, 150, 2000),
   ('Tier 3', 101, 999999, 200, 5000);
   
   CREATE TABLE incentive_tracking (
     id SERIAL PRIMARY KEY,
     kam_name VARCHAR(100),
     month DATE,
     total_conversions INTEGER,
     base_incentive DECIMAL(10,2),
     bonus_incentive DECIMAL(10,2),
     total_incentive DECIMAL(10,2),
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Create Incentive Calculator API**

   Create `app/api/incentives/calculate/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import { supabase } from '@/lib/supabase'
   
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const kamName = searchParams.get('kam_name')
     const month = searchParams.get('month') || new Date().toISOString().slice(0, 7)
     
     // Get conversions for the month
     const { data: conversions } = await supabase
       .from('conversion_tracking')
       .select('*')
       .eq('kam_name', kamName)
       .eq('action_type', 'converted')
       .gte('action_date', `${month}-01`)
       .lt('action_date', `${month}-31`)
     
     const totalConversions = conversions?.length || 0
     
     // Get applicable incentive rule
     const { data: rules } = await supabase
       .from('incentive_rules')
       .select('*')
       .eq('active', true)
       .lte('min_conversions', totalConversions)
       .gte('max_conversions', totalConversions)
       .single()
     
     if (!rules) {
       return NextResponse.json({ error: 'No incentive rule found' }, { status: 404 })
     }
     
     const baseIncentive = totalConversions * rules.amount_per_conversion
     const bonusIncentive = rules.bonus_amount
     const totalIncentive = baseIncentive + bonusIncentive
     
     return NextResponse.json({
       kam_name: kamName,
       month,
       total_conversions: totalConversions,
       tier: rules.rule_name,
       base_incentive: baseIncentive,
       bonus_incentive: bonusIncentive,
       total_incentive: totalIncentive,
       amount_per_conversion: rules.amount_per_conversion
     })
   }
   ```

3. **Create Incentive Dashboard Component**

   Create `components/incentive-tracker.tsx`:
   ```typescript
   'use client'
   
   import { useEffect, useState } from 'react'
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { DollarSign, TrendingUp } from 'lucide-react'
   
   export function IncentiveTracker({ kamName }: { kamName: string }) {
     const [incentive, setIncentive] = useState<any>(null)
     
     useEffect(() => {
       async function loadIncentive() {
         const res = await fetch(`/api/incentives/calculate?kam_name=${kamName}`)
         const data = await res.json()
         setIncentive(data)
       }
       loadIncentive()
     }, [kamName])
     
     if (!incentive) return null
     
     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <DollarSign className="h-5 w-5 text-green-500" />
             Incentive Tracker
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-gray-600">Current Tier:</span>
               <Badge variant="secondary" className="text-lg">
                 {incentive.tier}
               </Badge>
             </div>
             
             <div className="flex items-center justify-between">
               <span className="text-gray-600">Conversions This Month:</span>
               <span className="text-2xl font-bold">{incentive.total_conversions}</span>
             </div>
             
             <div className="pt-4 border-t">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm text-gray-600">Base Incentive:</span>
                 <span className="font-medium">₹{incentive.base_incentive.toLocaleString()}</span>
               </div>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm text-gray-600">Bonus:</span>
                 <span className="font-medium">₹{incentive.bonus_incentive.toLocaleString()}</span>
               </div>
               <div className="flex items-center justify-between pt-2 border-t">
                 <span className="font-semibold">Total Incentive:</span>
                 <span className="text-2xl font-bold text-green-600">
                   ₹{incentive.total_incentive.toLocaleString()}
                 </span>
               </div>
             </div>
             
             <div className="bg-blue-50 p-3 rounded text-sm">
               <TrendingUp className="h-4 w-4 inline mr-2 text-blue-600" />
               <span className="text-blue-700">
                 {incentive.amount_per_conversion > 100 
                   ? `You're earning ₹${incentive.amount_per_conversion} per conversion!`
                   : `Convert ${51 - incentive.total_conversions} more to reach Tier 2!`
                 }
               </span>
             </div>
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

**Deliverable:** Incentive tracking and calculation

---

### Task 5.5: Bulk Actions (Priority: MEDIUM)

**Estimated Time:** 3 hours

**Steps:**

1. **Add Checkbox Selection to Restaurant List**

   Update `app/page.tsx`:
   ```typescript
   const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([])
   
   const toggleSelection = (resId: string) => {
     setSelectedRestaurants(prev => 
       prev.includes(resId) 
         ? prev.filter(id => id !== resId)
         : [...prev, resId]
     )
   }
   
   const bulkMarkApproached = async () => {
     for (const resId of selectedRestaurants) {
       await markAsApproached(resId, driveId, kamName)
     }
     setSelectedRestaurants([])
     // Refresh data
   }
   ```

2. **Add Bulk Action Bar**

   Create `components/bulk-action-bar.tsx`:
   ```typescript
   import { Button } from '@/components/ui/button'
   import { CheckCircle, X } from 'lucide-react'
   
   export function BulkActionBar({ 
     selectedCount, 
     onMarkApproached, 
     onClear 
   }: {
     selectedCount: number
     onMarkApproached: () => void
     onClear: () => void
   }) {
     if (selectedCount === 0) return null
     
     return (
       <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 border flex items-center gap-4">
         <span className="font-medium">{selectedCount} selected</span>
         <Button onClick={onMarkApproached}>
           <CheckCircle className="h-4 w-4 mr-2" />
           Mark as Approached
         </Button>
         <Button variant="outline" onClick={onClear}>
           <X className="h-4 w-4 mr-2" />
           Clear
         </Button>
       </div>
     )
   }
   ```

**Deliverable:** Bulk action capabilities

---

### Task 5.6: Advanced Filters (Priority: LOW)

**Estimated Time:** 3 hours

**Steps:**

1. **Add OV Range Slider**

   Install: `pnpm install @radix-ui/react-slider`
   
   ```typescript
   import { Slider } from '@/components/ui/slider'
   
   const [ovRange, setOvRange] = useState([0, 1000])
   
   <div>
     <Label>Order Volume Range</Label>
     <Slider
       min={0}
       max={1000}
       step={10}
       value={ovRange}
       onValueChange={setOvRange}
     />
     <p className="text-sm text-gray-500">
       {ovRange[0]} - {ovRange[1]}
     </p>
   </div>
   ```

2. **Add Date Range Picker**

   Install: `pnpm install react-day-picker date-fns`
   
   Add date range filter for conversion tracking

**Deliverable:** Advanced filtering options

---

## ✅ Sprint Completion Checklist

- [ ] AI prioritization running daily
- [ ] Daily email summaries sent to all KAMs
- [ ] Slack notifications working
- [ ] Incentive tracker calculating correctly
- [ ] Bulk actions functional
- [ ] Advanced filters implemented
- [ ] Mobile view optimized
- [ ] All features tested end-to-end

---

## 🚀 Post-Sprint: Production Readiness

### Performance Optimization
- [ ] Database query optimization
- [ ] API response caching
- [ ] Image optimization
- [ ] Code splitting

### Security
- [ ] Row-level security enabled
- [ ] API rate limiting
- [ ] Input validation
- [ ] XSS protection

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Vercel Analytics)
- [ ] Uptime monitoring
- [ ] Performance monitoring

---

**Next:** [Deployment Guide](../docs/06-DEPLOYMENT.md)

