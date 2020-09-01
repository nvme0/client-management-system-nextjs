import { gql } from "graphql-request";

export const GQL_GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      for
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_UPSERT_CATEGORY = gql`
  mutation UpsertCategory($categoryInput: CategoryInput!) {
    upsertCategory(categoryInput: $categoryInput) {
      id
      name
      for
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GQL_DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!, $deletedAt: DateTime!) {
    deleteCategory(id: $id, deletedAt: $deletedAt)
  }
`;
