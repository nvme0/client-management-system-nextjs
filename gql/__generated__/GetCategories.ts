/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCategories
// ====================================================

export interface GetCategories_getCategories {
  id: string;
  name: string;
  for: string | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetCategories {
  getCategories: GetCategories_getCategories[];
}
