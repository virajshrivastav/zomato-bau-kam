# 🚀 Getting Started Guide

**Welcome to the Zomato Drive Dashboard project!**

This guide will help you get started quickly, whether you're building the dashboard, managing the project, or using it as a KAM.

---

## 📋 What Is This Project?

The Zomato Drive Dashboard is a **unified web application** that replaces multiple complex Google Sheets with a single, intuitive dashboard for managing restaurant discount drives, menu photoshoots, and ad boost campaigns.

### The Problem It Solves

**Before:** KAMs manage 5-10 different Google Sheets with 50+ columns each, manually tracking hundreds of restaurants across multiple drives.

**After:** One dashboard with:
- All restaurants in one view
- Smart filtering and search
- One-click discount activation
- Real-time conversion tracking
- AI-powered prioritization
- Automated daily updates

### Who Benefits?

- **KAMs** → Save 80% of time on data management
- **Zonal Heads** → Real-time team performance visibility
- **Central Ops** → City-wide analytics and insights

---

## 🎯 Your First 5 Minutes

### Step 1: Understand the Scope

Read this quick overview:

**What you're building:**
- A Next.js web application
- Connected to Supabase (PostgreSQL database)
- Automated with n8n workflows
- Enhanced with AI (GPT-4)

**What it does:**
- Syncs data from Google Sheets daily
- Shows restaurants assigned to each KAM
- Tracks conversion status (Pending → Approached → Converted)
- Sends automated email summaries
- Provides analytics and insights

**Timeline:** 4-6 weeks for full implementation

---

### Step 2: Review the Architecture

```
Google Sheets (Data Source)
    ↓
n8n (Daily Sync at 6 AM)
    ↓
Supabase Database (PostgreSQL)
    ↓
Next.js Frontend (Dashboard)
    ↓
Users (KAMs, Zonal Heads)
```

**Key Technologies:**
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Automation:** n8n
- **AI:** OpenAI GPT-4
- **Hosting:** Vercel + Supabase Cloud

---

### Step 3: Check the Sample Data

Open `Special 35 __ Shiv - Sheet10.csv` to see the actual data structure you'll be working with.

**Key columns:**
- `res_id` - Restaurant ID
- `res_name` - Restaurant name
- `am_name` - KAM name
- `Sept OV` - Order volume
- `LA`, `MM`, `UM` - Customer segments
- `la_base_code_suggested` - Suggested discount
- `Approached` - Contact status
- `Converted for Stepper` - Conversion status

---

## 📚 Documentation Structure

All documentation is organized into 3 categories:

### 1️⃣ **Context Documents** (Read First)
- `docs/01-PROJECT-CONTEXT.md` - Problem, users, requirements
- `docs/02-DATABASE-SCHEMA.md` - Database design

### 2️⃣ **Sprint Plans** (Build in Order)
- `sprints/SPRINT-00-SETUP.md` - Environment setup
- `sprints/SPRINT-01-FOUNDATION.md` - Data pipeline
- `sprints/SPRINT-02-BASIC-UI.md` - Dashboard UI
- `sprints/SPRINT-03-FEATURES.md` - Core features
- `sprints/SPRINT-04-ANALYTICS.md` - Analytics
- `sprints/SPRINT-05-ADVANCED.md` - AI & automation

### 3️⃣ **Reference Docs** (Use as Needed)
- `docs/03-API-SPECIFICATION.md` - API endpoints
- `docs/04-N8N-WORKFLOWS.md` - Automation workflows
- `docs/05-UI-COMPONENTS.md` - Component library
- `docs/06-DEPLOYMENT.md` - Production deployment

---

## 🛤️ Recommended Learning Path

### Path A: Developer (Building the Dashboard)

**Week 1: Foundation**
```
Day 1: Read docs/01-PROJECT-CONTEXT.md (15 min)
       Read docs/02-DATABASE-SCHEMA.md (20 min)
       Execute sprints/SPRINT-00-SETUP.md (2-3 hours)

Day 2-4: Execute sprints/SPRINT-01-FOUNDATION.md
         Build Google Sheets → Database sync
         Test with sample data

Day 5: Execute sprints/SPRINT-02-BASIC-UI.md (start)
       Initialize Next.js project
       Set up Supabase client
```

**Week 2-3: Core Features**
```
Complete SPRINT-02-BASIC-UI.md
Complete SPRINT-03-FEATURES.md
Test multi-drive view
Test activation flow
```

**Week 4-5: Analytics & Advanced**
```
Complete SPRINT-04-ANALYTICS.md
Complete SPRINT-05-ADVANCED.md
Set up AI prioritization
Configure notifications
```

**Week 6: Testing & Deployment**
```
Follow docs/06-DEPLOYMENT.md
Deploy to production
Train users
```

---

### Path B: Product Manager (Managing the Project)

**Day 1: Understanding**
```
1. Read docs/01-PROJECT-CONTEXT.md
   - Focus on: User Personas, Requirements
   
2. Review all sprint files
   - Note: Deliverables, timelines, dependencies
   
3. Create project plan
   - Assign sprints to developers
   - Set milestones
```

**Ongoing: Tracking**
```
1. Use sprint checklists to track progress
2. Review deliverables at end of each sprint
3. Gather KAM feedback during Sprint 2-3
4. Plan rollout using docs/06-DEPLOYMENT.md
```

---

### Path C: KAM (Using the Dashboard)

**When Dashboard is Ready:**
```
1. Get login credentials from Zonal Head
2. Watch demo video (to be created)
3. Review key features in README.md
4. Start using for daily drive management
5. Provide feedback to product team
```

---

## 🔑 Key Concepts to Understand

### 1. Multi-Drive Visibility

**Problem:** A restaurant might be in 3 different drives (Discount, Menu, Ads). KAMs currently contact them 3 separate times.

**Solution:** Dashboard shows all drives for a restaurant in one view. KAM can handle all drives in one conversation.

### 2. Customer Segments

Restaurants are segmented by customer type:
- **LA (Lower Affluent)** - Budget-conscious customers
- **MM (Middle Middle)** - Mid-range customers
- **UM (Upper Middle)** - Premium customers

Each segment gets different discount suggestions.

### 3. Conversion Funnel

```
Pending → Approached → Converted
```

- **Pending:** Restaurant not yet contacted
- **Approached:** KAM called/messaged, awaiting decision
- **Converted:** Restaurant agreed to discount

### 4. Priority Score

AI analyzes each restaurant and assigns a priority score (0-100) based on:
- Order volume
- Cuisine popularity
- Location
- Current promos
- Multi-drive opportunity

Higher score = higher conversion likelihood.

---

## 🚦 Prerequisites

### For Development

**Required:**
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)
- Supabase account (free tier)
- n8n account or self-hosted instance

**Optional (for advanced features):**
- OpenAI API key (for AI prioritization)
- Slack workspace (for notifications)
- Gmail/SendGrid (for email summaries)

### For Project Management

**Required:**
- Access to all documentation
- Understanding of KAM workflows
- Stakeholder contact list

### For End Users (KAMs)

**Required:**
- Login credentials (provided by admin)
- Modern web browser (Chrome, Firefox, Safari)
- Basic understanding of drive campaigns

---

## 🎓 Common Questions

### Q: Do I need to read all documentation before starting?

**A:** No. Start with:
1. `docs/01-PROJECT-CONTEXT.md` (15 min)
2. `docs/02-DATABASE-SCHEMA.md` (20 min)
3. `sprints/SPRINT-00-SETUP.md` (hands-on)

Reference other docs as needed during implementation.

---

### Q: Can I skip sprints or do them out of order?

**A:** No. Each sprint builds on the previous one:
- Sprint 1 creates the data pipeline (needed for Sprint 2)
- Sprint 2 creates the UI (needed for Sprint 3)
- Sprint 3 adds features (needed for Sprint 4)
- etc.

Follow the order for best results.

---

### Q: What if I get stuck?

**A:** Each sprint has:
- Detailed step-by-step instructions
- Code examples
- Troubleshooting tips

Also check:
- `docs/06-DEPLOYMENT.md` - Troubleshooting section
- Slack channel: #drive-dashboard-support
- Tech lead contact in README.md

---

### Q: How long will this take?

**A:** Estimated timeline:
- **Setup (Sprint 0):** 1 day
- **Foundation (Sprint 1):** 3-4 days
- **Basic UI (Sprint 2):** 3-4 days
- **Features (Sprint 3):** 4-5 days
- **Analytics (Sprint 4):** 5-7 days
- **Advanced (Sprint 5):** 7-10 days

**Total:** 4-6 weeks for one developer working full-time.

Can be faster with multiple developers working in parallel on different sprints.

---

### Q: What's the minimum viable product (MVP)?

**A:** Complete Sprints 0-3 for MVP:
- Data sync working
- Restaurant list with filters
- Multi-drive view
- Basic activation flow

This gives KAMs 70% of the value. Add analytics and AI later.

---

## 🎯 Success Criteria

You'll know you're successful when:

### After Sprint 1:
- [ ] Google Sheets data appears in Supabase
- [ ] Sync runs automatically every day
- [ ] No data validation errors

### After Sprint 2:
- [ ] Dashboard loads in <2 seconds
- [ ] KAM can see their assigned restaurants
- [ ] Filters work correctly

### After Sprint 3:
- [ ] Multi-drive view shows all drives per restaurant
- [ ] Discount activation flow works end-to-end
- [ ] Status updates reflect in database

### After Sprint 4:
- [ ] Charts display conversion trends
- [ ] KAM stats are accurate
- [ ] Leaderboard ranks correctly

### After Sprint 5:
- [ ] AI prioritization runs daily
- [ ] Email summaries sent every morning
- [ ] Slack notifications work

### Production Ready:
- [ ] All sprints complete
- [ ] User testing done
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Monitoring configured

---

## 🚀 Next Steps

### Ready to Start?

1. **Read the context** → `docs/01-PROJECT-CONTEXT.md`
2. **Study the data model** → `docs/02-DATABASE-SCHEMA.md`
3. **Set up your environment** → `sprints/SPRINT-00-SETUP.md`
4. **Build the foundation** → `sprints/SPRINT-01-FOUNDATION.md`

### Need More Information?

- **Technical details** → See reference docs in `docs/`
- **Implementation guidance** → See sprint plans in `sprints/`
- **Quick overview** → See `README.md`

---

## 📞 Support

- **Documentation Issues:** Check the index in README.md
- **Technical Questions:** Slack #drive-dashboard-support
- **Project Management:** Contact Product Owner
- **Urgent Issues:** Contact Tech Lead

---

**Good luck building the Zomato Drive Dashboard! 🎉**

*This guide was last updated on November 5, 2025*

