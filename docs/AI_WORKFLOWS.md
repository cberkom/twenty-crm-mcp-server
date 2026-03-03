# Common Workflows & Use Cases

## Workflow 1: New Lead Qualification

**Scenario:** User meets someone at a conference who could be a potential customer.

**Flow:**
```
1. list_companies (searchTerm: "Acme Corp")     → Check if company exists
2. create_company (if not found)                 → Add company
3. create_person (with companyId)                → Add contact linked to company
4. create_note (with personId, companyId)        → Capture meeting context (auto-linked!)
5. create_task (with personId, companyId)        → Schedule follow-up (auto-linked!)
```

**Key:** Use the auto-link parameters on `create_note` and `create_task` to save steps.

---

## Workflow 2: Weekly Pipeline Review

**Scenario:** Sales manager wants to review all active opportunities.

**Flow:**
```
1. list_opportunities (limit: 60)               → Get all deals
2. Segment by stage, sum amounts                 → Present pipeline overview
3. Identify stalled deals (old update dates)     → Flag for attention
4. create_task (with opportunityId)              → Follow-up tasks (auto-linked!)
```

**Example Response:**
```
Your pipeline by stage:
- NEW: 3 deals ($45K)
- SCREENING: 5 deals ($120K)
- MEETING: 4 deals ($200K)
- PROPOSAL: 2 deals ($150K)
Total: 14 deals, $515K pipeline
```

---

## Workflow 3: Client Onboarding

**Scenario:** A deal just closed and needs proper setup.

**Flow:**
```
1. update_opportunity (stage: "CUSTOMER")        → Mark deal as won
2. update_company (ARR update)                   → Adjust company ARR
3. create_person (if new stakeholders)           → Add onboarding contacts
4. create_task ×4 (with companyId)               → Onboarding checklist (auto-linked!)
5. create_note (with companyId, opportunityId)   → Onboarding plan (auto-linked!)
```

---

## Workflow 4: Data Quality Audit

**Scenario:** Ensure CRM data is complete and accurate.

**Flow:**
```
1. list_people (limit: 60)                       → Get all contacts
2. Analyze for missing fields                    → Identify gaps
3. Prioritize by ICP companies                   → Focus on high-value records
4. update_person ×N                              → Enrich records
5. create_task (for records needing research)     → Track enrichment work
```

---

## Workflow 5: Account-Based Sales Strategy

**Scenario:** Focus on high-value target accounts.

**Flow:**
```
1. list_companies (limit: 60)                    → Get all companies
2. update_company (idealCustomerProfile: true)   → Mark ICP companies
3. list_people (companyId filter)                → Map stakeholders per company
4. create_task (with companyId)                  → Research tasks (auto-linked!)
```

---

## Workflow 6: Deal Documentation

**Scenario:** Manage contracts and proposals for a major deal.

**Flow:**
```
1. list_opportunities (searchTerm)               → Find the deal
2. list_attachments (opportunityId)              → Check existing documents
3. create_attachment ×N (opportunityId + companyId) → Upload new documents
4. create_task (with opportunityId)              → Legal review task (auto-linked!)
5. delete_attachment                             → Remove outdated versions
```

---

## Use Case Examples

### Example 1: Founder Adding First Contacts

```
User: I just met Sarah Johnson from Acme Corp at the conference.
      She's VP of Sales, email sarah.johnson@acme.com

You: [list_companies searchTerm: "Acme Corp"]
     "I don't see Acme Corp yet. Let me create it. What's their website?"

User: acme.com

You: [create_company name: "Acme Corp", domainUrl: "https://acme.com"]
     [create_person firstName: "Sarah", lastName: "Johnson",
      email: "sarah.johnson@acme.com", jobTitle: "VP of Sales",
      companyId: <acme-id>]
     "Added Sarah Johnson (VP of Sales at Acme Corp).
      Should I create a follow-up reminder?"

User: Yes, next Tuesday

You: [create_task title: "Follow up with Sarah Johnson at Acme Corp",
      dueAt: "2025-11-19T09:00:00Z", personId: <sarah-id>, companyId: <acme-id>]
     "Done! Reminder set for Tuesday, linked to Sarah and Acme Corp."
```

### Example 2: Sales Manager Reviewing Pipeline

```
User: Show me our Q4 pipeline

You: [list_opportunities limit: 60]

     "Your Q4 pipeline:

     MEETING Stage (3 deals):
     • Enterprise Deal - Acme Corp: $100K (closes Dec 15)
     • Expansion - TechCo: $50K (closes Nov 30)
     • New Logo - StartupX: $25K (closes Dec 20)

     PROPOSAL Stage (2 deals):
     • Strategic Partnership - BigCo: $200K (closes Dec 31)
     • Pilot Program - SmallCo: $30K (closes Nov 25)

     Total: 5 deals, $405K pipeline.
     SmallCo closes in 12 days. Want me to create a follow-up task?"
```

### Example 3: Customer Success Onboarding

```
User: We just closed TechStartup for $150K ARR!

You: [list_opportunities searchTerm: "TechStartup"]
     [update_opportunity stage: "CUSTOMER"]
     [get_company <techstartup-id>]
     [update_company annualRecurringRevenue: 650000]

     "Congratulations! Updated TechStartup to CUSTOMER status.
      Updated ARR from $500K to $650K.
      Who's our primary onboarding contact?"

User: Max Mustermann, CTO, max@techstartup.io

You: [create_person firstName: "Max", lastName: "Mustermann",
      email: "max@techstartup.io", jobTitle: "CTO", companyId: <id>]

     "Added Max. Creating onboarding tasks..."

     [create_task title: "Kickoff meeting with Max", dueAt: tomorrow, companyId: <id>]
     [create_task title: "Send welcome docs", dueAt: tomorrow, companyId: <id>]
     [create_task title: "Technical setup call", dueAt: next week, companyId: <id>]
     [create_note title: "TechStartup Onboarding Plan",
      body: "• Deal: $150K ARR\n• Contact: Max (CTO)\n• Priority: API integration",
      companyId: <id>]

     "All set! 3 tasks created and onboarding plan documented."
```
