/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCalendarEvents
// ====================================================

export interface GetCalendarEvents_getCalendarEvents_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetCalendarEvents_getCalendarEvents_client_programs_services_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetCalendarEvents_getCalendarEvents_client_programs_services {
  quantity: number;
  service: GetCalendarEvents_getCalendarEvents_client_programs_services_service;
  booked: number;
  used: number;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetCalendarEvents_getCalendarEvents_client_programs {
  id: string;
  name: string;
  notes: string | null;
  services: GetCalendarEvents_getCalendarEvents_client_programs_services[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetCalendarEvents_getCalendarEvents_client {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  programs: GetCalendarEvents_getCalendarEvents_client_programs[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface GetCalendarEvents_getCalendarEvents {
  id: string;
  title: string;
  start: GqlDateTime;
  end: GqlDateTime;
  allDay: boolean;
  notes: string | null;
  resource: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
  service: GetCalendarEvents_getCalendarEvents_service | null;
  client: GetCalendarEvents_getCalendarEvents_client | null;
}

export interface GetCalendarEvents {
  getCalendarEvents: GetCalendarEvents_getCalendarEvents[];
}
