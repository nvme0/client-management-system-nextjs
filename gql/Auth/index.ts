import { gql } from "graphql-request";

export const GQL_LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      errors {
        path
        message
      }
      payload
    }
  }
`;

export const GQL_LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const GQL_REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      status
      errors {
        path
        message
      }
      payload
    }
  }
`;
