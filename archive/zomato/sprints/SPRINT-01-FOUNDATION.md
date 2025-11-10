# 🏗️ Sprint 1: Foundation - Data Pipeline

**Duration:** 5-7 days  
**Goal:** Build a robust, automated data pipeline from Google Sheets to Supabase database.

**Prerequisites:** Sprint 0 completed ✅

---

## 🎯 Sprint Objectives

By the end of this sprint, you will have:

✅ Automated daily sync from Google Sheets to Supabase  
✅ Data validation and error handling  
✅ Multi-sheet support (discount, menu, ads drives)  
✅ Duplicate detection and upsert logic  
✅ Monitoring and alerting for sync failures  
✅ Historical data backup  

---

## 📋 Task Breakdown

### Task 1.1: Design Data Mapping Strategy (Priority: CRITICAL)

**Estimated Time:** 3 hours

**Objective:** Create a comprehensive mapping between Google Sheets columns and database fields.

**Steps:**

1. **Analyze All Drive Sheets**
   - List all Google Sheets you need to sync
   - Document column names for each sheet
   - Identify common columns vs. drive-specific columns

2. **Create Mapping Document**

   Create `database/column-mapping.json`:
   ```json
   {
     "restaurants": {
       "res_id": "res_id",
       "res_name": "res_name",
       "kam_name": "am_name",
       "kam_email": "AM Email",
       "tl_email": "TL Email",
       "cuisine": "Cuisine",
       "locality": "Locality",
       "account_type": "account_type",
       "sept_ov": "Sept OV"
     },
     "drive_data": {
       "um": "UM",
       "mm": "MM",
       "la": "LA",
       "res_orders": "res_orders",
       "la_active_promos": "la_active_promos",
       "la_base_code_suggested": "la_base_code_suggested",
       "la_step1": "la_step1",
       "la_step2": "la_step2",
       "la_step3": "la_step3",
       "mm_active_promos": "mm_active_promos",
       "mm_base_code_suggested": "mm_base_code_suggested",
       "um_active_promos": "um_active_promos",
       "um_base_code_suggested": "um_base_code_suggested",
       "approached": "Approached",
       "converted_stepper": "Converted for Stepper"
     }
   }
   ```

3. **Handle Data Type Conversions**
   - Numbers: `parseInt()` or `parseFloat()`
   - Booleans: "Yes" → true, "No" → false, empty → false
   - Dates: Parse to ISO format
   - Arrays: Split comma-separated strings

4. **Document Edge Cases**
   - Missing columns in some sheets
   - Different column names for same data
   - Null/empty value handling

**Deliverable:** `column-mapping.json` file with complete mapping

---

### Task 1.2: Build Core n8n Sync Workflow (Priority: CRITICAL)

**Estimated Time:** 6 hours

**Objective:** Create the main workflow that syncs one Google Sheet to Supabase.

**Workflow Structure:**

```
[Schedule Trigger] → [Read Google Sheet] → [Transform Data] → 
[Validate Data] → [Upsert to Supabase] → [Log Results] → [Send Notification]
```

**Detailed Steps:**

1. **Create New Workflow in n8n**
   - Name: "Daily Drive Sync - Discount"
   - Description: "Syncs discount drive sheet to Supabase"

2. **Add Schedule Trigger**
   - Node: "Schedule Trigger"
   - Cron: `0 6 * * *` (6 AM daily)
   - Timezone: Asia/Kolkata

3. **Add Google Sheets Node**
   - Node: "Google Sheets"
   - Operation: "Read"
   - Document: Select your drive sheet
   - Sheet: "Sheet10" (or your sheet name)
   - Range: "A:Z" (all columns)
   - Options:
     - ✅ First row contains headers
     - ✅ Return all data

4. **Add Function Node: Transform Data**
   ```javascript
   // Transform each row
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
       drive_id: 1, // Will be dynamic later
       um: parseInt(row.UM) || 0,
       mm: parseInt(row.MM) || 0,
       la: parseInt(row.LA) || 0,
       res_orders: parseFloat(row.res_orders) || 0,
       la_active_promos: row.la_active_promos?.trim() || null,
       la_base_code_suggested: row.la_base_code_suggested?.trim() || null,
       la_step1: row.la_step1?.trim() || null,
       la_step2: row.la_step2?.trim() || null,
       la_step3: row.la_step3?.trim() || null,
       mm_active_promos: row.mm_active_promos?.trim() || null,
       mm_base_code_suggested: row.mm_base_code_suggested?.trim() || null,
       um_active_promos: row.um_active_promos?.trim() || null,
       um_base_code_suggested: row.um_base_code_suggested?.trim() || null,
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

5. **Add Supabase Node: Upsert Restaurants**
   - Node: "Supabase"
   - Operation: "Upsert"
   - Table: "restaurants"
   - Data: `{{ $json.restaurant }}`
   - Conflict Target: `res_id`

6. **Add Supabase Node: Upsert Drive Data**
   - Node: "Supabase"
   - Operation: "Upsert"
   - Table: "drive_data"
   - Data: `{{ $json.driveData }}`
   - Conflict Target: `res_id, drive_id`

7. **Add Function Node: Log Results**
   ```javascript
   const items = $input.all();
   return [{
     json: {
       timestamp: new Date().toISOString(),
       total_rows: items.length,
       success: true,
       message: `Successfully synced ${items.length} restaurants`
     }
   }];
   ```

8. **Add Slack/Email Node: Send Notification**
   - Node: "Slack" or "Send Email"
   - Message: 
     ```
     ✅ Daily Drive Sync Completed
     
     Timestamp: {{ $json.timestamp }}
     Rows Synced: {{ $json.total_rows }}
     Status: {{ $json.message }}
     ```

**Deliverable:** Working n8n workflow that syncs one sheet

---

### Task 1.3: Add Data Validation (Priority: HIGH)

**Estimated Time:** 3 hours

**Objective:** Ensure data quality before inserting into database.

**Steps:**

1. **Add Function Node: Validate Data** (before Supabase nodes)
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
         errors: rowErrors
       });
       continue;
     }
     
     validated.push(item);
   }
   
   // Store errors for logging
   $node["Validate Data"].setContext('errors', errors);
   
   return validated;
   ```

2. **Add Error Logging**
   - Create Supabase table: `sync_errors`
     ```sql
     CREATE TABLE sync_errors (
       id SERIAL PRIMARY KEY,
       sync_date DATE DEFAULT CURRENT_DATE,
       res_id VARCHAR(20),
       error_message TEXT,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
   
   - Add Supabase node to insert errors

**Deliverable:** Data validation with error logging

---

### Task 1.4: Handle Multiple Drive Sheets (Priority: HIGH)

**Estimated Time:** 4 hours

**Objective:** Extend workflow to support multiple drive types.

**Steps:**

1. **Create Drive Registry**
   - Add to Supabase `drives` table:
     ```sql
     INSERT INTO drives (drive_name, drive_type, city, start_date, end_date) VALUES
     ('Special 35', 'discount', 'Pune', '2025-11-01', '2025-11-30'),
     ('Menu Photoshoot Q4', 'menu', 'Pune', '2025-11-01', '2025-12-31'),
     ('Ad Boost Campaign', 'ads', 'Pune', '2025-11-15', '2025-11-30');
     ```

2. **Modify n8n Workflow**
   - Add "Loop Over Items" node
   - Input: List of drive configurations
     ```json
     [
       {
         "drive_id": 1,
         "sheet_id": "1ABC...",
         "sheet_name": "Sheet10",
         "drive_type": "discount"
       },
       {
         "drive_id": 2,
         "sheet_id": "1XYZ...",
         "sheet_name": "Menu Drive",
         "drive_type": "menu"
       }
     ]
     ```
   
   - Process each drive in loop

3. **Dynamic Drive ID Assignment**
   - In transform function, use `$json.drive_id` instead of hardcoded `1`

**Deliverable:** Multi-sheet sync capability

---

### Task 1.5: Implement Incremental Sync (Priority: MEDIUM)

**Estimated Time:** 4 hours

**Objective:** Only sync changed rows to improve performance.

**Strategy:**

1. **Add Last Sync Tracking**
   ```sql
   CREATE TABLE sync_metadata (
     id SERIAL PRIMARY KEY,
     drive_id INTEGER REFERENCES drives(id),
     last_sync_timestamp TIMESTAMP,
     last_row_count INTEGER
   );
   ```

2. **Modify Workflow**
   - Before sync: Query `sync_metadata` for last sync time
   - After sync: Update `sync_metadata` with current time
   - Compare row counts to detect deletions

3. **Optimization**
   - If Google Sheets supports "last modified" column, use it
   - Otherwise, compare all rows (acceptable for <10k rows)

**Deliverable:** Faster sync for large datasets

---

### Task 1.6: Add Monitoring & Alerting (Priority: MEDIUM)

**Estimated Time:** 2 hours

**Objective:** Get notified when sync fails.

**Steps:**

1. **Add Error Handling to Workflow**
   - Wrap main workflow in try-catch
   - On error: Send alert

2. **Create Error Notification**
   ```javascript
   // In error handler
   return [{
     json: {
       alert_type: 'ERROR',
       timestamp: new Date().toISOString(),
       error_message: $error.message,
       workflow_name: 'Daily Drive Sync',
       action_required: 'Check n8n logs and Google Sheets access'
     }
   }];
   ```

3. **Send to Multiple Channels**
   - Slack: #data-sync-alerts
   - Email: data-team@zomato.com
   - SMS: (optional, for critical failures)

**Deliverable:** Proactive error monitoring

---

### Task 1.7: Create Backup Workflow (Priority: LOW)

**Estimated Time:** 2 hours

**Objective:** Daily backup of database to prevent data loss.

**Steps:**

1. **Create Backup Workflow**
   - Schedule: Daily at 11 PM
   - Export all tables to JSON
   - Store in Google Drive or S3

2. **Supabase Backup**
   ```javascript
   // In n8n Function node
   const tables = ['restaurants', 'drives', 'drive_data', 'conversion_tracking'];
   const backups = [];
   
   for (const table of tables) {
     const data = await supabase.from(table).select('*');
     backups.push({
       table,
       data: data.data,
       timestamp: new Date().toISOString()
     });
   }
   
   return backups;
   ```

3. **Store Backup**
   - Use "Google Drive" node to upload JSON file
   - Filename: `backup-YYYY-MM-DD.json`

**Deliverable:** Daily automated backups

---

## ✅ Sprint Completion Checklist

- [ ] Column mapping documented
- [ ] Core sync workflow created and tested
- [ ] Data validation implemented
- [ ] Multi-sheet support working
- [ ] Error logging functional
- [ ] Monitoring alerts configured
- [ ] Backup workflow running
- [ ] At least 100 real restaurants synced successfully
- [ ] Sync runs daily without manual intervention
- [ ] Team trained on monitoring sync status

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Transform function handles null values
- [ ] Validation catches invalid emails
- [ ] Boolean conversion works (Yes/No → true/false)
- [ ] Number parsing handles decimals

### Integration Tests
- [ ] Full workflow runs end-to-end
- [ ] Upsert logic prevents duplicates
- [ ] Multiple sheets sync correctly
- [ ] Errors are logged to database

### Edge Cases
- [ ] Empty Google Sheet (0 rows)
- [ ] Sheet with missing columns
- [ ] Duplicate res_id in same sheet
- [ ] Very large sheet (1000+ rows)
- [ ] Network failure during sync

---

## 📊 Success Metrics

- **Sync Success Rate:** >99%
- **Sync Duration:** <5 minutes for 1000 rows
- **Data Accuracy:** 100% match with source sheets
- **Error Detection:** All invalid rows logged
- **Uptime:** 30 consecutive days without manual intervention

---

## 🚨 Common Issues & Solutions

### Issue: Sync Fails with "Rate Limit Exceeded"

**Solution:**
- Add delay between API calls
- Use batch operations (100 rows at a time)
- Upgrade Google Sheets API quota

### Issue: Duplicate Rows in Database

**Solution:**
- Verify `UNIQUE` constraint on `(res_id, drive_id)`
- Check upsert logic in Supabase node
- Review transform function for duplicate generation

### Issue: Some Columns Not Syncing

**Solution:**
- Check column mapping JSON
- Verify column names match exactly (case-sensitive)
- Look for hidden characters in sheet headers

---

## 📚 Resources

- [n8n Google Sheets Node Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [Supabase Upsert Guide](https://supabase.com/docs/guides/database/postgres/upsert)
- [PostgreSQL UPSERT](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)

---

**Next Sprint:** [Sprint 2 - Basic UI (Dashboard Foundation)](SPRINT-02-BASIC-UI.md)

