# 🚀 Phase 4: Advanced Features - Intelligence Layer Active

**Technical Achievement:** AI integration with event-driven automation and multi-channel notifications
**Priority:** NICE TO HAVE
**Goal:** LLM integration + Workflow automation + Webhook notifications + Rule engine

**Prerequisites:** Phase 3 completed ✅ (Analytics engine live)

---

## 🎯 Phase Objectives

By the end of Phase 4, you will have achieved:

✅ **LLM Integration:** OpenAI GPT-4 API with structured prompts and JSON parsing
✅ **Event System:** n8n workflows triggered by database webhooks
✅ **Email Pipeline:** HTML template engine with Handlebars and SMTP integration
✅ **Webhook Notifications:** Slack incoming webhooks with formatted messages
✅ **Rule Engine:** Multi-tier incentive calculation with threshold-based logic
✅ **Batch Operations:** Bulk mutation hooks with transaction support
✅ **Advanced Queries:** Complex filtering with dynamic WHERE clauses

---

## 📋 Task Breakdown

### **Task 4.1: AI Prioritization Engine**

**Technical Achievement:** OpenAI GPT-4 integration with prompt engineering and JSON parsing

#### Steps:

1. **Set Up OpenAI**
   - Create account at https://platform.openai.com
   - Generate API key
   - Add to `.env.local`:
   ```bash
   VITE_OPENAI_API_KEY=sk-...
   ```

2. **Create AI Prioritization Function**
   - Create file: `src/lib/aiPrioritization.ts`
   ```typescript
   import OpenAI from 'openai'

   const openai = new OpenAI({
     apiKey: import.meta.env.VITE_OPENAI_API_KEY,
     dangerouslyAllowBrowser: true // Only for development
   })

   export async function getAIPriority(restaurant: any, driveData: any) {
     const prompt = `
   You are a restaurant prioritization expert for Zomato.
   
   Analyze this restaurant and provide a priority score (0-100) for conversion likelihood:
   
   Restaurant: ${restaurant.res_name}
   Cuisine: ${restaurant.cuisine}
   Locality: ${restaurant.locality}
   September Order Volume: ${restaurant.sept_ov}
   Customer Segments: UM=${driveData.um}, MM=${driveData.mm}, LA=${driveData.la}
   Approached: ${driveData.approached ? 'Yes' : 'No'}
   Converted: ${driveData.converted_stepper ? 'Yes' : 'No'}
   Suggested Discount: ${driveData.la_base_code_suggested}
   
   Consider:
   1. Order volume (higher = better)
   2. Customer segment distribution
   3. Whether already approached/converted
   4. Cuisine popularity
   5. Locality demographics
   
   Respond with ONLY a JSON object:
   {
     "score": <number 0-100>,
     "reasoning": "<brief explanation>",
     "recommended_action": "<what KAM should do>"
   }
   `

     const response = await openai.chat.completions.create({
       model: 'gpt-4',
       messages: [{ role: 'user', content: prompt }],
       temperature: 0.3,
       max_tokens: 200
     })

     const result = JSON.parse(response.choices[0].message.content || '{}')
     return result
   }
   ```

3. **Create n8n Workflow for Daily AI Scoring**
   - **Node 1:** Schedule Trigger (5:00 AM IST daily)
   - **Node 2:** Supabase (Get all pending restaurants)
   - **Node 3:** Loop over restaurants
   - **Node 4:** OpenAI (Get AI priority)
   - **Node 5:** Supabase (Update priority_score)
   - **Node 6:** Slack (Send completion notification)

4. **Add AI Insights to UI**
   - Create file: `src/components/AIPriorityInsight.tsx`
   ```typescript
   import { useState } from 'react'
   import { Button } from '@/components/ui/button'
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Sparkles } from 'lucide-react'
   import { getAIPriority } from '@/lib/aiPrioritization'

   export function AIPriorityInsight({ restaurant, driveData }: any) {
     const [insight, setInsight] = useState<any>(null)
     const [loading, setLoading] = useState(false)

     const handleGetInsight = async () => {
       setLoading(true)
       const result = await getAIPriority(restaurant, driveData)
       setInsight(result)
       setLoading(false)
     }

     return (
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2">
             <Sparkles className="h-5 w-5 text-yellow-500" />
             AI Priority Insight
           </CardTitle>
         </CardHeader>
         <CardContent>
           {!insight ? (
             <Button onClick={handleGetInsight} disabled={loading}>
               {loading ? 'Analyzing...' : 'Get AI Recommendation'}
             </Button>
           ) : (
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <span className="font-semibold">AI Score:</span>
                 <span className="text-2xl font-bold text-primary">{insight.score}/100</span>
               </div>
               <div>
                 <p className="text-sm text-muted-foreground mb-1">Reasoning:</p>
                 <p className="text-sm">{insight.reasoning}</p>
               </div>
               <div>
                 <p className="text-sm text-muted-foreground mb-1">Recommended Action:</p>
                 <p className="text-sm font-medium">{insight.recommended_action}</p>
               </div>
             </div>
           )}
         </CardContent>
       </Card>
     )
   }
   ```

**Deliverable:** AI-powered priority insights

---

### **Task 4.2: Automated Email Summaries**

**Technical Achievement:** Template-based HTML email generation with scheduled n8n workflow

#### Steps:

1. **Create Email Template**
   - Create file: `email-templates/daily-summary.html`
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       body { font-family: Arial, sans-serif; }
       .header { background: #ef4444; color: white; padding: 20px; }
       .stat { background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 8px; }
       .restaurant { border-left: 3px solid #ef4444; padding: 10px; margin: 10px 0; }
     </style>
   </head>
   <body>
     <div class="header">
       <h1>Daily Drive Summary - {{kam_name}}</h1>
       <p>{{date}}</p>
     </div>
     
     <div class="stat">
       <h3>Today's Performance</h3>
       <p>Conversions: <strong>{{today_conversions}}</strong></p>
       <p>Approached: <strong>{{today_approached}}</strong></p>
     </div>
     
     <div class="stat">
       <h3>Overall Stats</h3>
       <p>Total Restaurants: <strong>{{total_restaurants}}</strong></p>
       <p>Conversion Rate: <strong>{{conversion_rate}}%</strong></p>
       <p>Pending: <strong>{{pending_count}}</strong></p>
     </div>
     
     <h3>Top 5 Priority Restaurants</h3>
     {{#each priority_restaurants}}
     <div class="restaurant">
       <h4>{{this.res_name}}</h4>
       <p>Priority Score: {{this.priority_score}}</p>
       <p>Suggested Discount: {{this.la_base_code_suggested}}</p>
     </div>
     {{/each}}
     
     <p style="margin-top: 30px;">
       <a href="https://your-app.vercel.app/kam-hub" style="background: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         Open Dashboard
       </a>
     </p>
   </body>
   </html>
   ```

2. **Create n8n Email Workflow**
   - **Node 1:** Schedule Trigger (7:00 AM IST daily)
   - **Node 2:** Supabase (Get all KAMs)
   - **Node 3:** Loop over KAMs
   - **Node 4:** Supabase (Get KAM stats)
   - **Node 5:** Supabase (Get top 5 priority restaurants)
   - **Node 6:** Code (Format email data)
   - **Node 7:** Gmail/SendGrid (Send email)

3. **Email Formatting Code (Node 6)**
   ```javascript
   const kamName = $json.kam_name
   const stats = $json.stats
   const restaurants = $json.priority_restaurants

   const emailData = {
     to: $json.kam_email,
     subject: `Daily Drive Summary - ${new Date().toLocaleDateString()}`,
     html: `
       <h1>Daily Drive Summary - ${kamName}</h1>
       <p>Date: ${new Date().toLocaleDateString()}</p>
       
       <h3>Today's Performance</h3>
       <p>Conversions: ${stats.today_conversions}</p>
       
       <h3>Overall Stats</h3>
       <p>Total Restaurants: ${stats.total_restaurants}</p>
       <p>Conversion Rate: ${stats.conversion_rate}%</p>
       
       <h3>Top 5 Priority Restaurants</h3>
       ${restaurants.map(r => `
         <div style="border-left: 3px solid #ef4444; padding: 10px; margin: 10px 0;">
           <h4>${r.res_name}</h4>
           <p>Priority Score: ${r.priority_score}</p>
         </div>
       `).join('')}
     `
   }

   return { json: emailData }
   ```

**Deliverable:** Daily email summaries sent automatically

---

### **Task 4.3: Slack Notifications**

**Technical Achievement:** Webhook-based event broadcasting with formatted message payloads

#### Steps:

1. **Set Up Slack App**
   - Go to https://api.slack.com/apps
   - Create new app: "Zomato Drive Bot"
   - Add bot token scopes: `chat:write`, `chat:write.public`
   - Install app to workspace
   - Copy Bot User OAuth Token

2. **Create Notification Function**
   - Create file: `src/lib/notifications.ts`
   ```typescript
   export async function sendSlackNotification(message: string) {
     const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL

     await fetch(webhookUrl, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         text: message,
         channel: '#drive-updates'
       })
     })
   }
   ```

3. **Add Notifications to Conversion Actions**
   - Edit: `src/api/conversions.ts`
   ```typescript
   import { sendSlackNotification } from '@/lib/notifications'

   export async function markAsConverted(...) {
     // ... existing code ...

     // Send Slack notification
     await sendSlackNotification(
       `🎉 *Conversion Alert*\n` +
       `KAM: ${kamName}\n` +
       `Restaurant: ${resName}\n` +
       `Discount: ${discountApplied}`
     )

     return { success: true }
   }
   ```

4. **Create n8n Webhook for Notifications**
   - **Node 1:** Webhook Trigger
   - **Node 2:** Code (Format message)
   - **Node 3:** Slack (Send message)

**Deliverable:** Real-time Slack notifications

---

### **Task 4.4: Incentive Tracker**

**Technical Achievement:** Rule-based calculation engine with multi-tier threshold logic

#### Steps:

1. **Create Incentive Tables**
   ```sql
   CREATE TABLE incentive_rules (
     id SERIAL PRIMARY KEY,
     rule_name VARCHAR(100),
     min_conversions INTEGER,
     max_conversions INTEGER,
     amount_per_conversion DECIMAL(10,2),
     bonus_amount DECIMAL(10,2),
     active BOOLEAN DEFAULT TRUE
   );

   INSERT INTO incentive_rules VALUES
   (1, 'Tier 1', 0, 50, 100, 0, true),
   (2, 'Tier 2', 51, 100, 150, 2000, true),
   (3, 'Tier 3', 101, 999999, 200, 5000, true);
   ```

2. **Create Incentive Calculator Hook**
   - Create file: `src/hooks/useIncentive.ts`
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { supabase } from '@/lib/supabase'

   export function useIncentive(kamName: string, month: string) {
     return useQuery({
       queryKey: ['incentive', kamName, month],
       queryFn: async () => {
         // Get conversions for the month
         const { count: conversions } = await supabase
           .from('conversion_tracking')
           .select('*', { count: 'exact', head: true })
           .eq('kam_name', kamName)
           .eq('action_type', 'converted')
           .gte('action_date', `${month}-01`)
           .lt('action_date', `${month}-31`)

         // Get applicable rule
         const { data: rule } = await supabase
           .from('incentive_rules')
           .select('*')
           .lte('min_conversions', conversions || 0)
           .gte('max_conversions', conversions || 0)
           .single()

         if (!rule) return null

         const baseIncentive = (conversions || 0) * rule.amount_per_conversion
         const totalIncentive = baseIncentive + rule.bonus_amount

         return {
           conversions: conversions || 0,
           tier: rule.rule_name,
           base_incentive: baseIncentive,
           bonus: rule.bonus_amount,
           total: totalIncentive
         }
       }
     })
   }
   ```

3. **Create Incentive Tracker Component**
   - Create file: `src/components/IncentiveTracker.tsx`
   ```typescript
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
   import { Badge } from '@/components/ui/badge'
   import { DollarSign } from 'lucide-react'
   import { useIncentive } from '@/hooks/useIncentive'

   export function IncentiveTracker({ kamName }: { kamName: string }) {
     const month = new Date().toISOString().slice(0, 7)
     const { data: incentive } = useIncentive(kamName, month)

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
             <div className="flex justify-between">
               <span>Current Tier:</span>
               <Badge>{incentive.tier}</Badge>
             </div>
             <div className="flex justify-between">
               <span>Conversions:</span>
               <span className="font-bold">{incentive.conversions}</span>
             </div>
             <div className="border-t pt-4">
               <div className="flex justify-between mb-2">
                 <span className="text-sm">Base:</span>
                 <span>₹{incentive.base_incentive.toLocaleString()}</span>
               </div>
               <div className="flex justify-between mb-2">
                 <span className="text-sm">Bonus:</span>
                 <span>₹{incentive.bonus.toLocaleString()}</span>
               </div>
               <div className="flex justify-between pt-2 border-t">
                 <span className="font-semibold">Total:</span>
                 <span className="text-2xl font-bold text-green-600">
                   ₹{incentive.total.toLocaleString()}
                 </span>
               </div>
             </div>
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

**Deliverable:** Incentive tracker showing earnings

---

### **Task 4.5: Bulk Actions**

**Technical Achievement:** Batch mutation hooks with database transaction support

#### Steps:

1. **Add Checkbox Selection**
   - Edit: `src/pages/KAMHub.tsx`
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
   }
   ```

2. **Create Bulk Action Bar**
   - Create file: `src/components/BulkActionBar.tsx`
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

**Deliverable:** Bulk actions working

---

## ✅ Phase 4 Completion Checklist

- [ ] AI prioritization working
- [ ] Daily email summaries sent
- [ ] Slack notifications working
- [ ] Incentive tracker calculating correctly
- [ ] Bulk actions functional
- [ ] All features tested end-to-end
- [ ] Mobile view optimized
- [ ] Production ready

---

## 🚀 Post-Implementation

### **Production Deployment**
1. Deploy to Vercel
2. Configure environment variables
3. Set up monitoring (Sentry)
4. Enable analytics
5. Train KAMs on new system

### **Maintenance**
- Monitor n8n workflows daily
- Check Supabase usage
- Review error logs
- Gather user feedback
- Plan next features

---

**Congratulations!** 🎉 You've built a complete production-ready Zomato Drive Dashboard!

