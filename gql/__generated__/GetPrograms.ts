/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPrograms
// ====================================================

export interface GetPrograms_getPrograms_categories {
  id: string;
  name: string;
  for: string | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetPrograms_getPrograms {
  id: string;
  name: string;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
  categories: GetPrograms_getPrograms_categories[] | null;
}

export interface GetPrograms {
  getPrograms: GetPrograms_getPrograms[];
}
