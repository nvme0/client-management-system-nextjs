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
  ModalCloseButton,
  ModalProps,
  // Form
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Textarea
} from "@chakra-ui/core";
import { GetClients_getClients as Client } from "gql/__generated__/GetClients";
import { Button } from "components/Button";

const schema = yup.object().shape({
  firstName: yup.string().min(1).max(255).required(),
  lastName: yup.string().min(0).max(255),
  contactEmail: yup.string().min(0).max(255).email(),
  contactNumber: yup.string().min(0).max(255),
  notes: yup.string().max(255)
});

export interface FormInputState {
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
  notes: string;
}

export interface ClientModalProps {
  client: Client;
  modalProps: ModalProps;
  handleSave: (client: Client) => void;
  handleDelete?: () => void;
}

export interface Props extends ClientModalProps {
  clientModalProps: {
    modalTitle: string;
    successButtonText: string;
  };
}

const ClientModal = ({
  client,
  modalProps,
  handleSave,
  handleDelete,
  clientModalProps: { modalTitle, successButtonText }
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      firstName: client.firstName,
      lastName: client.lastName || "",
      address: client.address || "",
      contactEmail: client.contactEmail || "",
      contactNumber: client.contactNumber || "",
      notes: client.notes || ""
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      modalProps.onClose();
      handleSave({
        ...client,
        ...values
      });
    }
  });

  return (
    <Modal
      {...{
        ...modalProps,
        scrollBehavior: "inside",
        isCentered: true,
        size: "3xl"
      }}
    >
      <form
        {...{
          noValidate: true,
          onSubmit: formik.handleSubmit
        }}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>{modalTitle}</ModalHeader>
            <ModalCloseButton
              {...{
                "data-testid": `close-${client.id}`
              }}
            />
            <ModalBody>
              <Stack {...{ spacing: 4 }}>
                <FormControl
                  {...{
                    isRequired: true,
                    isInvalid:
                      formik.touched.firstName && !!formik.errors.firstName
                  }}
                >
                  <FormLabel>First Name</FormLabel>
                  <Input
                    {...{
                      placeholder: "First name",
                      ...formik.getFieldProps("firstName")
                    }}
                  />
                  <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isInvalid:
                      formik.touched.lastName && !!formik.errors.lastName
                  }}
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    {...{
                      placeholder: "Last name",
                      ...formik.getFieldProps("lastName")
                    }}
                  />
                  <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isInvalid:
                      formik.touched.contactEmail &&
                      !!formik.errors.contactEmail
                  }}
                >
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    {...{
                      placeholder: "Email",
                      ...formik.getFieldProps("contactEmail")
                    }}
                  />
                  <FormErrorMessage>
                    {formik.errors.contactEmail}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isInvalid:
                      formik.touched.contactNumber &&
                      !!formik.errors.contactNumber
                  }}
                >
                  <FormLabel>Contact Number</FormLabel>
                  <Input
                    {...{
                      placeholder: "Phone number",
                      ...formik.getFieldProps("contactNumber")
                    }}
                  />
                  <FormErrorMessage>
                    {formik.errors.contactNumber}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isInvalid: formik.touched.address && !!formik.errors.address
                  }}
                >
                  <FormLabel>Address</FormLabel>
                  <Input
                    {...{
                      placeholder: "Address",
                      ...formik.getFieldProps("address")
                    }}
                  />
                  <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isInvalid: formik.touched.notes && !!formik.errors.notes
                  }}
                >
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    {...{
                      rows: 4,
                      ...formik.getFieldProps("notes")
                    }}
                  />
                  <FormErrorMessage>{formik.errors.notes}</FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter {...{ justifyContent: "space-between" }}>
              <div>
                {handleDelete && (
                  <Button
                    {...{
                      "data-testid": `delete-${client.id}`,
                      templateStyle: "danger-outline",
                      onClick: () => {
                        modalProps.onClose();
                        handleDelete();
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <Stack {...{ isInline: true, spacing: 1 }}>
                <Button
                  {...{
                    "data-testid": `submit-${client.id}`,
                    templateStyle: "primary",
                    type: "submit"
                  }}
                >
                  {successButtonText}
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </form>
    </Modal>
  );
};

export default ClientModal;
