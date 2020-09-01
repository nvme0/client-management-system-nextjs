/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProgramInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertProgram
// ====================================================

export interface UpsertProgram_upsertProgram {
  __typename: "Program";
  id: string;
  name: string;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertProgram {
  upsertProgram: UpsertProgram_upsertProgram | null;
}

export interface UpsertProgramVariables {
  programInput: ProgramInput;
}
