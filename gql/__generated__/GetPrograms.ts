/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPrograms
// ====================================================

export interface GetPrograms_getPrograms {
  __typename: "Program";
  id: string;
  name: string;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetPrograms {
  getPrograms: GetPrograms_getPrograms[];
}
