import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  // Modal
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  // Form
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Spinner
} from "@chakra-ui/core";
import { useMutation } from "react-query";
import request from "graphql-request";

import { Button } from "components/Button";
import LoginErrors from "components/login/LoginErrors";
import { GQL_LOGIN } from "gql/Auth";
import {
  Login as TLogin,
  LoginVariables,
  Login_login_errors
} from "gql/__generated__/Login";
import { setAccessToken } from "lib/accessToken";
import { useLoggedInState } from "lib/loggedInState";

const schema = yup.object().shape({
  email: yup.string().min(3).max(255).email().required(),
  password: yup.string().min(7).max(255).required()
});

export interface FormInputState {
  email: string;
  password: string;
}

export interface Props {
  modalProps: ModalProps;
}

const LoginModal = ({ modalProps }: Props) => {
  const [loginErrors, setLoginErrors] = useState<{
    type: "none" | "auth" | "network";
  }>({
    type: "none"
  });
  const { setIsLoggedIn } = useLoggedInState();
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
          formikHelpers.resetForm();
          setAccessToken(payload);
          setIsLoggedIn(true);
        },
        onError: () => {
          setLoginErrors({ type: "network" });
        },
        onSettled: () => {
          formikHelpers.setSubmitting(false);
        }
      });
    }
  });

  return (
    <Modal
      {...{
        ...modalProps,
        scrollBehavior: "inside",
        isCentered: true,
        size: "lg"
      }}
    >
      <form
        {...{
          noValidate: true,
          onSubmit: formik.handleSubmit
        }}
      >
        <ModalOverlay {...{ zIndex: 6 }}>
          <ModalContent>
            <ModalHeader>Please login to continue</ModalHeader>
            <ModalBody>
              <Stack {...{ spacing: 4 }}>
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
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <LoginErrors {...loginErrors} />
              </Stack>
            </ModalBody>
            <ModalFooter {...{ justifyContent: "space-between" }}>
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
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </form>
    </Modal>
  );
};

export default LoginModal;
