/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertCategory
// ====================================================

export interface UpsertCategory_upsertCategory {
  __typename: "Category";
  id: string;
  name: string;
  for: string | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertCategory {
  upsertCategory: UpsertCategory_upsertCategory | null;
}

export interface UpsertCategoryVariables {
  categoryInput: CategoryInput;
}
