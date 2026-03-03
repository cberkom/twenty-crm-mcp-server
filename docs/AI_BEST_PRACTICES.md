# Best Practices & Error Handling

## Communication Style

### Always Provide Context

**Bad:**
```
You: "Created person record."
```

**Good:**
```
You: "Created contact for Sarah Johnson (VP of Engineering at TechCo).
Email: sarah@techco.com, Phone: +1-555-0100.
Would you like me to create a follow-up task?"
```

### Confirm Before Bulk Actions

**Always ask:**
```
You: "I found 23 contacts missing email addresses.
Would you like me to list them so we can update them?"
```

### Suggest Related Actions

**After creating opportunity:**
```
You: "Created opportunity 'Q4 Deal - Acme Corp' ($100K, MEETING stage).
Would you also like to:
- Create a follow-up task?
- Add notes from your last conversation?
- Update the company ARR?"
```

### Use Natural Language Responses

**Too technical:**
```
You: "Query returned 0 results for filter companyId=xyz"
```

**User-friendly:**
```
You: "I don't see any contacts at TechCo yet. Would you like to add some?"
```

---

## Data Quality Tips

### Validate Data
```
User: "Add john@techco as a contact"
You: "That email looks incomplete (missing .com or .io). Did you mean john@techco.com?"
```

### Handle Currency Carefully
```
User: "Add company with ARR of 2M"
You: "Creating company with $2,000,000 USD ARR. Is that correct?"
```

### Always Link Related Records
- People → Companies (via `companyId`)
- Opportunities → Companies (via `companyId`)
- Opportunities → People (via `pointOfContactId`)
- Tasks/Notes → Entities (via auto-link parameters or targets)

**Check before creating:**
```
User: "Create an opportunity for Acme Corp"
You: [First search for Acme Corp]
     "Found Acme Corp (ID: xyz). Creating opportunity linked to them."
```

### Prevent Duplicates
```
You: "I found a contact with that email already:
Sarah Johnson at TechCo (created Nov 10).
Would you like me to update that record instead?"
```

---

## Time Management

**Use appropriate due dates:**
- "Next week" → +7 days
- "End of month" → Last day of current month
- "Next quarter" → First day of next quarter

**Always use ISO 8601 UTC:**
- Dates: `2025-12-31`
- Datetimes: `2025-11-20T14:00:00Z`

---

## Relationship Linking Strategy

### Prefer Auto-Linking (v0.6.2+)

When creating tasks or notes, use the convenience parameters:

```javascript
// One step instead of two
create_task({
  title: "Follow up on pricing",
  personId: "sarah-id",
  companyId: "acme-id"
})
```

### Use Explicit Targets When Needed

Use `create_task_target` / `create_note_target` when:
- Adding links to **existing** tasks/notes
- Linking to **additional** entities after creation
- Complex many-to-many relationships

---

## Attachment Best Practices

### Use Descriptive Filenames
```
Good: "Acme-Corp-Contract-Final-Nov2025.pdf"
Bad:  "contract.pdf" or "document (1).pdf"
```

### Always Specify File Category
Helps with filtering and organization later.

### Link to Multiple Entities
```javascript
{
  name: "Proposal-AcmeCorp.pdf",
  fullPath: "https://...",
  fileCategory: "TEXT_DOCUMENT",
  opportunityId: "deal-id",   // Shows on deal
  companyId: "acme-id"        // Also shows on company
}
```

### Confirm Before Deleting
Always show the filename and ask the user to confirm before deleting an attachment.

---

## Error Handling

### Common Errors

| Error | Cause | Response |
|:---|:---|:---|
| **401/403** | Invalid API key | "Please check your API key in MCP settings." |
| **404** | Wrong base URL | "Can't reach your Twenty CRM. Check TWENTY_BASE_URL." |
| **Record Not Found** | ID deleted/wrong | Fall back to `list_*` with searchTerm |
| **Validation Error** | Invalid format | Explain correct format and ask for correction |
| **Missing Required Field** | Missing param | Tell user what's needed |
| **Enum Error** | Invalid stage/status | List valid values (e.g., NEW, SCREENING, MEETING, PROPOSAL, CUSTOMER) |

### Graceful Degradation

1. **Get by ID fails** → Try `list_*` with searchTerm
2. **Update fails** → Verify record exists with get, then retry
3. **Create fails** → Check if record already exists (duplicate)
4. **API timeout** → Retry once, then inform user

### Progressive Disclosure

**Start simple, offer detail:**
```
You: "You have 14 opportunities totaling $515K. Would you like to see:
1. All deals (detailed list)
2. Grouped by stage
3. Filtered by company or date"
```

---

## Technical Notes

### GraphQL Backend
- All operations use GraphQL (handled by MCP server)
- Composite fields are automatically transformed
- Currency values are converted to/from micros
- You don't need to understand GraphQL to use these tools

### Rate Limits
- No built-in rate limits in MCP server
- For bulk operations, process sequentially
- Respect Twenty API limits

### Data Privacy
- Never log or expose API keys
- Treat all CRM data as confidential
- Follow user instructions for data handling
