/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register_errors {
  __typename: "YupError";
  path: string;
  message: string;
}

export interface Register_register {
  __typename: "MutationResponse";
  status: number;
  errors: (Register_register_errors | null)[];
  payload: string | null;
}

export interface Register {
  register: Register_register;
}

export interface RegisterVariables {
  email: string;
  password: string;
}
