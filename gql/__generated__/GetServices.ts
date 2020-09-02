/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetServices
// ====================================================

export interface GetServices_getServices {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetServices {
  getServices: GetServices_getServices[];
}
