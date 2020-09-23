import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  Stack,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Spinner
} from "@chakra-ui/core";
import { useMutation } from "react-query";
import request from "graphql-request";

import AuthLayout from "layouts/AuthLayout";
import { Button } from "components/Button";
import Container from "components/login/Container";
import Header from "components/login/Header";
import LoginErrors, {
  Props as TLoginErrors
} from "components/login/LoginErrors";
import FormBody from "components/login/FormBody";
import { GQL_REGISTER, GQL_LOGIN } from "gql/Auth";
import {
  Register as TRegister,
  RegisterVariables,
  Register_register_errors
} from "gql/__generated__/Register";
import {
  Login as TLogin,
  LoginVariables,
  Login_login_errors
} from "gql/__generated__/Login";
import { setAccessToken } from "lib/accessToken";
import { useLoggedInState } from "lib/loggedInState";
import OfflineFallbackWrapper from "components/OfflineFallbackWrapper";

const schema = yup.object().shape({
  email: yup.string().min(3).max(255).email().required(),
  password: yup.string().min(7).max(255).required()
});

export interface Props {
  url: string;
}

export interface FormInputState {
  email: string;
  password: string;
}

const Register = () => {
  const router = useRouter();
  const [loginErrors, setLoginErrors] = useState<TLoginErrors>({
    type: "none"
  });

  const { setIsLoggedIn } = useLoggedInState();

  const [register] = useMutation<
    TRegister,
    Register_register_errors,
    RegisterVariables,
    () => void
  >((variables) =>
    request(process.env.NEXT_PUBLIC_GRAPHQL_URL!, GQL_REGISTER, variables)
  );

  const [login] = useMutation<
    TLogin,
    Login_login_errors,
    LoginVariables,
    () => void
  >((variables) =>
    request(process.env.NEXT_PUBLIC_GRAPHQL_URL!, GQL_LOGIN, variables)
  );

  const formik = useFormik<FormInputState>({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values, formikHelpers) => {
      register(values, {
        onSuccess: ({ register: { payload, errors } }) => {
          if (errors.length > 0 || !payload) {
            setLoginErrors({
              type: "custom",
              customMessage: `${errors[0]?.path} ${errors[0]?.message}`
            });
            formikHelpers.setSubmitting(false);
            return;
          }
          login(values, {
            onSuccess: ({ login: { payload, errors } }) => {
              if (errors.length > 0 || !payload) {
                router.push("/login");
                return;
              }
              setAccessToken(payload);
              setIsLoggedIn(true);
            }
          });
        },
        onError: () => {
          setLoginErrors({ type: "network" });
          formikHelpers.setSubmitting(false);
        }
      });
    }
  });

  return (
    <OfflineFallbackWrapper>
      <Container>
        <Head>
          <title>Register - Client Management System</title>
        </Head>
        <Header>Create a Free Account</Header>
        <Box>
          <Box
            {...{
              display: "flex",
              justifyContent: "center",
              p: 4
            }}
          >
            <p className="prose">
              Already have an account?{" "}
              <Link
                {...{
                  href: `/login`
                }}
              >
                <a className="prose">Sign In</a>
              </Link>
            </p>
          </Box>
          <form
            {...{
              noValidate: true,
              onSubmit: formik.handleSubmit
            }}
          >
            <FormBody>
              <Stack {...{ spacing: 4 }}>
                <FormControl
                  {...{
                    isRequired: true,
                    isInvalid: formik.touched.email && !!formik.errors.email
                  }}
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...{
                      "aria-label": "Email",
                      placeholder: "Email",
                      ...formik.getFieldProps("email"),
                      onInput: () => {
                        if (loginErrors.type === "auth") {
                          setLoginErrors({ type: "none" });
                        }
                      }
                    }}
                  />
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>
              </Stack>
              <Stack {...{ spacing: 4 }}>
                <FormControl
                  {...{
                    isRequired: true,
                    isInvalid:
                      formik.touched.password && !!formik.errors.password
                  }}
                >
                  <FormLabel>Password</FormLabel>
                  <Input
                    {...{
                      "aria-label": "Password",
                      type: "password",
                      placeholder: "Password",
                      ...formik.getFieldProps("password"),
                      onInput: () => {
                        if (loginErrors.type === "auth") {
                          setLoginErrors({ type: "none" });
                        }
                      }
                    }}
                  />
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
              </Stack>
              <LoginErrors {...loginErrors} />
              <Stack {...{ isInline: true, spacing: 1 }}>
                <Button
                  {...{
                    "aria-label": "Sign Up",
                    templateStyle: "login",
                    type: "submit",
                    disabled: formik.isSubmitting
                  }}
                >
                  {formik.isSubmitting ? (
                    <Spinner
                      {...{
                        thickness: "3px",
                        speed: "0.65s",
                        size: "md"
                      }}
                    />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Stack>
            </FormBody>
          </form>
        </Box>
      </Container>
    </OfflineFallbackWrapper>
  );
};

Register.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Register;
