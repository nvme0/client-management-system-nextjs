import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import {
  Stack,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage
} from "@chakra-ui/core";

import AuthLayout from "layouts/AuthLayout";
import { Button } from "components/Button";
import Container from "components/login/Container";
import Header from "components/login/Header";
import LoginErrors from "components/login/LoginErrors";
import FormBody from "components/login/FormBody";

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
  const [loginErrors, setLoginErrors] = useState<{
    type: "none" | "auth" | "network";
  }>({
    type: "none"
  });

  const formik = useFormik<FormInputState>({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      console.log({ values });
    }
  });

  return (
    <Container>
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
                  isInvalid: formik.touched.password && !!formik.errors.password
                }}
              >
                <FormLabel>Password</FormLabel>
                <Input
                  {...{
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
                  type: "submit"
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </FormBody>
        </form>
      </Box>
    </Container>
  );
};

Register.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Register;
