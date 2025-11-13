/**
 * MCP tool definitions for Activity operations
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const ACTIVITY_TOOLS: Tool[] = [
  {
    name: "create_activity",
    description: "Log a new activity/interaction in Twenty CRM",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Activity title (required)",
        },
        body: {
          type: "string",
          description: "Activity body/description",
        },
        type: {
          type: "string",
          description:
            "Activity type (required) - e.g., 'CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK', 'CUSTOM'",
        },
        occurredAt: {
          type: "string",
          description: "When the activity occurred (ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ)",
        },
        assigneeId: {
          type: "string",
          description: "ID of the workspace member assigned to this activity",
        },
        personId: {
          type: "string",
          description: "Person ID to associate with this activity",
        },
        companyId: {
          type: "string",
          description: "Company ID to associate with this activity",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to associate with this activity",
        },
      },
      required: ["title", "type"],
    },
  },
  {
    name: "get_activity",
    description: "Get details of a specific activity by ID",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Activity ID",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "list_activities",
    description:
      "List activities (interactions/events) with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of results to return (max: 60, default: 20)",
        },
        searchTerm: {
          type: "string",
          description: "Search by activity title",
        },
        type: {
          type: "string",
          description: "Filter by activity type (e.g., 'CALL', 'EMAIL', 'MEETING')",
        },
        personId: {
          type: "string",
          description: "Filter by person ID - show activities for this person",
        },
        companyId: {
          type: "string",
          description: "Filter by company ID - show activities for this company",
        },
        opportunityId: {
          type: "string",
          description: "Filter by opportunity ID - show activities for this opportunity",
        },
        assigneeId: {
          type: "string",
          description: "Filter by assignee ID",
        },
      },
    },
  },
  {
    name: "update_activity",
    description: "Update an existing activity's information",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Activity ID (required)",
        },
        title: {
          type: "string",
          description: "Activity title",
        },
        body: {
          type: "string",
          description: "Activity body/description",
        },
        type: {
          type: "string",
          description: "Activity type",
        },
        occurredAt: {
          type: "string",
          description: "When the activity occurred (ISO 8601 format)",
        },
        assigneeId: {
          type: "string",
          description: "ID of the workspace member assigned to this activity",
        },
        personId: {
          type: "string",
          description: "Person ID to associate with this activity",
        },
        companyId: {
          type: "string",
          description: "Company ID to associate with this activity",
        },
        opportunityId: {
          type: "string",
          description: "Opportunity ID to associate with this activity",
        },
      },
      required: ["id"],
    },
  },
];
