/**
 * Shared type definitions used across all domains
 */

// ======================
// COMPOSITE TYPES
// ======================

export interface NameComposite {
  firstName: string;
  lastName: string;
}

export interface EmailsComposite {
  primaryEmail: string;
  additionalEmails?: string[];
}

export interface PhonesComposite {
  primaryPhoneNumber: string;
  primaryPhoneCountryCode?: string;
  primaryPhoneCallingCode?: string;
  additionalPhones?: unknown[];
}

export interface LinkComposite {
  primaryLinkLabel?: string;
  primaryLinkUrl: string;
  secondaryLinks?: unknown[];
}

export interface AddressComposite {
  addressStreet1?: string;
  addressStreet2?: string;
  addressCity?: string;
  addressPostcode?: string;
  addressState?: string;
  addressCountry?: string;
}

export interface CurrencyComposite {
  amountMicros: number;
  currencyCode: string;
}

export interface BodyV2Composite {
  blocknote: string;
  markdown: string;
}

// ======================
// GRAPHQL RESPONSE TYPES
// ======================

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

// Generic pagination types
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Edge<T> {
  node: T;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

// ======================
// RELATIONSHIP TYPES (v0.5.0)
// ======================

// Task Target - Links tasks to other entities
export interface TaskTarget {
  id: string;
  taskId: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Note Target - Links notes to other entities
export interface NoteTarget {
  id: string;
  noteId: string;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Activity - Timeline events and interactions
export interface Activity {
  id: string;
  title: string;
  body?: string;
  type: string;
  occurredAt?: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: NameComposite;
  };
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Favorite - Quick access to frequently used records
export interface Favorite {
  id: string;
  position: number;
  personId?: string;
  companyId?: string;
  opportunityId?: string;
  workspaceMemberId?: string;
  createdAt: string;
  updatedAt?: string;
}
