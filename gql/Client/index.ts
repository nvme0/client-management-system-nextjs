import { gql } from "graphql-request";

export const GQL_GET_CLIENTS = gql`
  query GetClients {
    getClients {
      id
      firstName
      lastName
      email
      phone
      address
      notes
      installments {
        amount
        currency
        date
        notes
      }
      programs {
        id
        name
        notes
        services {
          quantity
          service {
            id
            name
            duration
            expires
            notes
            createdAt
            updatedAt
          }
          booked
          used
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
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
      email
      phone
      address
      notes
      installments {
        amount
        currency
        date
        notes
      }
      programs {
        id
        name
        notes
        services {
          quantity
          service {
            id
            name
            duration
            expires
            notes
            createdAt
            updatedAt
          }
          booked
          used
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
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
