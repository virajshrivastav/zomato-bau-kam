# 🔌 API Specification

## Overview

This document defines all API endpoints for the Zomato Drive Dashboard. The API is built using:
- **Next.js API Routes** (App Router)
- **Supabase REST API** (auto-generated)
- **n8n Webhooks** (for automation triggers)

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Next.js API Routes            │
│   /api/*                        │
└────────┬────────────────────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌─────────────┐  ┌──────────┐  ┌──────────┐
│  Supabase   │  │   n8n    │  │ OpenAI   │
│  Database   │  │ Webhooks │  │   API    │
└─────────────┘  └──────────┘  └──────────┘
```

---

## 📋 Endpoint Categories

1. **Restaurants** - Restaurant data and management
2. **Drives** - Drive campaign information
3. **Stats** - Analytics and performance metrics
4. **Conversions** - Conversion tracking and events
5. **Incentives** - Incentive calculations
6. **Webhooks** - n8n automation triggers

---

## 🔐 Authentication

All API routes use Supabase Auth with JWT tokens.

**Headers:**
```
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

**Row Level Security (RLS):**
- KAMs can only access their assigned restaurants
- Zonal Heads can access all restaurants in their zone
- Admins have full access

---

## 📡 API Endpoints

### 1. Restaurants

#### GET `/api/restaurants`

Get list of restaurants with optional filters.

**Query Parameters:**
- `kam_name` (string, optional) - Filter by KAM name
- `city` (string, optional) - Filter by city/locality
- `drive_id` (number, optional) - Filter by drive
- `status` (string, optional) - Filter by status: `pending`, `approached`, `converted`
- `min_ov` (number, optional) - Minimum order volume
- `max_ov` (number, optional) - Maximum order volume
- `limit` (number, optional, default: 100) - Results per page
- `offset` (number, optional, default: 0) - Pagination offset

**Response:**
```json
{
  "data": [
    {
      "res_id": "19195746",
      "res_name": "Shahi Darbar",
      "kam_name": "Anudeep Pawar",
      "kam_email": "anudeep.pawar@zomato.com",
      "cuisine": "Chinese",
      "locality": "Camp Area",
      "sept_ov": 52,
      "drive_count": 2,
      "priority_score": 75,
      "created_at": "2025-11-01T00:00:00Z"
    }
  ],
  "total": 227,
  "limit": 100,
  "offset": 0
}
```

**Example:**
```bash
GET /api/restaurants?kam_name=Anudeep%20Pawar&status=pending&min_ov=100
```

---

#### GET `/api/restaurants/[id]`

Get detailed information for a single restaurant.

**Path Parameters:**
- `id` (string) - Restaurant ID

**Response:**
```json
{
  "restaurant": {
    "res_id": "19195746",
    "res_name": "Shahi Darbar",
    "kam_name": "Anudeep Pawar",
    "kam_email": "anudeep.pawar@zomato.com",
    "tl_email": "samrudhh.bhave@zomato.com",
    "cuisine": "Chinese",
    "locality": "Camp Area",
    "account_type": "CA",
    "sept_ov": 52
  },
  "drives": [
    {
      "drive_id": 1,
      "drive_name": "Special 35",
      "drive_type": "discount",
      "um": 23,
      "mm": 12,
      "la": 15,
      "la_base_code_suggested": "40 upto 80",
      "approached": false,
      "converted_stepper": false,
      "priority_score": 75,
      "ai_reasoning": "High potential due to popular cuisine and no active promos"
    }
  ],
  "conversion_history": [
    {
      "action_type": "approached",
      "action_date": "2025-11-03",
      "kam_name": "Anudeep Pawar",
      "notes": "Partner interested, will decide by tomorrow"
    }
  ]
}
```

---

### 2. Drives

#### GET `/api/drives`

Get list of all drive campaigns.

**Query Parameters:**
- `status` (string, optional) - Filter by status: `active`, `completed`, `paused`
- `drive_type` (string, optional) - Filter by type: `discount`, `menu`, `ads`
- `city` (string, optional) - Filter by city

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "drive_name": "Special 35",
      "drive_type": "discount",
      "city": "Pune",
      "start_date": "2025-11-01",
      "end_date": "2025-11-30",
      "status": "active",
      "target_restaurants": 500,
      "target_conversion_rate": 25.0,
      "current_conversions": 120,
      "current_conversion_rate": 24.0
    }
  ]
}
```

---

#### GET `/api/drives/[id]/stats`

Get statistics for a specific drive.

**Response:**
```json
{
  "drive_id": 1,
  "drive_name": "Special 35",
  "total_restaurants": 500,
  "approached": 300,
  "converted": 120,
  "pending": 200,
  "conversion_rate": 24.0,
  "top_performers": [
    {
      "kam_name": "Anudeep Pawar",
      "conversions": 45,
      "conversion_rate": 28.0
    }
  ],
  "daily_trend": [
    { "date": "2025-11-01", "conversions": 5 },
    { "date": "2025-11-02", "conversions": 8 }
  ]
}
```

---

### 3. Stats & Analytics

#### GET `/api/stats/kam`

Get performance statistics for a KAM.

**Query Parameters:**
- `kam_name` (string, required) - KAM name
- `start_date` (string, optional) - Start date (YYYY-MM-DD)
- `end_date` (string, optional) - End date (YYYY-MM-DD)

**Response:**
```json
{
  "kam_name": "Anudeep Pawar",
  "totalRestaurants": 227,
  "approached": 150,
  "converted": 45,
  "pending": 77,
  "conversionRate": "19.82",
  "todayConversions": 3,
  "weekConversions": 12,
  "monthConversions": 45,
  "avgConversionsPerDay": 1.5,
  "topDrive": {
    "drive_name": "Special 35",
    "conversions": 30
  }
}
```

---

#### GET `/api/stats/team`

Get team-wide statistics (for Zonal Heads).

**Query Parameters:**
- `zone` (string, optional) - Filter by zone
- `city` (string, optional) - Filter by city

**Response:**
```json
{
  "team_stats": {
    "total_kams": 8,
    "total_restaurants": 1500,
    "total_conversions": 360,
    "avg_conversion_rate": 24.0
  },
  "kam_leaderboard": [
    {
      "kam_name": "Anudeep Pawar",
      "total_restaurants": 227,
      "converted": 45,
      "conversion_rate": 19.82,
      "rank": 1
    }
  ],
  "city_summary": [
    {
      "city": "Pune",
      "total_restaurants": 800,
      "conversions": 200,
      "conversion_rate": 25.0
    }
  ]
}
```

---

#### GET `/api/stats/charts`

Get chart data for visualizations.

**Query Parameters:**
- `kam_name` (string, required)
- `chart_type` (string, required) - `trend`, `distribution`, `comparison`
- `days` (number, optional, default: 30) - Number of days for trend

**Response:**
```json
{
  "trend": [
    { "date": "2025-11-01", "conversions": 2, "approached": 5 },
    { "date": "2025-11-02", "conversions": 3, "approached": 7 }
  ],
  "distribution": [
    { "name": "Discount", "value": 30 },
    { "name": "Menu", "value": 10 },
    { "name": "Ads", "value": 5 }
  ],
  "comparison": {
    "you": { "conversions": 45, "rate": 19.82 },
    "team_avg": { "conversions": 38, "rate": 22.5 }
  }
}
```

---

### 4. Conversions

#### POST `/api/conversions/mark-approached`

Mark a restaurant as approached.

**Request Body:**
```json
{
  "res_id": "19195746",
  "drive_id": 1,
  "kam_name": "Anudeep Pawar",
  "notes": "Called partner, interested in discount"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant marked as approached",
  "conversion_id": 123
}
```

---

#### POST `/api/conversions/mark-converted`

Mark a restaurant as converted.

**Request Body:**
```json
{
  "res_id": "19195746",
  "drive_id": 1,
  "kam_name": "Anudeep Pawar",
  "discount_applied": "40 upto 80",
  "notes": "Partner agreed to LA discount"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant marked as converted! 🎉",
  "conversion_id": 124,
  "incentive_earned": 150
}
```

---

#### POST `/api/conversions/activate`

Activate a discount (triggers n8n workflow).

**Request Body:**
```json
{
  "res_id": "19195746",
  "drive_id": 1,
  "kam_name": "Anudeep Pawar",
  "segment": "LA",
  "discount_code": "40 upto 80",
  "notes": "Activation requested"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activation request sent",
  "workflow_id": "n8n-abc123",
  "status": "pending"
}
```

---

#### GET `/api/conversions/history`

Get conversion history for a restaurant or KAM.

**Query Parameters:**
- `res_id` (string, optional) - Restaurant ID
- `kam_name` (string, optional) - KAM name
- `start_date` (string, optional)
- `end_date` (string, optional)

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "res_id": "19195746",
      "res_name": "Shahi Darbar",
      "drive_name": "Special 35",
      "kam_name": "Anudeep Pawar",
      "action_type": "approached",
      "action_date": "2025-11-03",
      "notes": "Partner interested",
      "created_at": "2025-11-03T10:30:00Z"
    }
  ],
  "total": 150
}
```

---

### 5. Incentives

#### GET `/api/incentives/calculate`

Calculate incentive for a KAM.

**Query Parameters:**
- `kam_name` (string, required)
- `month` (string, optional, default: current month) - Format: YYYY-MM

**Response:**
```json
{
  "kam_name": "Anudeep Pawar",
  "month": "2025-11",
  "total_conversions": 45,
  "tier": "Tier 2",
  "base_incentive": 6750,
  "bonus_incentive": 2000,
  "total_incentive": 8750,
  "amount_per_conversion": 150,
  "next_tier_threshold": 101,
  "conversions_to_next_tier": 56
}
```

---

#### GET `/api/incentives/leaderboard`

Get incentive leaderboard for the team.

**Query Parameters:**
- `month` (string, optional)

**Response:**
```json
{
  "month": "2025-11",
  "leaderboard": [
    {
      "rank": 1,
      "kam_name": "Anudeep Pawar",
      "conversions": 45,
      "total_incentive": 8750
    }
  ]
}
```

---

### 6. Webhooks (n8n Integration)

#### POST `/api/webhooks/sync-complete`

Called by n8n when data sync completes.

**Request Body:**
```json
{
  "workflow_name": "Daily Drive Sync",
  "status": "success",
  "rows_synced": 500,
  "errors": 0,
  "timestamp": "2025-11-05T06:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sync status recorded"
}
```

---

#### POST `/api/webhooks/activation-status`

Called by n8n when discount activation completes.

**Request Body:**
```json
{
  "res_id": "19195746",
  "drive_id": 1,
  "status": "activated",
  "activation_id": "ZOMATO-123456",
  "timestamp": "2025-11-05T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Activation status updated"
}
```

---

## 🚨 Error Handling

All endpoints follow consistent error response format:

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid KAM name provided",
    "details": {
      "field": "kam_name",
      "issue": "Field is required"
    }
  },
  "timestamp": "2025-11-05T10:30:00Z"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## 🔒 Rate Limiting

- **Authenticated requests:** 1000 requests/hour per user
- **Webhook endpoints:** 100 requests/hour per IP
- **Public endpoints:** 100 requests/hour per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1699200000
```

---

## 📊 Pagination

All list endpoints support pagination:

**Query Parameters:**
- `limit` (number, max: 100, default: 50)
- `offset` (number, default: 0)

**Response Headers:**
```
X-Total-Count: 500
X-Page-Limit: 50
X-Page-Offset: 0
```

---

## 🧪 Testing

**Base URL (Development):**
```
http://localhost:3000/api
```

**Base URL (Production):**
```
https://your-dashboard.vercel.app/api
```

**Example cURL:**
```bash
curl -X GET \
  'http://localhost:3000/api/restaurants?kam_name=Anudeep%20Pawar' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

---

**Next:** See [n8n Workflows](04-N8N-WORKFLOWS.md) for automation integration.

