import { gql } from "graphql-request";

export const GQL_GET_CLIENTS = gql`
  query GetClients {
    getClients {
      id
      firstName
      lastName
      contactEmail
      contactNumber
      address
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_UPSERT_CLIENT = gql`
  mutation UpsertClient($clientInput: ClientInput!) {
    upsertClient(clientInput: $clientInput) {
      id
      firstName
      lastName
      contactEmail
      contactNumber
      address
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_DELETE_CLIENT = gql`
  mutation DeleteClient($id: String!, $deletedAt: DateTime!) {
    deleteClient(id: $id, deletedAt: $deletedAt)
  }
`;