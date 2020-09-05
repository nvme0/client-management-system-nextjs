/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ClientInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertClient
// ====================================================

export interface UpsertClient_upsertClient {
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

export interface UpsertClient {
  upsertClient: UpsertClient_upsertClient | null;
}

export interface UpsertClientVariables {
  clientInput: ClientInput;
}
