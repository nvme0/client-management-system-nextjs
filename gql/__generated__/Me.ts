/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me {
  __typename: "User";
  id: string;
  email: string;
  confirmed: boolean;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface Me {
  me: Me_me;
}
