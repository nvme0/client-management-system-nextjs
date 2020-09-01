import { gql } from "graphql-request";

export const GQL_GET_PROGRAMS = gql`
  query GetPrograms {
    getPrograms {
      id
      name
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_UPSERT_PROGRAM = gql`
  mutation UpsertProgram($programInput: ProgramInput!) {
    upsertProgram(programInput: $programInput) {
      id
      name
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_DELETE_PROGRAM = gql`
  mutation DeleteProgram($id: String!, $deletedAt: DateTime!) {
    deleteProgram(id: $id, deletedAt: $deletedAt)
  }
`;
