# Tools Reference

Complete reference for all 39 MCP tools available for Twenty CRM.

---

## Person Operations (4 tools)

### `create_person`
**Purpose:** Add a new contact to the CRM

**Required:** `firstName`, `lastName`

**Optional:**
- `email` - Primary email address
- `phone` - Phone number (digits only)
- `phoneCountryCode` - ISO country code (e.g., "US", "DE")
- `phoneCallingCode` - Dialing code (e.g., "+1", "+49")
- `jobTitle` - Job title or role
- `companyId` - ID of associated company
- `linkedinUrl` - LinkedIn profile URL
- `xUrl` - X/Twitter profile URL
- `city` - City of residence

**Best Practices:**
- Always ask for at least first name, last name, and email
- If company is mentioned, check if it exists first with `list_companies`
- Include as much context as possible (job title, LinkedIn)

**Example:**
```javascript
{
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah@techco.com",
  phone: "5550100",
  phoneCountryCode: "US",
  phoneCallingCode: "+1",
  jobTitle: "VP of Engineering",
  companyId: "company-uuid-123"
}
```

---

### `get_person`
**Purpose:** Retrieve detailed information about a specific person

**Required:** `id`

**Returns:** All person fields including linked company, contact details, social profiles, and timestamps.

---

### `list_people`
**Purpose:** Search and filter contacts

**Optional:**
- `limit` (max 60, default 20)
- `searchTerm` - Search by name or email. **Supports multi-word search** (e.g., "Sarah Johnson" matches firstName=Sarah AND lastName=Johnson)
- `companyId` - Filter by company

**Pro Tips:**
- Use `limit: 60` for comprehensive lists
- Combine `searchTerm` with `companyId` for precise filtering

---

### `update_person`
**Purpose:** Modify existing contact information

**Required:** `id`
**Optional:** All fields from `create_person`

**Important:** Only include fields you want to change. Retrieve current data first if uncertain.

---

## Company Operations (4 tools)

### `create_company`
**Purpose:** Add a new company to the CRM

**Required:** `name`

**Optional:**
- `domainUrl` - Company website
- `addressStreet1`, `addressStreet2`, `addressCity`, `addressPostcode`, `addressState`, `addressCountry` - Full address
- `employees` - Number of employees
- `annualRecurringRevenue` - ARR in standard currency units (auto-converted to micros)
- `currency` - Currency code (default "USD")
- `idealCustomerProfile` - Boolean ICP flag
- `linkedinUrl`, `xUrl` - Social profiles

**Example:**
```javascript
{
  name: "TechStartup GmbH",
  domainUrl: "https://techstartup.io",
  addressCity: "Berlin",
  addressCountry: "Germany",
  employees: 25,
  annualRecurringRevenue: 500000,  // Stored as 500000000000 micros
  currency: "EUR",
  idealCustomerProfile: true
}
```

---

### `get_company`
**Purpose:** Retrieve detailed company information

**Required:** `id`

---

### `list_companies`
**Purpose:** Search and filter companies

**Optional:**
- `limit` (max 60, default 20)
- `searchTerm` - Search by company name

---

### `update_company`
**Purpose:** Update company information

**Required:** `id`
**Optional:** All fields from `create_company`

---

## Opportunity Operations (4 tools)

### `create_opportunity`
**Purpose:** Create a new sales opportunity

**Required:** `name`

**Optional:**
- `amount` - Deal value in standard currency units (auto-converted to micros)
- `currency` - Currency code (default "USD")
- `stage` - `NEW`, `SCREENING`, `MEETING`, `PROPOSAL`, `CUSTOMER`
- `closeDate` - Expected close date (ISO 8601: "YYYY-MM-DD")
- `companyId` - Associated company ID
- `pointOfContactId` - Primary contact person ID

**Stage Lifecycle:**
1. **NEW** → Just identified, needs qualification
2. **SCREENING** → Initial qualification in progress
3. **MEETING** → Active discussions scheduled
4. **PROPOSAL** → Formal proposal submitted
5. **CUSTOMER** → Deal won (closed-won)

**Example:**
```javascript
{
  name: "Q4 Enterprise Deal - Acme Corp",
  amount: 100000,
  currency: "EUR",
  stage: "MEETING",
  closeDate: "2025-12-31",
  companyId: "company-uuid-456",
  pointOfContactId: "person-uuid-789"
}
```

---

### `get_opportunity`
**Purpose:** Get detailed opportunity information

**Required:** `id`

---

### `list_opportunities`
**Purpose:** Query and filter opportunities

**Optional:**
- `limit` (max 60, default 20)
- `searchTerm` - Search by opportunity name
- `companyId` - Filter by company
- `stage` - Filter by stage

---

### `update_opportunity`
**Purpose:** Update opportunity details

**Required:** `id`
**Optional:** All fields from `create_opportunity` including `stage` (`NEW`, `SCREENING`, `MEETING`, `PROPOSAL`, `CUSTOMER`)

---

## Task Operations (4 tools)

### `create_task`
**Purpose:** Create an action item or reminder

**Required:** `title`

**Optional:**
- `body` - Detailed description (markdown supported)
- `status` - `TODO` (default), `IN_PROGRESS`, `DONE`
- `dueAt` - Due date (ISO 8601: "YYYY-MM-DDTHH:MM:SSZ")
- `assigneeId` - Workspace member to assign
- `personId` - **Auto-link** to person (creates task target automatically)
- `companyId` - **Auto-link** to company (creates task target automatically)
- `opportunityId` - **Auto-link** to opportunity (creates task target automatically)

**Example with auto-linking:**
```javascript
{
  title: "Follow up with Sarah about proposal",
  body: "Discuss pricing concerns from last meeting.",
  status: "TODO",
  dueAt: "2025-11-20T14:00:00Z",
  personId: "sarah-uuid",
  companyId: "acme-uuid"
}
// → Task created AND linked to both Sarah and Acme Corp
```

---

### `get_task`
**Purpose:** Retrieve task details

**Required:** `id`

---

### `list_tasks`
**Purpose:** Query and filter tasks

**Optional:**
- `limit` (max 60, default 20)
- `searchTerm` - Search by task title
- `status` - Filter by `TODO`, `IN_PROGRESS`, `DONE`
- `assigneeId` - Filter by assignee

---

### `update_task`
**Purpose:** Update task information

**Required:** `id`
**Optional:** `title`, `body`, `status`, `dueAt`, `assigneeId`

---

## Note Operations (5 tools)

### `create_note`
**Purpose:** Add a note or memo

**Required:** `title`

**Optional:**
- `body` - Note content (markdown supported)
- `personId` - **Auto-link** to person (creates note target automatically)
- `companyId` - **Auto-link** to company (creates note target automatically)
- `opportunityId` - **Auto-link** to opportunity (creates note target automatically)

**Example with auto-linking:**
```javascript
{
  title: "Call with Sarah - Pricing Discussion",
  body: "# Key Points\n\n- Budget confirmed at €75K\n- Timeline: Q1 2026\n- Next: Send revised proposal",
  personId: "sarah-uuid",
  companyId: "acme-uuid",
  opportunityId: "deal-uuid"
}
// → Note created AND linked to Sarah, Acme Corp, and the deal
```

---

### `get_note`
**Purpose:** Retrieve note details

**Required:** `id`

---

### `list_notes`
**Purpose:** Search notes

**Optional:**
- `limit` (max 60, default 20)
- `searchTerm` - Search by note title

---

### `update_note`
**Purpose:** Edit note content

**Required:** `id`
**Optional:** `title`, `body`

---

### `delete_note`
**Purpose:** Permanently delete a note

**Required:** `id`

**Important:** Always confirm with the user before deleting. This action cannot be undone.

---

## Task Target Operations (3 tools)

Use these to manage task-to-entity relationships after creation, or when you need to link a task to additional entities.

### `create_task_target`
**Purpose:** Link a task to a person, company, or opportunity

**Required:** `taskId`
**At least one of:** `personId`, `companyId`, `opportunityId`

**Note:** For new tasks, prefer using the convenience parameters on `create_task` instead.

---

### `list_task_targets`
**Purpose:** List task-record relationships

**Optional filters:** `taskId`, `personId`, `companyId`, `opportunityId`, `limit`

**Common use:** "Show all tasks for Acme Corp" → `list_task_targets({ companyId: "acme-id" })`

---

### `delete_task_target`
**Purpose:** Remove task-record link

**Required:** `id` (TaskTarget ID, not Task ID)

---

## Note Target Operations (3 tools)

Use these to manage note-to-entity relationships after creation, or when you need to link a note to additional entities.

### `create_note_target`
**Purpose:** Link a note to a person, company, or opportunity

**Required:** `noteId`
**At least one of:** `personId`, `companyId`, `opportunityId`

**Note:** For new notes, prefer using the convenience parameters on `create_note` instead.

---

### `list_note_targets`
**Purpose:** List note-record relationships

**Optional filters:** `noteId`, `personId`, `companyId`, `opportunityId`, `limit`

---

### `delete_note_target`
**Purpose:** Remove note-record link

**Required:** `id` (NoteTarget ID)

---

## Timeline Activity Operations (4 tools)

### `create_timeline_activity`
**Purpose:** Track interactions, events, and changes

**Required:** `name`

**Optional:**
- `properties` - JSON object with details (e.g., `{type: "CALL", duration: "30 min"}`)
- `happensAt` - When it occurred (ISO 8601)
- `workspaceMemberId`, `personId`, `companyId`, `opportunityId`, `noteId`, `taskId` - Link to entities
- `linkedRecordId`, `linkedObjectMetadataId`, `linkedRecordCachedName`

---

### `get_timeline_activity`
**Purpose:** Retrieve timeline activity details

**Required:** `id`

---

### `list_timeline_activities`
**Purpose:** Search and filter activities

**Optional:** `limit`, `searchTerm`, `personId`, `companyId`, `opportunityId`, `workspaceMemberId`, `noteId`, `taskId`

---

### `update_timeline_activity`
**Purpose:** Edit activity details

**Required:** `id`
**Optional:** `name`, `properties`, `happensAt`, and relationship IDs

---

## Favorites Operations (4 tools)

### `add_favorite`
**Purpose:** Add a record to favorites for quick access

**At least one of:** `personId`, `companyId`, `opportunityId`
**Optional:** `position` - Position in favorites list

---

### `get_favorite`
**Purpose:** Retrieve favorite details

**Required:** `id`

---

### `list_favorites`
**Purpose:** List all favorited records

**Optional:** `limit`, `personId`, `companyId`, `opportunityId`, `forWorkspaceMemberId`

---

### `remove_favorite`
**Purpose:** Remove record from favorites

**Required:** `id` (Favorite ID)

---

## Attachment Operations (4 tools)

### `create_attachment`
**Purpose:** Upload/create an attachment and link it to a CRM record

**Required:** `name`, `fullPath`

**Optional:**
- `fileCategory` - `ARCHIVE`, `AUDIO`, `IMAGE`, `PRESENTATION`, `SPREADSHEET`, `TEXT_DOCUMENT`, `VIDEO`, `OTHER`
- `taskId`, `opportunityId`, `companyId`, `personId`, `workflowId`, `dashboardId` - Link to entities
- `authorId` - Workspace member who created it

**Important:** At least one relationship ID should be provided.

**Example:**
```javascript
{
  name: "Q4-Contract-AcmeCorp.pdf",
  fullPath: "https://storage.company.com/contracts/acme-q4.pdf",
  fileCategory: "TEXT_DOCUMENT",
  opportunityId: "opp-uuid-123",
  companyId: "acme-uuid-456"
}
```

---

### `get_attachment`
**Purpose:** Retrieve attachment details

**Required:** `id`

---

### `list_attachments`
**Purpose:** List and filter attachments

**Optional:** `limit`, `searchTerm`, `fileCategory`, `taskId`, `opportunityId`, `companyId`, `personId`, `workflowId`, `dashboardId`, `authorId`

---

### `delete_attachment`
**Purpose:** Remove an attachment from the CRM

**Required:** `id`

**Important:** Always confirm before deleting. This removes the CRM reference (soft delete).
