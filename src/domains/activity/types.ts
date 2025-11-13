/**
 * Activity domain type definitions
 */

import { Activity } from "../../shared/types.js";

// ======================
// INPUT TYPES
// ======================

export interface CreateActivityInput {
  title: string;
  body?: string;
  type: string;
  occurredAt?: string;
  assigneeId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
}

export interface UpdateActivityInput {
  id: string;
  title?: string;
  body?: string;
  type?: string;
  occurredAt?: string;
  assigneeId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
}

export interface ListActivitiesParams {
  limit?: number;
  searchTerm?: string;
  type?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  assigneeId?: string;
}

// ======================
// GRAPHQL INPUT TYPES
// ======================

export interface ActivityGraphQLInput {
  title: string;
  body?: string;
  type: string;
  occurredAt?: string;
  assigneeId?: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface ActivitiesEdge {
  node: Activity;
}

export interface ActivitiesConnection {
  edges: ActivitiesEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Re-export shared type
export type { Activity };
