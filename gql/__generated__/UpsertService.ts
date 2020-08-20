/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertService
// ====================================================

export interface UpsertService_upsertService {
  __typename: "Service";
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertService {
  upsertService: UpsertService_upsertService | null;
}

export interface UpsertServiceVariables {
  serviceInput: ServiceInput;
}
