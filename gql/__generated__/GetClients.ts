/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetClients
// ====================================================

export interface GetClients_getClients {
  __typename: "Client";
  id: string;
  firstName: string;
  lastName: string | null;
  contactEmail: string | null;
  contactNumber: string | null;
  address: string | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients {
  getClients: GetClients_getClients[];
}
