/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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
  contactEmail?: string | null;
  contactNumber?: string | null;
  createdAt: GqlDateTime;
  firstName: string;
  id: string;
  lastName?: string | null;
  notes?: string | null;
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
