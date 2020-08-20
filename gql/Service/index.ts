import { gql } from "graphql-request";

export const GQL_GET_SERVICES = gql`
  query GetServices {
    getServices {
      id
      name
      duration
      expires
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_UPSERT_SERVICE = gql`
  mutation UpsertService($serviceInput: ServiceInput!) {
    upsertService(serviceInput: $serviceInput) {
      id
      name
      duration
      expires
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_DELETE_SERVICE = gql`
  mutation DeleteService($id: String!, $deletedAt: DateTime!) {
    deleteService(id: $id, deletedAt: $deletedAt)
  }
`;
