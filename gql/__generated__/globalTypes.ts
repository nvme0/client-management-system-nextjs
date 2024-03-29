/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CalendarEventInput {
  allDay: boolean;
  client?: ClientInput | null;
  createdAt: GqlDateTime;
  end: GqlDateTime;
  id: string;
  notes?: string | null;
  resource?: string | null;
  service?: ServiceInput | null;
  start: GqlDateTime;
  title: string;
  updatedAt: GqlDateTime;
}

export interface ClientInput {
  address?: string | null;
  createdAt: GqlDateTime;
  email?: string | null;
  firstName: string;
  id: string;
  lastName?: string | null;
  notes?: string | null;
  paymentPlans?: PaymentPlanInput[] | null;
  phone?: string | null;
  programs?: ProgramToClientInput[] | null;
  updatedAt: GqlDateTime;
}

export interface InstallmentInput {
  amount: string;
  currency: string;
  date: GqlDateTime;
  notes?: string | null;
}

export interface PaymentPlanInput {
  id: string;
  installments?: InstallmentInput[] | null;
  notes?: string | null;
  paymentNumber: number;
  title: string;
}

export interface ProgramInput {
  createdAt: GqlDateTime;
  id: string;
  name: string;
  notes?: string | null;
  services?: ServiceToProgramInput[] | null;
  updatedAt: GqlDateTime;
}

export interface ProgramToClientInput {
  createdAt: GqlDateTime;
  id: string;
  name: string;
  notes?: string | null;
  services?: ServiceToProgramToClientInput[] | null;
  updatedAt: GqlDateTime;
}

export interface ServiceInput {
  createdAt: GqlDateTime;
  duration?: string | null;
  expires?: GqlDateTime | null;
  id: string;
  name: string;
  notes?: string | null;
  updatedAt: GqlDateTime;
}

export interface ServiceToProgramInput {
  createdAt: GqlDateTime;
  quantity: number;
  service: ServiceInput;
  updatedAt: GqlDateTime;
}

export interface ServiceToProgramToClientInput {
  booked: number;
  createdAt: GqlDateTime;
  quantity: number;
  service: ServiceInput;
  updatedAt: GqlDateTime;
  used: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
