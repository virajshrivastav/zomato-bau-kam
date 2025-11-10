# 🔌 API Endpoints Reference

This document lists all API endpoints used in the Zomato Drive Dashboard, implemented using Supabase REST API and Supabase Client.

---

## 🏗️ Architecture

**API Layer:** Supabase REST API + Supabase JavaScript Client  
**Authentication:** Supabase Auth (JWT tokens)  
**Database:** PostgreSQL via Supabase  

---

## 📊 Restaurant Endpoints

### **GET /restaurants**

Get all restaurants for a KAM.

**Supabase Query:**
```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select('*')
  .eq('kam_name', kamName)
```

**Response:**
```json
[
  {
    "res_id": "19195746",
    "res_name": "Shahi Darbar",
    "kam_name": "Anudeep Pawar",
    "kam_email": "anudeep@zomato.com",
    "cuisine": "Chinese",
    "locality": "Camp Area",
    "account_type": "CA",
    "sept_ov": 52,
    "created_at": "2024-11-08T10:00:00Z",
    "updated_at": "2024-11-08T10:00:00Z"
  }
]
```

---

### **GET /restaurants/:id**

Get single restaurant with all drive data.

**Supabase Query:**
```typescript
const { data, error } = await supabase
  .from('restaurants')
  .select(`
    *,
    drive_data (
      *,
      drives (*)
    )
  `)
  .eq('res_id', resId)
  .single()
```

**Response:**
```json
{
  "res_id": "19195746",
  "res_name": "Shahi Darbar",
  "kam_name": "Anudeep Pawar",
  "drive_data": [
    {
      "id": 1,
      "res_id": "19195746",
      "drive_id": 1,
      "um": 23,
      "mm": 12,
      "la": 15,
      "la_base_code_suggested": "40 upto 80",
      "approached": false,
      "converted_stepper": false,
      "priority_score": 75,
      "drives": {
        "id": 1,
        "drive_name": "Special 35",
        "drive_type": "discount",
        "status": "active"
      }
    }
  ]
}
```

---

## 🎯 Drive Endpoints

### **GET /drives**

Get all active drives.

**Supabase Query:**
```typescript
const { data, error } = await supabase
  .from('drives')
  .select('*')
  .eq('status', 'active')
  .order('start_date', { ascending: false })
```

**Response:**
```json
[
  {
    "id": 1,
    "drive_name": "Special 35",
    "drive_type": "discount",
    "city": "Pune",
    "start_date": "2024-11-01",
    "end_date": "2024-11-30",
    "status": "active",
    "created_at": "2024-11-01T00:00:00Z"
  }
]
```

---

### **GET /drive-data**

Get drive data for specific restaurant and drive.

**Supabase Query:**
```typescript
const { data, error } = await supabase
  .from('drive_data')
  .select('*')
  .eq('res_id', resId)
  .eq('drive_id', driveId)
  .single()
```

---

## 📈 Stats Endpoints

### **GET /stats/kam**

Get KAM performance statistics.

**Supabase Query:**
```typescript
// Total restaurants
const { count: totalRestaurants } = await supabase
  .from('restaurants')
  .select('*', { count: 'exact', head: true })
  .eq('kam_name', kamName)

// Approached count
const { count: approachedCount } = await supabase
  .from('drive_data')
  .select('res_id', { count: 'exact', head: true })
  .eq('approached', true)
  .in('res_id', 
    supabase.from('restaurants').select('res_id').eq('kam_name', kamName)
  )

// Converted count
const { count: convertedCount } = await supabase
  .from('drive_data')
  .select('res_id', { count: 'exact', head: true })
  .eq('converted_stepper', true)
  .in('res_id',
    supabase.from('restaurants').select('res_id').eq('kam_name', kamName)
  )
```

**Response:**
```json
{
  "totalRestaurants": 250,
  "approachedCount": 180,
  "convertedCount": 120,
  "conversionRate": 48,
  "pendingCount": 70,
  "todayConversions": 5
}
```

---

### **GET /stats/team**

Get team-wide statistics for Zonal Head.

**Supabase Query:**
```typescript
const { data: kams } = await supabase
  .from('restaurants')
  .select('kam_name')
  .not('kam_name', 'is', null)

// For each KAM, get stats...
```

**Response:**
```json
[
  {
    "kam_name": "Anudeep Pawar",
    "total_restaurants": 250,
    "converted": 120,
    "conversion_rate": 48
  },
  {
    "kam_name": "Samrudhh Bhave",
    "total_restaurants": 200,
    "converted": 110,
    "conversion_rate": 55
  }
]
```

---

## ✅ Conversion Endpoints

### **POST /conversions/mark-approached**

Mark restaurant as approached.

**Supabase Query:**
```typescript
// Update drive_data
const { error: updateError } = await supabase
  .from('drive_data')
  .update({ approached: true, updated_at: new Date().toISOString() })
  .eq('res_id', resId)
  .eq('drive_id', driveId)

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
```

**Request Body:**
```json
{
  "resId": "19195746",
  "driveId": 1,
  "kamName": "Anudeep Pawar",
  "notes": "Called and discussed discount options"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### **POST /conversions/mark-converted**

Mark restaurant as converted.

**Supabase Query:**
```typescript
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
```

**Request Body:**
```json
{
  "resId": "19195746",
  "driveId": 1,
  "kamName": "Anudeep Pawar",
  "discountApplied": "40 upto 80",
  "notes": "Agreed to Special 35 discount"
}
```

---

### **PATCH /drive-data/discount**

Update discount code.

**Supabase Query:**
```typescript
const { error } = await supabase
  .from('drive_data')
  .update({ 
    [field]: value,
    updated_at: new Date().toISOString() 
  })
  .eq('res_id', resId)
  .eq('drive_id', driveId)
```

**Request Body:**
```json
{
  "resId": "19195746",
  "driveId": 1,
  "field": "la_base_code_suggested",
  "value": "45 upto 90"
}
```

---

## 📊 Analytics Endpoints

### **GET /analytics/conversion-trend**

Get conversion trend for last N days.

**Supabase Query:**
```typescript
const startDate = subDays(new Date(), days).toISOString()

const { data, error } = await supabase
  .from('conversion_tracking')
  .select('action_date')
  .eq('kam_name', kamName)
  .eq('action_type', 'converted')
  .gte('action_date', startDate)
  .order('action_date', { ascending: true })
```

**Response:**
```json
[
  { "date": "Nov 01", "conversions": 5 },
  { "date": "Nov 02", "conversions": 8 },
  { "date": "Nov 03", "conversions": 6 }
]
```

---

### **GET /analytics/drive-distribution**

Get conversions by drive type.

**Supabase Query:**
```typescript
const { data, error } = await supabase
  .from('conversion_tracking')
  .select(`
    drive_id,
    drives (drive_name, drive_type)
  `)
  .eq('kam_name', kamName)
  .eq('action_type', 'converted')
```

**Response:**
```json
[
  { "name": "Discount", "value": 120 },
  { "name": "Menu", "value": 45 },
  { "name": "Ads", "value": 30 }
]
```

---

## 🎯 Priority Endpoints

### **GET /priority/restaurants**

Get top priority restaurants.

**Supabase Query:**
```typescript
const { data } = await supabase
  .from('drive_data')
  .select(`
    *,
    restaurants (*)
  `)
  .in('res_id',
    supabase.from('restaurants').select('res_id').eq('kam_name', kamName)
  )
  .order('priority_score', { ascending: false })
  .limit(10)
```

**Response:**
```json
[
  {
    "res_id": "19195746",
    "res_name": "Shahi Darbar",
    "priority_score": 85,
    "locality": "Camp Area",
    "sept_ov": 52
  }
]
```

---

## 💰 Incentive Endpoints

### **GET /incentives/calculate**

Calculate incentive for KAM.

**Supabase Query:**
```typescript
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
```

**Response:**
```json
{
  "conversions": 75,
  "tier": "Tier 2",
  "base_incentive": 11250,
  "bonus": 2000,
  "total": 13250
}
```

---

## 🔐 Authentication

All endpoints require authentication via Supabase Auth.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
apikey: <SUPABASE_ANON_KEY>
```

**Getting JWT Token:**
```typescript
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

---

## ⚠️ Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "message": "Restaurant not found",
    "code": "PGRST116",
    "details": null,
    "hint": null
  }
}
```

**Common Error Codes:**
- `PGRST116` - Not found
- `23505` - Unique constraint violation
- `23503` - Foreign key violation
- `42501` - Insufficient privileges

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary values are in INR (₹)
- Pagination is handled by Supabase (default limit: 1000)
- Rate limiting: 1000 requests/hour per authenticated user

