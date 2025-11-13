/**
 * GraphQL queries and mutations for Activity operations
 */

export const CREATE_ACTIVITY_MUTATION = `
  mutation CreateActivity($input: ActivityCreateInput!) {
    createActivity(data: $input) {
      id
      title
      body
      type
      occurredAt
      assigneeId
      assignee {
        id
        name {
          firstName
          lastName
        }
      }
      personId
      companyId
      opportunityId
      createdAt
    }
  }
`;

export const GET_ACTIVITY_QUERY = `
  query GetActivity($id: UUID!) {
    activity(filter: { id: { eq: $id } }) {
      id
      title
      body
      type
      occurredAt
      assigneeId
      assignee {
        id
        name {
          firstName
          lastName
        }
      }
      personId
      companyId
      opportunityId
      createdAt
      updatedAt
    }
  }
`;

export const LIST_ACTIVITIES_QUERY = `
  query ListActivities($filter: ActivityFilterInput, $limit: Int) {
    activities(filter: $filter, first: $limit) {
      edges {
        node {
          id
          title
          body
          type
          occurredAt
          assigneeId
          assignee {
            id
            name {
              firstName
              lastName
            }
          }
          personId
          companyId
          opportunityId
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const UPDATE_ACTIVITY_MUTATION = `
  mutation UpdateActivity($id: UUID!, $input: ActivityUpdateInput!) {
    updateActivity(id: $id, data: $input) {
      id
      title
      body
      type
      occurredAt
      assigneeId
      personId
      companyId
      opportunityId
      updatedAt
    }
  }
`;
