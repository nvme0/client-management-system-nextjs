/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetClients
// ====================================================

export interface GetClients_getClients_programs_program_categories {
  id: string;
  name: string;
  for: string | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients_programs_program_services_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients_programs_program_services {
  quantity: number;
  service: GetClients_getClients_programs_program_services_service;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients_programs_program {
  id: string;
  name: string;
  notes: string | null;
  categories: GetClients_getClients_programs_program_categories[] | null;
  services: GetClients_getClients_programs_program_services[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients_programs {
  program: GetClients_getClients_programs_program;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  programs: GetClients_getClients_programs[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients {
  getClients: GetClients_getClients[];
}
