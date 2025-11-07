# 🎯 Zomato Drive Dashboard

> A centralized, visual dashboard for managing multiple data-heavy drive sheets (discount drives, menu photoshoot drives, ad boost drives) for Zomato Key Account Managers (KAMs).

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Architecture](#solution-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Development Roadmap](#development-roadmap)

---

## 🎯 Overview

This project transforms complex, multi-tab Google Sheets into a **single, intuitive dashboard** that enables:

- **KAMs** → Daily tracking, drive execution, and discount activation
- **Zonal Heads** → Real-time visibility and performance review
- **Central Ops** → City-wise drive efficiency monitoring

### Key Features

✅ **Unified Drive View** - All ongoing city-level drives in one place  
✅ **Smart Filtering** - By City, Zone, Drive Type, KAM name  
✅ **Live Tracking** - Conversion rates, status updates, performance metrics  
✅ **Multi-Drive Visibility** - Highlight restaurants in multiple drives  
✅ **Quick Actions** - Modify discounts and activate with one click  
✅ **Visual Insights** - Charts, heatmaps, leaderboards, trend analysis  
✅ **AI Prioritization** - Smart restaurant ranking for conversion  
✅ **Automated Sync** - Daily data refresh from Google Sheets  

---

## 🔥 Problem Statement

### Current Pain Points

1. **Data Fragmentation** - Multiple drive sheets with confusing tabs
2. **Manual Tracking** - No centralized view of KAM performance
3. **Inefficient Workflow** - KAMs contact same restaurant multiple times for different drives
4. **No Visibility** - Zonal heads lack real-time progress tracking
5. **Complex Analysis** - Performance reviews require manual data compilation

### Sample Data Structure

Each drive sheet contains:
- Restaurant ID, Name
- KAM Name, Email
- Order Volume (OV) - Total and Customer-Segmented (UM, MM, LA)
- Active Discounts
- Suggested Discounts (System-generated)
- Conversion Status
- 50+ additional columns

---

## 🏗️ Solution Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ KAM Dashboard│  │ Zonal View   │  │ Analytics    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Supabase Auto-generated REST API + Next.js Routes  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Supabase PostgreSQL Database                 │   │
│  │  • restaurants  • drive_data  • conversions          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                   AUTOMATION LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              n8n Workflows                           │   │
│  │  • Daily Sheet Sync  • Notifications  • AI Engine   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCE                               │
│              Google Sheets (Multiple Drive Sheets)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with SSR |
| **UI Components** | Shadcn/ui + Tailwind CSS | Beautiful, accessible components |
| **Database** | Supabase (PostgreSQL) | Real-time database with auth |
| **API** | Supabase REST API | Auto-generated from schema |
| **Automation** | n8n (Self-hosted/Cloud) | ETL workflows, notifications |
| **Charts** | Recharts | Data visualization |
| **AI** | OpenAI API (GPT-4) | Restaurant prioritization |
| **Hosting** | Vercel + Supabase Cloud | Serverless deployment |

---

## 📁 Project Structure

```
zomato-dashboard/
├── docs/                          # Documentation
│   ├── 01-PROJECT-CONTEXT.md      # Detailed problem & solution
│   ├── 02-DATABASE-SCHEMA.md      # Complete database design
│   ├── 03-API-SPECIFICATION.md    # API endpoints & contracts
│   ├── 04-N8N-WORKFLOWS.md        # Automation workflows
│   ├── 05-UI-COMPONENTS.md        # Component library
│   └── 06-DEPLOYMENT.md           # Deployment guide
├── sprints/                       # Sprint planning
│   ├── SPRINT-00-SETUP.md         # Environment setup
│   ├── SPRINT-01-FOUNDATION.md    # Data pipeline
│   ├── SPRINT-02-BASIC-UI.md      # Core dashboard
│   ├── SPRINT-03-FEATURES.md      # Essential features
│   ├── SPRINT-04-ANALYTICS.md     # Visual insights
│   └── SPRINT-05-ADVANCED.md      # AI & automation
├── src/                           # Application code (to be created)
├── n8n-workflows/                 # n8n workflow exports
├── database/                      # SQL schemas & migrations
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier)
- n8n instance (cloud or self-hosted)
- Google Sheets API access
- OpenAI API key (for AI features)

### Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd zomato-dashboard
   npm install
   ```

2. **Set Up Database**
   - Follow `docs/02-DATABASE-SCHEMA.md`
   - Run SQL scripts in Supabase

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Add your API keys
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Set Up n8n Workflows**
   - Import workflows from `n8n-workflows/`
   - Configure Google Sheets credentials

---

## 📚 Documentation

### 📖 Complete Documentation Index

All documentation has been created and is ready to use. Follow the recommended reading order below:

#### 🎓 **Phase 1: Understanding (Start Here)**

| Document | Description | Time | Priority |
|----------|-------------|------|----------|
| [📖 Project Context](docs/01-PROJECT-CONTEXT.md) | Problem statement, user personas, functional requirements | 15 min | **CRITICAL** |
| [🗄️ Database Schema](docs/02-DATABASE-SCHEMA.md) | Complete database design, ERD, sample queries | 20 min | **CRITICAL** |

**Goal:** Understand the problem you're solving and the data model.

---

#### 🔨 **Phase 2: Implementation (Build in Order)**

| Sprint | Focus Area | Duration | Key Deliverables |
|--------|-----------|----------|------------------|
| [Sprint 0: Setup](sprints/SPRINT-00-SETUP.md) | Environment Setup | 1 day | Supabase, n8n, Next.js configured |
| [Sprint 1: Foundation](sprints/SPRINT-01-FOUNDATION.md) | Data Pipeline | 3-4 days | Google Sheets → Database sync working |
| [Sprint 2: Basic UI](sprints/SPRINT-02-BASIC-UI.md) | Core Dashboard | 3-4 days | Restaurant list, filters, search |
| [Sprint 3: Features](sprints/SPRINT-03-FEATURES.md) | Essential Features | 4-5 days | Multi-drive view, activation flow |
| [Sprint 4: Analytics](sprints/SPRINT-04-ANALYTICS.md) | Visual Insights | 5-7 days | Charts, stats, leaderboard |
| [Sprint 5: Advanced](sprints/SPRINT-05-ADVANCED.md) | AI & Automation | 7-10 days | AI prioritization, notifications |

**Total Timeline:** 4-6 weeks for complete implementation

**Goal:** Build the dashboard incrementally, testing each component before moving forward.

---

#### 📘 **Phase 3: Reference (Use as Needed)**

| Document | Description | When to Use |
|----------|-------------|-------------|
| [🔌 API Specification](docs/03-API-SPECIFICATION.md) | Complete API documentation with examples | Building frontend or integrations |
| [🔄 n8n Workflows](docs/04-N8N-WORKFLOWS.md) | Detailed automation workflow configs | Setting up data sync & notifications |
| [🎨 UI Components](docs/05-UI-COMPONENTS.md) | Component library and design patterns | Building UI features |
| [🚀 Deployment Guide](docs/06-DEPLOYMENT.md) | Production deployment checklist | Going live to production |

**Goal:** Quick reference for specific technical implementation details.

---

### 🎯 **Quick Navigation by Role**

#### If You're a **Developer** (Building This):
```
1. Read: docs/01-PROJECT-CONTEXT.md
2. Read: docs/02-DATABASE-SCHEMA.md
3. Execute: sprints/SPRINT-00-SETUP.md
4. Execute: sprints/SPRINT-01-FOUNDATION.md
5. Continue through Sprint 2-5 in order
6. Reference: docs/03-API-SPECIFICATION.md (as needed)
7. Reference: docs/04-N8N-WORKFLOWS.md (as needed)
8. Deploy: docs/06-DEPLOYMENT.md
```

#### If You're a **Product Manager**:
```
1. Review: docs/01-PROJECT-CONTEXT.md (Requirements)
2. Review: Sprint planning in sprints/ folder
3. Track: Sprint completion checklists
4. Plan: docs/06-DEPLOYMENT.md (Go-live checklist)
```

#### If You're a **KAM** (End User):
```
1. Understand: docs/01-PROJECT-CONTEXT.md (User Personas section)
2. Learn: Key Features section in this README
3. Access: Get credentials from Zonal Head
4. Use: Dashboard training materials (to be created)
```

---

### 📊 **Documentation Status**

| Category | Status | Files |
|----------|--------|-------|
| **Context & Planning** | ✅ Complete | 2/2 docs |
| **Sprint Plans** | ✅ Complete | 6/6 sprints |
| **Technical Reference** | ✅ Complete | 4/4 docs |
| **Code Implementation** | 🟡 Not Started | 0% |
| **Testing** | 🟡 Not Started | 0% |
| **Deployment** | 🟡 Not Started | 0% |

**Last Updated:** November 5, 2025

---

## 🗓️ Development Roadmap

### Sprint 0: Setup (Week 1)
- Environment configuration
- Supabase project setup
- n8n installation

### Sprint 1: Foundation (Week 1-2)
- Database schema creation
- Google Sheets → Supabase ETL
- Data validation

### Sprint 2: Basic UI (Week 2-3)
- Next.js project initialization
- KAM dashboard (restaurant list)
- Filtering & search

### Sprint 3: Core Features (Week 3-4)
- Multi-drive view
- Discount activation flow
- Status tracking

### Sprint 4: Analytics (Week 4-5)
- Conversion rate widgets
- Performance graphs
- Zonal head dashboard

### Sprint 5: Advanced (Week 5+)
- AI prioritization engine
- Automated notifications
- Incentive tracker

**See `sprints/` folder for detailed sprint plans.**

---

## 👥 User Roles

### 1. Key Account Manager (KAM)
- View assigned restaurants
- Track drive progress
- Activate discounts
- Monitor daily conversions

### 2. Zonal Head
- City-level summaries
- Team performance tracking
- KAM-wise leaderboards
- Drive efficiency metrics

### 3. Central Ops / Analytics
- Cross-city analysis
- Historical trends
- System-wide metrics

---

## 🎯 Success Metrics

- **Time Saved**: 80% reduction in manual tracking time
- **Conversion Rate**: 15% improvement through prioritization
- **Data Accuracy**: 99%+ sync accuracy from sheets
- **User Adoption**: 90%+ KAM daily active usage
- **Response Time**: <2s dashboard load time

---

## 📄 License

Internal Zomato Project - Proprietary

---

## 🤝 Contributing

This is an internal project. For questions or suggestions, contact the development team.

---

**Built with ❤️ for Zomato KAMs**

