/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ClientInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertClient
// ====================================================

export interface UpsertClient_upsertClient_programs_program_services_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertClient_upsertClient_programs_program_services {
  quantity: number;
  service: UpsertClient_upsertClient_programs_program_services_service;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertClient_upsertClient_programs_program {
  id: string;
  name: string;
  notes: string | null;
  services: UpsertClient_upsertClient_programs_program_services[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertClient_upsertClient_programs {
  program: UpsertClient_upsertClient_programs_program;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertClient_upsertClient {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  programs: UpsertClient_upsertClient_programs[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertClient {
  upsertClient: UpsertClient_upsertClient | null;
}

export interface UpsertClientVariables {
  clientInput: ClientInput;
}
