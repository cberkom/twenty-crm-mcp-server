# Feature Requests - December 2024

**Source:** Real-world usage feedback from AI-assisted sales workflow (Scenerii GmbH)
**Author:** Claude Code (acting as "Sarah" - Acquisition Manager persona)
**Date:** 2024-12-05

---

## Executive Summary

After extensive daily use of the Twenty CRM MCP integration for lead management, opportunity tracking, and task coordination, the following feature gaps have been identified. Features are prioritized based on frequency of need and workflow impact.

---

## Priority 1: Critical (Blocking Workflows)

### 1.1 Delete Operations for Core Entities

**Current State:** Can delete attachments, task_targets, note_targets only.
**Gap:** Cannot delete people, companies, opportunities, tasks, or notes.

**Use Cases:**
- Remove duplicate contacts after import
- Clean up test data during development
- Delete cancelled/invalid opportunities
- Remove obsolete tasks and notes

**Proposed Tools:**
```typescript
delete_person({ id: string })
delete_company({ id: string })
delete_opportunity({ id: string })
delete_task({ id: string })
// Note: delete_note already exists
```

**Implementation Notes:**
- Consider soft-delete vs hard-delete (Twenty may have trash/archive)
- Check for cascade behavior (what happens to linked taskTargets?)
- Add confirmation parameter for safety: `{ id: string, confirm: boolean }`

**Impact:** HIGH - Currently must use Twenty UI for cleanup, breaking AI workflow

---

### 1.2 Enhanced Filtering for list_* Operations

**Current State:** Basic `searchTerm` and single-field filters
**Gap:** Cannot combine multiple filter criteria

**Use Cases:**
- "Show all opportunities in PROPOSAL stage with amount > 10000"
- "List people created in the last 30 days without any linked tasks"
- "Find companies in Berlin with no opportunities"

**Proposed Enhancement:**
```typescript
list_opportunities({
  // Existing
  searchTerm?: string,
  stage?: string,
  companyId?: string,

  // NEW: Advanced filters
  filters?: {
    amount_gte?: number,      // Greater than or equal
    amount_lte?: number,      // Less than or equal
    createdAt_gte?: string,   // ISO date
    createdAt_lte?: string,
    updatedAt_gte?: string,
    updatedAt_lte?: string,
    hasActivity?: boolean,    // Has timeline activity in period
    assignedTo?: string,      // Workspace member ID
  },

  // NEW: Sorting
  orderBy?: 'createdAt' | 'updatedAt' | 'amount' | 'closeDate',
  orderDirection?: 'asc' | 'desc'
})
```

**Implementation Notes:**
- Check Twenty GraphQL API for supported filter operators
- May need to construct complex `filter` objects for the API
- Consider pagination improvements (cursor-based?)

**Impact:** HIGH - Currently doing multiple queries and filtering in conversation context

---

## Priority 2: Important (Significant Efficiency Gains)

### 2.1 Bulk Operations

**Current State:** All operations are single-record
**Gap:** No way to create/update multiple records efficiently

**Use Cases:**
- Import 50 contacts from a trade fair
- Update all opportunities in one pipeline stage
- Create follow-up tasks for all new leads

**Proposed Tools:**
```typescript
bulk_create_people({
  people: Array<CreatePersonInput>,
  skipDuplicates?: boolean,  // Skip if email already exists
  returnErrors?: boolean     // Return partial success info
})
// Returns: { created: Person[], skipped: string[], errors: Error[] }

bulk_update_opportunities({
  updates: Array<{ id: string, fields: UpdateFields }>
})

bulk_create_tasks({
  tasks: Array<CreateTaskInput>,
  autoLinkTargets?: boolean  // Use convenience linking
})
```

**Implementation Notes:**
- Check Twenty API for batch/bulk endpoints
- If not available, implement as parallel requests with rate limiting
- Consider transaction semantics (all-or-nothing vs partial success)
- Add progress reporting for large batches

**Impact:** MEDIUM-HIGH - Trade fair follow-up currently takes 30+ minutes

---

### 2.2 Pipeline Analytics / Summary Endpoint

**Current State:** Must query all opportunities and calculate manually
**Gap:** No aggregate/summary data available

**Use Cases:**
- Daily pipeline review
- Weekly reporting
- Identifying stale deals

**Proposed Tool:**
```typescript
get_pipeline_summary({
  // Optional filters
  dateRange?: { from: string, to: string },
  companyId?: string,
  assigneeId?: string
})

// Returns:
{
  totalOpportunities: number,
  totalValue: number,
  byStage: {
    NEW: { count: number, value: number },
    SCREENING: { count: number, value: number },
    MEETING: { count: number, value: number },
    PROPOSAL: { count: number, value: number },
    CUSTOMER: { count: number, value: number }
  },
  averageDealSize: number,
  averageCycleTime: number,  // Days from NEW to CUSTOMER
  staleOpportunities: Array<{  // No activity in 30+ days
    id: string,
    name: string,
    daysSinceActivity: number
  }>,
  upcomingCloseDates: Array<{
    id: string,
    name: string,
    closeDate: string,
    daysUntilClose: number
  }>
}
```

**Implementation Notes:**
- May need to aggregate from multiple API calls
- Consider caching for performance
- Could be a "computed" tool rather than direct API call

**Impact:** MEDIUM - Currently building reports manually in conversation

---

### 2.3 Overdue/Stale Entity Queries

**Current State:** Must list all and filter by date manually
**Gap:** No quick way to find items needing attention

**Proposed Tools:**
```typescript
get_overdue_tasks({
  assigneeId?: string,
  limit?: number
})
// Returns tasks where dueAt < now AND status != 'DONE'

get_stale_opportunities({
  daysSinceActivity?: number,  // Default: 30
  stages?: string[]  // Only check certain stages
})
// Returns opportunities with no timeline activity in N days

get_upcoming_tasks({
  daysAhead?: number,  // Default: 7
  assigneeId?: string
})
// Returns tasks due in the next N days
```

**Impact:** MEDIUM - Critical for daily workflow review

---

## Priority 3: Nice to Have (Quality of Life)

### 3.1 Duplicate Detection & Merge

**Use Cases:**
- Find potential duplicate contacts after import
- Merge records while preserving relationships

**Proposed Tools:**
```typescript
find_potential_duplicates({
  entityType: 'person' | 'company',
  threshold?: number  // Similarity threshold 0-1, default 0.8
})
// Returns: Array<{ entity1: Entity, entity2: Entity, confidence: number, matchedFields: string[] }>

merge_records({
  entityType: 'person' | 'company',
  keepId: string,      // Primary record to keep
  mergeId: string,     // Record to merge and delete
  fieldResolution?: {  // Which field values to keep
    [fieldName: string]: 'keep' | 'merge' | 'both'
  }
})
```

**Implementation Notes:**
- Duplicate detection likely needs custom logic (fuzzy matching)
- Merge needs to handle all relationships (tasks, notes, opportunities)
- Consider audit trail for merges

---

### 3.2 Workspace Member Context

**Current State:** `assigneeId` requires knowing member IDs
**Gap:** No way to list workspace members or get current user

**Proposed Tools:**
```typescript
list_workspace_members({
  limit?: number
})
// Returns: Array<{ id, name, email, role }>

get_current_user()
// Returns: { id, name, email } of the API token owner

get_my_tasks()
// Convenience: list_tasks({ assigneeId: currentUser.id })
```

---

### 3.3 Activity/Change History

**Use Cases:**
- See what changed on a record
- Audit trail for compliance
- Understand deal progression

**Proposed Tool:**
```typescript
get_entity_history({
  entityType: 'person' | 'company' | 'opportunity' | 'task' | 'note',
  entityId: string,
  limit?: number
})
// Returns: Array<{
//   timestamp: string,
//   action: 'created' | 'updated' | 'deleted',
//   changedFields: { field: string, oldValue: any, newValue: any }[],
//   userId?: string
// }>
```

**Implementation Notes:**
- Check if Twenty has audit log API
- May need to use timeline activities as proxy

---

### 3.4 Custom Fields Support

**Current State:** Only standard fields supported
**Gap:** Cannot read/write custom fields defined in Twenty

**Proposed Enhancement:**
```typescript
// Add to all create/update operations:
customFields?: {
  [fieldName: string]: any
}

// New tool to discover available custom fields:
list_custom_fields({
  entityType: 'person' | 'company' | 'opportunity'
})
// Returns: Array<{ name, type, required, options? }>
```

---

### 3.5 Email Linking (If Twenty Supports)

**Use Cases:**
- Link sent/received emails to contacts
- Track communication history on opportunities

**Proposed Tools:**
```typescript
create_email_activity({
  subject: string,
  body?: string,
  direction: 'inbound' | 'outbound',
  personId?: string,
  companyId?: string,
  opportunityId?: string,
  occurredAt?: string
})
```

**Implementation Notes:**
- Check Twenty's email integration capabilities
- May integrate with separate email MCP server

---

## Implementation Recommendations

### Phase 1 (v0.6.0)
1. Delete operations for all entities
2. Enhanced filters for list_opportunities
3. get_overdue_tasks convenience function

### Phase 2 (v0.7.0)
1. Bulk create operations (people, tasks)
2. Pipeline summary endpoint
3. Workspace member listing

### Phase 3 (v0.8.0)
1. Duplicate detection
2. Custom fields support
3. Enhanced sorting/pagination

---

## Testing Scenarios

Each new feature should be tested with these scenarios:

1. **Happy Path:** Normal operation with valid data
2. **Empty Results:** Query returns no results
3. **Large Dataset:** Performance with 100+ records
4. **Error Handling:** Invalid IDs, missing required fields
5. **Edge Cases:** Special characters, very long strings, null values
6. **AI Agent Usage:** Can Claude effectively use the tool in conversation?

---

## Feedback Loop

This document should be updated based on:
- Continued real-world usage
- User feedback from other implementations
- Twenty CRM API updates and new capabilities
- MCP protocol evolution

---

## Appendix: Current Tool Inventory

### Available (v0.5.x)
- People: create, get, list, update
- Companies: create, get, list, update
- Opportunities: create, get, list, update
- Tasks: create, get, list, update
- Notes: create, get, list, update, **delete**
- Task Targets: create, list, **delete**
- Note Targets: create, list, **delete**
- Timeline Activities: create, get, list, update
- Favorites: add, get, list, remove
- Attachments: create, get, list, **delete**

### Missing (Identified in this document)
- Delete: people, companies, opportunities, tasks
- Bulk: create/update for all entities
- Analytics: pipeline summary, stale detection
- Workspace: member listing, current user
- Advanced: duplicate detection, custom fields, history
