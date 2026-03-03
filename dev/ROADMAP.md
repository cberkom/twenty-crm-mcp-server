# Twenty CRM MCP Server - Development Roadmap

**Last Updated:** March 3, 2026
**Current Version:** 0.6.2
**Total Tools:** 39 across 10 domains

---

## 📊 Current State (v0.6.2)

### Completed Domains

| Domain | Tools | Status | Version |
|--------|-------|--------|---------|
| **Person** | 4 | ✅ Complete | v0.1.0 |
| **Company** | 4 | ✅ Complete | v0.1.0 |
| **Opportunity** | 4 | ✅ Complete | v0.2.0 |
| **Task** | 4 | ✅ Complete | v0.4.0 |
| **Note** | 5 | ✅ Complete | v0.4.0 (delete v0.6.1) |
| **TaskTarget** | 3 | ✅ Complete | v0.5.0 |
| **NoteTarget** | 3 | ✅ Complete | v0.5.0 |
| **TimelineActivity** | 4 | ✅ Complete | v0.5.0 |
| **Favorite** | 4 | ✅ Complete | v0.5.0 |
| **Attachment** | 4 | ✅ Complete | v0.6.0 |

**Total:** 39 tools

### Recent Patches
- **v0.5.1** - Excluded dev/ from npm package
- **v0.5.2** - Fixed lazy initialization for GraphQL client
- **v0.5.3** - Added execute permissions to published package
- **v0.5.4** - Fixed symlink handling for npx execution (critical bug fix)
- **v0.6.1** - Fixed BlockNote format for notes, added `delete_note` tool
- **v0.6.2** - Added convenience parameters for `create_task`/`create_note` (auto-link to person/company/opportunity), fixed enum docs in `update_opportunity`, split AI docs into modular files

### Test Coverage
- 86 passing tests (+12 from v0.5.0)
- All CRUD operations covered
- Relationship linking verified
- Activity timeline tested
- Favorites management covered
- Attachment operations verified
- Composite type transformations verified
- Live MCP integration tested

---

## 🎯 Development Philosophy

### Natural Growth Strategy
We follow a **natural growth approach**, implementing features in order of:

1. **User Value** - Does it solve real CRM workflows?
2. **Complementary Features** - Does it extend existing functionality?
3. **Complexity** - Start simple, build to complex
4. **API Readiness** - Is the Twenty CRM API stable for this feature?

### Implementation Principles
- **Modular architecture** - Each domain is self-contained
- **Consistent patterns** - Follow established CRUD patterns
- **Test coverage** - All features must have comprehensive tests
- **Documentation first** - Update docs before releasing
- **MCP verification** - Live testing before commit

---

## ✅ Version 0.5.0 - Relationships & Context (COMPLETED)

**Theme:** Complete the core CRM workflow with relationships and activity tracking

**Released:** November 13, 2025
**Actual Effort:** ~7 hours
**New Tools:** 14 tools delivered
**Test Coverage:** +25 tests (49 → 74)

### Delivered Features

#### ✅ Task/Note Targets - COMPLETED
**Tools Delivered:** 6 tools
- ✅ `create_task_target` - Link tasks to records
- ✅ `list_task_targets` - List task-record relationships
- ✅ `delete_task_target` - Remove task links
- ✅ `create_note_target` - Link notes to records
- ✅ `list_note_targets` - List note-record relationships
- ✅ `delete_note_target` - Remove note links

**Impact:** Tasks and notes can now be properly associated with people, companies, and opportunities, providing essential context.

#### ✅ Activity Timeline - COMPLETED
**Tools Delivered:** 4 tools
- ✅ `create_activity` - Log interactions (CALL, EMAIL, MEETING, etc.)
- ✅ `get_activity` - Retrieve activity details
- ✅ `list_activities` - Search and filter timeline
- ✅ `update_activity` - Edit activity information

**Impact:** Complete interaction history and customer journey tracking now available.

#### ✅ Favorites Management - COMPLETED
**Tools Delivered:** 4 tools
- ✅ `add_favorite` - Add records to favorites
- ✅ `get_favorite` - Retrieve favorite details
- ✅ `list_favorites` - List all favorited records
- ✅ `remove_favorite` - Remove from favorites

**Impact:** Quick access to priority accounts, contacts, and opportunities.

### Success Metrics
- ✅ 34 total tools (20 → 34)
- ✅ Complete relationship graph implemented
- ✅ Activity history for all interactions
- ✅ Improved UX with favorites
- ✅ 74 passing tests (49 → 74)
- ✅ Documentation fully updated
- ✅ All three planned features delivered

---

## ✅ Version 0.6.0 - Attachments & File Management (COMPLETED)

**Theme:** Document and file management for CRM records

**Released:** November 14, 2025
**Actual Effort:** ~3 hours
**New Tools:** 4 tools delivered
**Test Coverage:** +12 tests (74 → 86)

### Delivered Features

#### ✅ Attachments & Files - COMPLETED
**Tools Delivered:** 4 tools
- ✅ `create_attachment` - Upload/create attachment linked to records
- ✅ `get_attachment` - Retrieve attachment details
- ✅ `list_attachments` - List and filter attachments
- ✅ `delete_attachment` - Remove attachments

**Supported File Categories:**
- ARCHIVE - Compressed files (.zip, .tar, etc.)
- AUDIO - Audio files (.mp3, .wav, etc.)
- IMAGE - Image files (.png, .jpg, etc.)
- PRESENTATION - Presentations (.pptx, .key, etc.)
- SPREADSHEET - Spreadsheets (.xlsx, .csv, etc.)
- TEXT_DOCUMENT - Documents (.pdf, .docx, etc.)
- VIDEO - Video files (.mp4, .mov, etc.)
- OTHER - Other file types

**Link Attachments To:**
- Tasks
- Opportunities
- Companies
- People
- Workflows
- Dashboards

**Impact:** Complete file management capability for CRM records. Users can now attach contracts, proposals, images, and other files to any CRM entity.

### Success Metrics
- ✅ 38 total tools (34 → 38)
- ✅ Attachment support for all major entities
- ✅ File category classification
- ✅ 86 passing tests (74 → 86)
- ✅ Documentation fully updated
- ✅ Ready for live integration testing

---

## 🚀 Version 0.7.0 - Workflow Automation (PLANNED)

**Theme:** Automation and advanced functionality

**Target Date:** TBD
**Estimated Effort:** 8-10 hours
**New Tools:** 8-10 tools

### Priority Features

#### 1. Workflow Automation ⭐⭐⭐ HIGH PRIORITY
**Effort:** 8-10 hours | **Tools:** 8-10 | **Impact:** Very High

**API Objects:**
- `workflows` - Automation rules
- `workflowVersions` - Version control for workflows
- `workflowRuns` - Execution history
- `workflowAutomatedTriggers` - Trigger conditions

**New Tools:**
```
create_workflow      - Create automation workflow
get_workflow         - Get workflow by ID
list_workflows       - List all workflows
update_workflow      - Update workflow configuration
delete_workflow      - Remove workflow
execute_workflow     - Manually trigger workflow
list_workflow_runs   - View execution history
get_workflow_run     - Get run details
```

**Use Cases:**
- Automated follow-up sequences
- Lead qualification routing
- Onboarding automation
- Status change notifications

---

## 📧 Version 0.8.0 - Communication Hub

**Theme:** Unified communication and calendar

**Target Date:** Q3 2025
**Estimated Effort:** 15-20 hours
**New Tools:** 16-24 tools

### Planned Features

#### 1. Email & Messaging Integration ⭐⭐⭐ VERY HIGH IMPACT
**Effort:** 10-12 hours | **Tools:** 12-16

**API Objects:**
- `messages` - Email messages
- `messageThreads` - Conversation threads
- `messageChannels` - Email accounts
- `messageParticipants` - Thread participants
- `messageFolders` - Email organization

**Use Cases:**
- Unified inbox within CRM
- Email tracking per account
- Thread management
- Automated email categorization

---

#### 2. Calendar Integration ⭐⭐⭐ HIGH IMPACT
**Effort:** 5-8 hours | **Tools:** 4-8

**API Objects:**
- `calendarEvents` - Meetings and appointments
- `calendarChannels` - Calendar sources
- `calendarEventParticipants` - Meeting attendees

**Use Cases:**
- Schedule client meetings
- Track availability
- Meeting history
- Calendar sync

---

### V0.8.0 Success Metrics

- ✅ Communication centralized
- ✅ Calendar fully integrated
- ✅ 100+ passing tests

---

## 🌟 Version 0.9.0 - Enterprise Features

**Theme:** Team collaboration and advanced features

**Estimated Effort:** 12-18 hours
**New Tools:** 12-16 tools

### Planned Features

#### 1. Team Management
**API Object:** `workspaceMembers`

- Manage team members
- Role assignments
- Permission handling
- Team collaboration

#### 2. Custom Dashboards
**API Object:** `dashboards`

- Create custom views
- Analytics and metrics
- Reporting functionality
- KPI tracking

#### 3. Connected Accounts
**API Object:** `connectedAccounts`

- External integrations
- OAuth management
- Third-party sync

---

## 📈 Long-term Vision

### Version 1.0.0 - Complete CRM Platform
**Target:** 100+ tools covering all Twenty CRM objects

### Growth Trajectory

```
v0.1.0 →  8 tools  (Person, Company)
v0.2.0 → 12 tools  (+ Opportunities)
v0.3.0 → 12 tools  (Architecture refactor)
v0.4.0 → 20 tools  (+ Tasks, Notes)
v0.5.0 → 34 tools  (+ Targets, Activities, Favorites)
v0.6.0 → 38 tools  (+ Attachments)
v0.6.1 → 39 tools  (+ delete_note)
v0.6.2 → 39 tools  (+ convenience params, doc split)
v0.7.0 → ~47 tools (+ Workflows) [planned]
v0.8.0 → ~65 tools (+ Email, Calendar) [planned]
v1.0.0 → 100+ tools (Complete platform)
```

---

## 🎨 Feature Backlog

### Under Consideration

- **Views & Filters** - Custom list views
- **Search** - Advanced search across all objects
- **Duplicate Detection** - Find and merge duplicates
- **Data Import/Export** - Bulk operations
- **API Rate Limiting** - Handle quotas gracefully
- **Caching Layer** - Improve performance
- **Offline Support** - Queue operations
- **Multi-workspace** - Support multiple Twenty instances
- **Custom Fields** - Workspace-specific fields
- **Webhooks** - Real-time event notifications

### Research Needed

- **AI/ML Features** - Lead scoring, recommendations
- **Mobile Optimization** - Better mobile experience
- **Real-time Collaboration** - Live updates
- **Advanced Analytics** - BI integration
- **GraphQL Subscriptions** - Live data sync

---

## 🤝 Contributing

Want to help build a feature? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Claiming a Feature

1. Comment on the related GitHub issue
2. Fork the repository
3. Follow the architecture patterns
4. Add comprehensive tests
5. Update documentation
6. Submit a PR

### Priority Order for Contributors

**Beginner Friendly:**
- Favorites Management (v0.5.0)
- Simple CRUD additions

**Intermediate:**
- Task/Note Targets (v0.5.0)
- Activity Timeline (v0.5.0)
- Attachments (v0.6.0)

**Advanced:**
- Workflow Automation (v0.6.0)
- Email Integration (v0.7.0)
- Calendar Integration (v0.7.0)

---

## 📝 Notes

- This roadmap is flexible and may change based on user feedback
- Feature prioritization considers both value and implementation complexity
- All features must maintain the modular architecture established in v0.3.0
- Test coverage is mandatory for all new features
- Breaking changes require major version bumps

---

**Questions or suggestions?** Open an issue or discussion on GitHub!
