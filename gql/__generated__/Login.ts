/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_errors {
  path: string;
  message: string;
}

export interface Login_login {
  status: number;
  errors: (Login_login_errors | null)[];
  payload: string | null;
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  email: string;
  password: string;
}
