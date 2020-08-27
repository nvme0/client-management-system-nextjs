import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
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
import LoginErrors from "components/login/LoginErrors";
import FormBody from "components/login/FormBody";
import { GQL_LOGIN } from "gql/Auth";
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

export interface FormInputState {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [loginErrors, setLoginErrors] = useState<{
    type: "none" | "auth" | "network";
  }>({
    type: "none"
  });

  const { isLoggedIn, setIsLoggedIn } = useLoggedInState();
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/app/services");
    }
  }, [isLoggedIn]);

  const [login] = useMutation<
    TLogin,
    LoginVariables,
    Login_login_errors,
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
      login(values, {
        onSuccess: ({ login: { payload, errors } }) => {
          if (errors.length > 0 || !payload) {
            setLoginErrors({ type: "auth" });
            formikHelpers.setFieldError("email", " ");
            formikHelpers.setFieldError("password", " ");
            return;
          }
          setAccessToken(payload);
          setIsLoggedIn(true);
        },
        onError: () => {
          setLoginErrors({ type: "network" });
        }
      });
    }
  });

  return (
    <OfflineFallbackWrapper>
      <Container>
        <Header>Welcome Back</Header>
        <Box>
          <Box
            {...{
              display: "flex",
              justifyContent: "center",
              p: 4
            }}
          >
            <p className="prose">
              Don't have an account?{" "}
              <Link
                {...{
                  href: `/register`
                }}
              >
                <a className="prose">Sign Up Free</a>
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
              <LoginErrors {...{ loginErrors }} />
              <Stack {...{ isInline: true, spacing: 1 }}>
                <Button
                  {...{
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
                    "Login"
                  )}
                </Button>
              </Stack>
              <p style={{ textAlign: "center" }}>
                <a className="prose" href="">
                  Forgot your password?
                </a>
              </p>
            </FormBody>
          </form>
        </Box>
      </Container>
    </OfflineFallbackWrapper>
  );
};

Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Login;
