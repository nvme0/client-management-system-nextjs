import { gql } from "graphql-request";

export const GQL_ME = gql`
  query Me {
    me {
      id
      email
      confirmed
      createdAt
      updatedAt
    }
  }
`;
