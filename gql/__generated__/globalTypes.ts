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

export interface CategoryInput {
  createdAt: GqlDateTime;
  for?: string | null;
  id: string;
  name: string;
  notes?: string | null;
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
  phone?: string | null;
  updatedAt: GqlDateTime;
}

export interface ProgramInput {
  categories?: CategoryInput[] | null;
  createdAt: GqlDateTime;
  id: string;
  name: string;
  notes?: string | null;
  services?: ServiceToProgramInput[] | null;
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

//==============================================================
// END Enums and Input Objects
//==============================================================
