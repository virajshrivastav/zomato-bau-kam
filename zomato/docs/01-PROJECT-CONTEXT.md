# 📖 Project Context: Zomato Drive Dashboard

## 🎯 Executive Summary

The Zomato Drive Dashboard is a centralized platform designed to replace fragmented Google Sheets with a unified, visual interface for managing restaurant partnership drives (discounts, menu photoshoots, ad boosts). The system serves 3 primary user groups: KAMs (daily execution), Zonal Heads (performance monitoring), and Central Ops (strategic analysis).

---

## 🔍 Problem Statement

### Current State

Zomato KAMs manage multiple "drive sheets" simultaneously:
- **Discount Drives** (e.g., "Special 35")
- **Menu Photoshoot Drives**
- **Ad Boost Drives**
- **Promotional Campaigns**

Each sheet contains 50+ columns including:
- Restaurant metadata (ID, name, cuisine, locality)
- KAM assignments
- Order volume metrics (total, UM, MM, LA segments)
- Active promotions
- System-suggested discounts
- Conversion tracking
- Performance indicators

### Pain Points

#### 1. **Data Fragmentation**
- Multiple Google Sheets with 10-15 tabs each
- No single source of truth
- Duplicate data entry across sheets
- Version control issues

#### 2. **Inefficient Workflow**
- KAMs contact same restaurant multiple times for different drives
- No visibility into which restaurants are in multiple drives
- Manual tracking of "approached" vs "converted" status
- Time-consuming data compilation for reports

#### 3. **Limited Analytics**
- No real-time conversion tracking
- Manual calculation of performance metrics
- Difficult to identify high-priority restaurants
- No historical trend analysis

#### 4. **Poor Visibility**
- Zonal Heads lack real-time team performance view
- No KAM-wise leaderboards
- Difficult to track drive-specific progress
- Performance reviews require manual data extraction

#### 5. **Scalability Issues**
- Google Sheets performance degrades with large datasets
- Formula errors break calculations
- Difficult to onboard new KAMs
- No audit trail for changes

---

## 💡 Solution Overview

### Core Vision

**"One dashboard to rule them all"** - A single, intuitive interface where:

1. All ongoing drives are visible in one clean view
2. Filtering by City, Zone, Drive Type, or KAM is instant
3. Each restaurant shows all active drives (multi-drive visibility)
4. Discounts can be modified and activated with one click
5. Live tracking shows conversion rates and performance metrics
6. Visual insights (charts, heatmaps, leaderboards) drive decisions
7. AI-powered prioritization suggests which restaurants to contact first

### Key Differentiators

| Feature | Current (Google Sheets) | New (Dashboard) |
|---------|------------------------|-----------------|
| **Data Source** | 10+ separate sheets | Single database |
| **Updates** | Manual refresh | Real-time sync |
| **Multi-Drive View** | Not possible | Automatic highlighting |
| **Activation** | Email/Slack request | One-click button |
| **Analytics** | Manual formulas | Auto-generated charts |
| **Prioritization** | KAM intuition | AI-powered ranking |
| **Mobile Access** | Poor | Responsive design |
| **Audit Trail** | None | Full history |

---

## 👥 User Personas

### 1. Anudeep Pawar - Key Account Manager (Primary User)

**Profile:**
- Manages 200-300 restaurants in Pune
- Handles 3-5 active drives simultaneously
- Daily tasks: Contact partners, activate discounts, track conversions
- Tech-savvy but time-constrained

**Goals:**
- See all assigned restaurants in one place
- Quickly identify high-priority targets
- Activate discounts without email chains
- Track daily conversion progress

**Pain Points:**
- Switching between multiple sheets wastes time
- Forgets which restaurants are in multiple drives
- Manual status updates are tedious
- Difficult to prove performance for reviews

**Dashboard Needs:**
- Clean restaurant list with filters
- Multi-drive indicators
- One-click activation
- Daily conversion counter

---

### 2. Samrudhh Bhave - Team Lead / Zonal Head (Secondary User)

**Profile:**
- Oversees 5-8 KAMs in a zone
- Responsible for team performance
- Conducts weekly reviews and monthly incentive calculations
- Needs high-level visibility

**Goals:**
- Monitor team progress in real-time
- Identify underperforming KAMs
- Track drive-specific conversion rates
- Generate performance reports quickly

**Pain Points:**
- No consolidated view of team performance
- Manual data compilation for reviews
- Difficult to spot trends or issues early
- Incentive calculations are error-prone

**Dashboard Needs:**
- Team summary dashboard
- KAM-wise leaderboards
- Drive performance comparison
- Exportable reports

---

### 3. Central Ops Analyst (Tertiary User)

**Profile:**
- Analyzes city-wide and national drive performance
- Identifies best practices and optimization opportunities
- Provides strategic recommendations to leadership

**Goals:**
- Cross-city performance comparison
- Historical trend analysis
- ROI calculation for different drive types
- Data-driven strategy recommendations

**Pain Points:**
- Data scattered across regional sheets
- Inconsistent data formats
- No historical data retention
- Manual aggregation is time-intensive

**Dashboard Needs:**
- City-level aggregation
- Historical trend charts
- Drive type comparison
- Export to BI tools

---

## 📊 Data Model Overview

### Core Entities

#### 1. **Restaurant**
- Unique identifier (res_id)
- Metadata (name, cuisine, locality)
- KAM assignment
- Order volume metrics

#### 2. **Drive**
- Drive type (discount, menu, ads)
- Drive name (e.g., "Special 35")
- Date range
- Target metrics

#### 3. **Drive Assignment**
- Links restaurant to drive
- Customer segment data (UM, MM, LA)
- Active promotions
- Suggested discounts
- Status (pending, approached, converted)

#### 4. **Conversion Event**
- Timestamp
- Action type (approached, converted, activated)
- KAM who performed action
- Notes/comments

### Sample Data Flow

```
Google Sheet Row:
res_id: 19195746
res_name: Shahi Darbar
kam_name: Anudeep Pawar
sept_ov: 52
la_active_promos: 0
la_base_code_suggested: "40 upto 80"
approached: No
converted_stepper: No

↓ (n8n ETL)

Database Records:
restaurants: {id: 19195746, name: "Shahi Darbar", kam: "Anudeep", ov: 52}
drive_data: {res_id: 19195746, drive: "Special 35", la_suggested: "40 upto 80", status: "pending"}

↓ (API)

Dashboard Display:
┌─────────────────────────────────────┐
│ Shahi Darbar                        │
│ OV: 52 | Cuisine: Chinese           │
│ 🎯 Discount Drive: Special 35       │
│ Suggested: 40 upto 80               │
│ [Modify] [Activate]                 │
└─────────────────────────────────────┘
```

---

## 🎯 Functional Requirements

### Must-Have (MVP)

1. **Data Sync**
   - Daily automated sync from Google Sheets
   - Support for multiple drive sheets
   - Data validation and error handling

2. **KAM Dashboard**
   - Restaurant list with filters (city, drive type, status)
   - Multi-drive visibility (highlight restaurants in >1 drive)
   - Editable discount fields
   - Activation button with status tracking

3. **Conversion Tracking**
   - Mark as "Approached"
   - Mark as "Converted"
   - Timestamp all actions
   - Display conversion % (today, week, overall)

4. **Basic Analytics**
   - Conversion rate widgets
   - Restaurant priority list (high OV, no discount)
   - Simple bar/line charts

### Should-Have (Phase 2)

5. **Zonal Dashboard**
   - City summary view
   - KAM-wise leaderboard
   - Drive performance comparison
   - Team conversion trends

6. **Advanced Filtering**
   - OV range slider
   - Cuisine/locality filters
   - Custom date ranges
   - Saved filter presets

7. **Notifications**
   - Daily email summary for KAMs
   - Slack alerts for conversions
   - Weekly team reports for Zonal Heads

### Nice-to-Have (Phase 3)

8. **AI Prioritization**
   - ML model to rank restaurants by conversion likelihood
   - Historical pattern analysis
   - Personalized recommendations per KAM

9. **Incentive Tracker**
   - Auto-calculate incentives based on conversions
   - Monthly performance reports
   - Goal tracking

10. **Mobile App**
    - Native iOS/Android app
    - Push notifications
    - Offline mode

---

## 🚫 Non-Functional Requirements

### Performance
- Dashboard load time: <2 seconds
- API response time: <500ms
- Support 1000+ concurrent users
- Handle 100,000+ restaurant records

### Reliability
- 99.9% uptime
- Daily backup of database
- Data sync error recovery
- Audit trail for all changes

### Security
- Role-based access control (KAM, Zonal Head, Admin)
- Encrypted data transmission (HTTPS)
- Secure API authentication
- PII data protection

### Usability
- Mobile-responsive design
- Intuitive navigation (max 3 clicks to any feature)
- Accessible (WCAG 2.1 AA compliance)
- Multi-language support (English, Hindi)

---

## 🎨 User Experience Principles

1. **Simplicity First** - Minimize cognitive load, show only relevant data
2. **Action-Oriented** - Every screen should enable a clear action
3. **Visual Hierarchy** - Use color, size, spacing to guide attention
4. **Feedback Loops** - Immediate confirmation for all actions
5. **Progressive Disclosure** - Show details on demand, not upfront

---

## 📈 Success Metrics

### Adoption Metrics
- 90%+ KAM daily active usage within 1 month
- 80%+ Zonal Head weekly usage
- <5 minutes average training time per user

### Efficiency Metrics
- 80% reduction in time spent on manual tracking
- 50% reduction in duplicate restaurant contacts
- 90% reduction in report generation time

### Business Metrics
- 15% improvement in conversion rates (through prioritization)
- 20% increase in multi-drive conversions
- 99%+ data accuracy vs. source sheets

### Technical Metrics
- <2s dashboard load time
- 99.9% uptime
- <1% data sync error rate

---

## 🔄 Integration Points

### Existing Systems
1. **Google Sheets** - Source of truth (until migration complete)
2. **Zomato Partner API** - Discount activation (if available)
3. **Email/Slack** - Notifications
4. **BI Tools** - Data export for analytics

### Future Integrations
1. **Zomato CRM** - Unified partner view
2. **Order Management System** - Real-time OV updates
3. **Marketing Automation** - Campaign tracking
4. **Mobile App** - Native notifications

---

## 🛡️ Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Google Sheets API rate limits | High | Medium | Implement caching, batch requests |
| Data sync failures | High | Low | Error logging, retry mechanism, alerts |
| User adoption resistance | Medium | Medium | Training, gradual rollout, feedback loops |
| Performance degradation | Medium | Low | Database indexing, query optimization |
| Security breach | High | Low | Encryption, access controls, audits |

---

## 📅 Phased Rollout Plan

### Phase 1: Pilot (Week 1-4)
- 1 city (Pune)
- 5 KAMs
- 1 drive type (Discount)
- Gather feedback, iterate

### Phase 2: Regional (Week 5-8)
- 3 cities
- All KAMs in region
- All drive types
- Zonal Head dashboard

### Phase 3: National (Week 9-12)
- All cities
- Full feature set
- AI prioritization
- Mobile app

---

## 🤝 Stakeholder Map

| Stakeholder | Role | Involvement | Communication |
|-------------|------|-------------|---------------|
| KAMs | Primary Users | Daily usage | In-app feedback, weekly surveys |
| Zonal Heads | Secondary Users | Weekly reviews | Monthly meetings |
| Central Ops | Tertiary Users | Strategic analysis | Quarterly reports |
| IT Team | Technical Support | Infrastructure | Slack channel |
| Product Manager | Owner | Roadmap decisions | Daily standups |

---

**Next Steps:** Review [Database Schema](02-DATABASE-SCHEMA.md) for technical implementation details.

