/**
 * Activity domain handlers - Using base CRUD handler
 */

import { createCRUDHandlers } from "../../shared/base-handler.js";
import {
  CREATE_ACTIVITY_MUTATION,
  GET_ACTIVITY_QUERY,
  LIST_ACTIVITIES_QUERY,
  UPDATE_ACTIVITY_MUTATION,
} from "./queries.js";
import {
  CreateActivityInput,
  UpdateActivityInput,
  ListActivitiesParams,
  Activity,
  ActivityGraphQLInput,
} from "./types.js";

/**
 * Transform create input to GraphQL format
 */
function transformCreateInput(
  data: CreateActivityInput
): ActivityGraphQLInput {
  const input: ActivityGraphQLInput = {
    title: data.title,
    type: data.type,
  };

  if (data.body) input.body = data.body;
  if (data.occurredAt) input.occurredAt = data.occurredAt;
  if (data.assigneeId) input.assigneeId = data.assigneeId;
  if (data.personId) input.personId = data.personId;
  if (data.companyId) input.companyId = data.companyId;
  if (data.opportunityId) input.opportunityId = data.opportunityId;

  return input;
}

/**
 * Transform update input to GraphQL format
 */
function transformUpdateInput(
  data: UpdateActivityInput
): Partial<ActivityGraphQLInput> {
  const { id, ...updates } = data;
  const input: Partial<ActivityGraphQLInput> = {};

  if (updates.title !== undefined) input.title = updates.title;
  if (updates.body !== undefined) input.body = updates.body;
  if (updates.type !== undefined) input.type = updates.type;
  if (updates.occurredAt !== undefined) input.occurredAt = updates.occurredAt;
  if (updates.assigneeId !== undefined) input.assigneeId = updates.assigneeId;
  if (updates.personId !== undefined) input.personId = updates.personId;
  if (updates.companyId !== undefined) input.companyId = updates.companyId;
  if (updates.opportunityId !== undefined)
    input.opportunityId = updates.opportunityId;

  return input;
}

/**
 * Build filter for list query
 */
function buildListFilter(
  params: ListActivitiesParams
): Record<string, unknown> | null {
  const {
    searchTerm,
    type,
    personId,
    companyId,
    opportunityId,
    assigneeId,
  } = params;
  const filter: Record<string, unknown> = {};

  if (searchTerm) filter.title = { ilike: `%${searchTerm}%` };
  if (type) filter.type = { eq: type };
  if (personId) filter.personId = { eq: personId };
  if (companyId) filter.companyId = { eq: companyId };
  if (opportunityId) filter.opportunityId = { eq: opportunityId };
  if (assigneeId) filter.assigneeId = { eq: assigneeId };

  return Object.keys(filter).length > 0 ? filter : null;
}

// Create CRUD handlers using base handler
const handlers = createCRUDHandlers<
  CreateActivityInput,
  UpdateActivityInput,
  Activity,
  ActivityGraphQLInput,
  ListActivitiesParams
>({
  entityName: "activity",
  entityNameCapitalized: "Activity",
  pluralEntityName: "activities",
  queries: {
    create: CREATE_ACTIVITY_MUTATION,
    get: GET_ACTIVITY_QUERY,
    list: LIST_ACTIVITIES_QUERY,
    update: UPDATE_ACTIVITY_MUTATION,
  },
  transformCreateInput,
  transformUpdateInput,
  buildListFilter,
  formatCreateSuccess: (activity) =>
    `✅ Created activity: ${activity.title} (${activity.type})`,
});

// Export handlers
export const createActivity = handlers.create;
export const getActivity = handlers.get;
export const listActivities = handlers.list;
export const updateActivity = handlers.update;
