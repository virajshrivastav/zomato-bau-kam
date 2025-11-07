# 🔄 n8n Workflows Documentation

## Overview

This document describes all n8n automation workflows for the Zomato Drive Dashboard. These workflows handle:
- Data synchronization from Google Sheets
- AI-powered prioritization
- Automated notifications
- Discount activation
- Backup and monitoring

---

## 📋 Workflow Index

1. **Daily Drive Sync** - Sync Google Sheets to Supabase
2. **AI Prioritization** - Daily AI-powered restaurant ranking
3. **Email Summaries** - Daily KAM email reports
4. **Slack Notifications** - Real-time event notifications
5. **Discount Activation** - Webhook-triggered activation flow
6. **Database Backup** - Daily database backup
7. **Error Monitoring** - Alert on sync failures

---

## 🔄 Workflow 1: Daily Drive Sync

**Purpose:** Automatically sync data from Google Sheets to Supabase database every day.

**Schedule:** Daily at 6:00 AM IST

**Workflow Diagram:**
```
[Schedule Trigger]
    ↓
[Get Drive List from Config]
    ↓
[Loop: For Each Drive]
    ↓
[Google Sheets: Read Data]
    ↓
[Function: Transform Data]
    ↓
[Function: Validate Data]
    ↓
[Supabase: Upsert Restaurants]
    ↓
[Supabase: Upsert Drive Data]
    ↓
[Function: Log Results]
    ↓
[Slack: Send Summary]
```

### Node Configuration

#### 1. Schedule Trigger
```json
{
  "rule": {
    "interval": [
      {
        "field": "cronExpression",
        "expression": "0 6 * * *"
      }
    ]
  },
  "timezone": "Asia/Kolkata"
}
```

#### 2. Get Drive List
```javascript
// Function Node: Drive Configuration
return [
  {
    json: {
      drives: [
        {
          drive_id: 1,
          drive_name: "Special 35",
          sheet_id: "1ABC...",
          sheet_name: "Sheet10",
          drive_type: "discount"
        },
        {
          drive_id: 2,
          drive_name: "Menu Photoshoot Q4",
          sheet_id: "1XYZ...",
          sheet_name: "Menu Drive",
          drive_type: "menu"
        }
      ]
    }
  }
];
```

#### 3. Loop Over Drives
```json
{
  "batchSize": 1,
  "options": {
    "loopOverItems": true
  }
}
```

#### 4. Google Sheets: Read Data
```json
{
  "authentication": "serviceAccount",
  "resource": "sheet",
  "operation": "read",
  "documentId": "={{ $json.sheet_id }}",
  "sheetName": "={{ $json.sheet_name }}",
  "range": "A:Z",
  "options": {
    "headerRow": true,
    "returnAllData": true
  }
}
```

#### 5. Function: Transform Data
```javascript
const items = $input.all();
const driveId = $('Get Drive List').item.json.drive_id;
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
    kam_email: row['AM Email']?.trim().toLowerCase(),
    tl_email: row['TL Email']?.trim().toLowerCase(),
    cuisine: row.Cuisine?.trim(),
    locality: row.Locality?.trim(),
    concat_locality_cuisine: row.Concat?.trim(),
    account_type: row.account_type?.trim(),
    sept_ov: parseInt(row['Sept OV']) || 0,
    updated_at: new Date().toISOString()
  };
  
  // Transform drive data
  const driveData = {
    res_id: row.res_id?.toString().trim(),
    drive_id: driveId,
    um: parseInt(row.UM) || 0,
    mm: parseInt(row.MM) || 0,
    la: parseInt(row.LA) || 0,
    res_orders: parseFloat(row.res_orders) || 0,
    
    // LA segment
    la_res_asv: parseFloat(row.la_res_asv) || null,
    la_active_promos: row.la_active_promos?.trim() || null,
    la_base_code_suggested: row.la_base_code_suggested?.trim() || null,
    la_step1: row.la_step1?.trim() || null,
    la_step2: row.la_step2?.trim() || null,
    la_step3: row.la_step3?.trim() || null,
    
    // MM segment
    mm_res_asvc: parseFloat(row.mm_res_asvc) || null,
    mm_active_promos: row.mm_active_promos?.trim() || null,
    mm_base_code_suggested: row.mm_base_code_suggested?.trim() || null,
    mm_step1: row.mm_step1?.trim() || null,
    mm_step2: row.mm_step2?.trim() || null,
    mm_step3: row.mm_step3?.trim() || null,
    
    // UM segment
    um_res_asvc: parseFloat(row.um_res_asvc) || null,
    um_active_promos: row.um_active_promos?.trim() || null,
    um_base_code_suggested: row.um_base_code_suggested?.trim() || null,
    um_step1: row.um_step1?.trim() || null,
    um_step2: row.um_step2?.trim() || null,
    um_step3: row.um_step3?.trim() || null,
    
    // Status
    approached: row.Approached?.toLowerCase() === 'yes',
    converted_stepper: row['Converted for Stepper']?.toLowerCase() === 'yes',
    
    last_updated: new Date().toISOString()
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

#### 6. Function: Validate Data
```javascript
const items = $input.all();
const validated = [];
const errors = [];

for (const item of items) {
  const { restaurant, driveData } = item.json;
  const rowErrors = [];
  
  // Validation rules
  if (!restaurant.res_id) {
    rowErrors.push('Missing res_id');
  }
  
  if (!restaurant.res_name) {
    rowErrors.push('Missing res_name');
  }
  
  if (!restaurant.kam_email || !restaurant.kam_email.includes('@')) {
    rowErrors.push('Invalid kam_email');
  }
  
  if (restaurant.sept_ov < 0) {
    rowErrors.push('Invalid sept_ov (negative)');
  }
  
  // If errors, log and skip
  if (rowErrors.length > 0) {
    errors.push({
      res_id: restaurant.res_id,
      errors: rowErrors.join(', ')
    });
    continue;
  }
  
  validated.push(item);
}

// Store errors in context for later logging
if (errors.length > 0) {
  $node["Validate Data"].setContext('validation_errors', errors);
}

return validated;
```

#### 7. Supabase: Upsert Restaurants
```json
{
  "authentication": "serviceAccount",
  "resource": "row",
  "operation": "upsert",
  "tableId": "restaurants",
  "data": "={{ $json.restaurant }}",
  "options": {
    "onConflict": "res_id"
  }
}
```

#### 8. Supabase: Upsert Drive Data
```json
{
  "authentication": "serviceAccount",
  "resource": "row",
  "operation": "upsert",
  "tableId": "drive_data",
  "data": "={{ $json.driveData }}",
  "options": {
    "onConflict": "res_id,drive_id"
  }
}
```

#### 9. Function: Log Results
```javascript
const items = $input.all();
const validationErrors = $node["Validate Data"].getContext('validation_errors') || [];

return [{
  json: {
    timestamp: new Date().toISOString(),
    drive_name: $('Get Drive List').item.json.drive_name,
    total_rows: items.length,
    validation_errors: validationErrors.length,
    success: true,
    message: `Successfully synced ${items.length} restaurants. ${validationErrors.length} errors.`
  }
}];
```

#### 10. Slack: Send Summary
```json
{
  "authentication": "oAuth2",
  "resource": "message",
  "operation": "post",
  "channel": "#drive-sync-logs",
  "text": "✅ *Daily Drive Sync Completed*\n\nDrive: {{ $json.drive_name }}\nRows Synced: {{ $json.total_rows }}\nErrors: {{ $json.validation_errors }}\nTimestamp: {{ $json.timestamp }}"
}
```

---

## 🤖 Workflow 2: AI Prioritization

**Purpose:** Use GPT-4 to analyze and rank restaurants by conversion likelihood.

**Schedule:** Daily at 5:00 AM IST (before sync)

**Workflow Diagram:**
```
[Schedule Trigger]
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

### Key Nodes

#### OpenAI Node Configuration
```json
{
  "authentication": "apiKey",
  "resource": "chat",
  "operation": "create",
  "model": "gpt-4-turbo-preview",
  "messages": {
    "values": [
      {
        "role": "system",
        "content": "You are a restaurant partnership expert at Zomato."
      },
      {
        "role": "user",
        "content": "={{ $json.prompt }}"
      }
    ]
  },
  "options": {
    "temperature": 0.3,
    "response_format": {
      "type": "json_object"
    }
  }
}
```

---

## 📧 Workflow 3: Email Summaries

**Purpose:** Send daily performance summary to each KAM.

**Schedule:** Daily at 7:00 AM IST

**Workflow Diagram:**
```
[Schedule Trigger]
    ↓
[Supabase: Get All KAMs]
    ↓
[Loop: For Each KAM]
    ↓
[Supabase: Get KAM Stats]
    ↓
[Supabase: Get Top Priority Restaurants]
    ↓
[Function: Generate Email HTML]
    ↓
[Send Email (Gmail/SendGrid)]
```

### Email Template (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #ef4444; color: white; padding: 30px; text-align: center; }
    .stats { display: flex; gap: 10px; padding: 20px; }
    .stat-card { flex: 1; background: #f9fafb; padding: 15px; border-radius: 8px; text-align: center; }
    .stat-number { font-size: 32px; font-weight: bold; color: #1f2937; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
    .priority-section { padding: 20px; }
    .restaurant-item { padding: 15px; border-bottom: 1px solid #e5e7eb; }
    .cta-button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Daily Drive Summary</h1>
      <p>Good morning, {{ $json.kam_name }}! 🌅</p>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">{{ $json.stats.pending }}</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ $json.stats.todayConversions }}</div>
        <div class="stat-label">Today</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ $json.stats.conversionRate }}%</div>
        <div class="stat-label">Rate</div>
      </div>
    </div>
    
    <div class="priority-section">
      <h2>🎯 Top Priority Today</h2>
      <!-- Loop through top 5 restaurants -->
    </div>
    
    <div style="text-align: center; padding: 20px;">
      <a href="https://your-dashboard.vercel.app" class="cta-button">
        Open Dashboard
      </a>
    </div>
  </div>
</body>
</html>
```

---

## 💬 Workflow 4: Slack Notifications

**Purpose:** Send real-time notifications for important events.

**Trigger:** Webhook (called from Next.js app)

**Webhook URL:** `https://your-n8n.app.n8n.cloud/webhook/slack-notify`

**Workflow Diagram:**
```
[Webhook Trigger]
    ↓
[Function: Route by Event Type]
    ↓
[Switch: Event Type]
    ├─ conversion → [Format Conversion Message]
    ├─ milestone → [Format Milestone Message]
    └─ error → [Format Error Message]
    ↓
[Slack: Send Message]
```

### Event Types

**1. Conversion Event**
```javascript
{
  "event_type": "conversion",
  "data": {
    "kam_name": "Anudeep Pawar",
    "res_name": "Shahi Darbar",
    "drive_name": "Special 35",
    "discount_applied": "40 upto 80",
    "todayTotal": 3
  }
}
```

**2. Milestone Event**
```javascript
{
  "event_type": "milestone",
  "data": {
    "kam_name": "Anudeep Pawar",
    "milestone": 50,
    "conversion_rate": 22.5
  }
}
```

---

## 🎯 Workflow 5: Discount Activation

**Purpose:** Process discount activation requests from dashboard.

**Trigger:** Webhook

**Webhook URL:** `https://your-n8n.app.n8n.cloud/webhook/activate-discount`

**Workflow Diagram:**
```
[Webhook Trigger]
    ↓
[Function: Validate Request]
    ↓
[Supabase: Get Restaurant Details]
    ↓
[HTTP Request: Zomato Partner API]
    ↓
[Supabase: Update Status]
    ↓
[Supabase: Log Conversion Event]
    ↓
[Slack: Notify Success]
    ↓
[Webhook Response]
```

### Request Payload
```json
{
  "res_id": "19195746",
  "drive_id": 1,
  "kam_name": "Anudeep Pawar",
  "segment": "LA",
  "discount_code": "40 upto 80",
  "notes": "Partner confirmed via call"
}
```

---

## 💾 Workflow 6: Database Backup

**Purpose:** Daily backup of all database tables.

**Schedule:** Daily at 11:00 PM IST

**Workflow Diagram:**
```
[Schedule Trigger]
    ↓
[Supabase: Export All Tables]
    ↓
[Function: Create Backup JSON]
    ↓
[Google Drive: Upload Backup]
    ↓
[Slack: Confirm Backup]
```

---

## 🚨 Workflow 7: Error Monitoring

**Purpose:** Monitor sync failures and alert team.

**Trigger:** Error Trigger (on any workflow failure)

**Workflow Diagram:**
```
[Error Trigger]
    ↓
[Function: Format Error Details]
    ↓
[Slack: Send Alert]
    ↓
[Email: Notify Admin]
```

---

## 📦 Workflow Export/Import

### Export Workflow
1. Open workflow in n8n
2. Click "..." menu → "Download"
3. Save JSON file to `n8n-workflows/` folder

### Import Workflow
1. Open n8n
2. Click "+" → "Import from File"
3. Select JSON file
4. Update credentials
5. Activate workflow

---

## 🔐 Credentials Setup

### Required Credentials

1. **Google Sheets API**
   - Type: Service Account
   - File: JSON key from Google Cloud Console

2. **Supabase**
   - Type: API Key
   - URL: Your Supabase project URL
   - Key: Service role key (secret)

3. **OpenAI**
   - Type: API Key
   - Key: Your OpenAI API key

4. **Slack**
   - Type: OAuth2
   - Bot Token: From Slack App settings

5. **Email (Gmail/SendGrid)**
   - Gmail: OAuth2
   - SendGrid: API Key

---

**Next:** See [UI Components](05-UI-COMPONENTS.md) for frontend implementation.

