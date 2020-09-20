/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetClients
// ====================================================

export interface GetClients_getClients_installments {
  amount: string;
  currency: string;
  date: GqlDateTime;
  notes: string | null;
}

export interface GetClients_getClients_programs_services_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients_programs_services {
  quantity: number;
  service: GetClients_getClients_programs_services_service;
  booked: number;
  used: number;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients_getClients_programs {
  id: string;
  name: string;
  notes: string | null;
  services: GetClients_getClients_programs_services[] | null;
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
  installments: GetClients_getClients_installments[] | null;
  programs: GetClients_getClients_programs[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetClients {
  getClients: GetClients_getClients[];
}
