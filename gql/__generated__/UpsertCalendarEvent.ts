/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CalendarEventInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertCalendarEvent
// ====================================================

export interface UpsertCalendarEvent_upsertCalendarEvent_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertCalendarEvent_upsertCalendarEvent_client_paymentPlans_installments {
  amount: string;
  currency: string;
  date: GqlDateTime;
  notes: string | null;
}

export interface UpsertCalendarEvent_upsertCalendarEvent_client_paymentPlans {
  id: string;
  title: string;
  paymentNumber: number;
  installments: UpsertCalendarEvent_upsertCalendarEvent_client_paymentPlans_installments[] | null;
  notes: string | null;
}

export interface UpsertCalendarEvent_upsertCalendarEvent_client_programs_services_service {
  id: string;
  name: string;
  duration: string | null;
  expires: GqlDateTime | null;
  notes: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertCalendarEvent_upsertCalendarEvent_client_programs_services {
  quantity: number;
  service: UpsertCalendarEvent_upsertCalendarEvent_client_programs_services_service;
  booked: number;
  used: number;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertCalendarEvent_upsertCalendarEvent_client_programs {
  id: string;
  name: string;
  notes: string | null;
  services: UpsertCalendarEvent_upsertCalendarEvent_client_programs_services[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertCalendarEvent_upsertCalendarEvent_client {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  paymentPlans: UpsertCalendarEvent_upsertCalendarEvent_client_paymentPlans[] | null;
  programs: UpsertCalendarEvent_upsertCalendarEvent_client_programs[] | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
}

export interface UpsertCalendarEvent_upsertCalendarEvent {
  id: string;
  title: string;
  start: GqlDateTime;
  end: GqlDateTime;
  allDay: boolean;
  notes: string | null;
  resource: string | null;
  createdAt: GqlDateTime;
  updatedAt: GqlDateTime;
  service: UpsertCalendarEvent_upsertCalendarEvent_service | null;
  client: UpsertCalendarEvent_upsertCalendarEvent_client | null;
}

export interface UpsertCalendarEvent {
  upsertCalendarEvent: UpsertCalendarEvent_upsertCalendarEvent | null;
}

export interface UpsertCalendarEventVariables {
  calendarEventInput: CalendarEventInput;
}
