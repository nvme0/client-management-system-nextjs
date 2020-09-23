import { useMemo } from "react";
import { TableOptions } from "react-table";
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
  Textarea,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from "@chakra-ui/core";

import { Button } from "components/Button";
import { BasicTable } from "components/Table";
import {
  GetClients_getClients as Client,
  GetClients_getClients_programs as ProgramToClient,
  GetClients_getClients_paymentPlans as PaymentPlan
} from "gql/__generated__/GetClients";
import { GetPrograms_getPrograms as Program } from "gql/__generated__/GetPrograms";
import ProgramAddItem from "../ProgramModal/components/ProgramAddItem";

export const schema = yup.object().shape({
  firstName: yup.string().min(1).max(255).required(),
  lastName: yup.string().min(0).max(255),
  email: yup.string().min(0).max(255).email(),
  phone: yup.string().min(0).max(255),
  notes: yup.string().max(255),
  programs: yup.array(),
  paymentPlans: yup.array()
});

export interface FormInputState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  programs: ProgramToClient[];
  paymentPlans: PaymentPlan[];
}

export interface ClientModalProps {
  client: Client;
  programs: Program[];
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
  programs,
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
      email: client.email || "",
      phone: client.phone || "",
      notes: client.notes || "",
      programs: client.programs || [],
      paymentPlans: client.paymentPlans || []
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

  const addProgram = (program: ProgramToClient) => {
    formik.setValues({
      ...formik.values,
      programs: [...formik.values.programs, program]
    });
  };

  const removeProgram = (program: ProgramToClient) => {
    formik.setValues({
      ...formik.values,
      programs: formik.values.programs.filter(({ id }) => id !== program.id)
    });
  };

  const programsData = useMemo<TableOptions<ProgramToClient>["data"]>(
    () => formik.values.programs || [],
    [formik.values.programs]
  );

  const programsColumns = useMemo<TableOptions<Program>["columns"]>(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        id: "actionButtonColumn",
        Cell: ({ row }) => (
          <Box {...{ justifyContent: "right", display: "flex" }}>
            <Button
              {...{
                "aria-label": "Delete",
                size: "sm",
                templateStyle: "danger-outline",
                onClick: () => removeProgram(row.original)
              }}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ],
    [formik.values.programs]
  );

  const initialState = {
    sortBy: [
      {
        id: "name",
        desc: false
      }
    ]
  };

  return (
    <Modal
      {...{
        ...modalProps,
        size: "3xl"
      }}
    >
      <form
        {...{
          noValidate: true,
          onSubmit: formik.handleSubmit
        }}
      >
        <ModalOverlay {...{ zIndex: 5 }}>
          <ModalContent>
            <ModalHeader>{modalTitle}</ModalHeader>
            <ModalCloseButton
              {...{
                "data-testid": `close-${client.id}`
              }}
            />
            <ModalBody>
              <Tabs>
                <TabList>
                  <Tab>Info</Tab>
                  <Tab>Programs</Tab>
                  <Tab>Notes</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel {...{ px: 0 }}>
                    <Stack {...{ spacing: 4 }}>
                      <FormControl
                        {...{
                          isRequired: true,
                          isInvalid:
                            formik.touched.firstName &&
                            !!formik.errors.firstName
                        }}
                      >
                        <FormLabel>First Name</FormLabel>
                        <Input
                          {...{
                            "aria-label": "First Name",
                            placeholder: "First name",
                            ...formik.getFieldProps("firstName")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.firstName}
                        </FormErrorMessage>
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
                            "aria-label": "Last name",
                            placeholder: "Last name",
                            ...formik.getFieldProps("lastName")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.lastName}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        {...{
                          isInvalid:
                            formik.touched.email && !!formik.errors.email
                        }}
                      >
                        <FormLabel>Contact Email</FormLabel>
                        <Input
                          {...{
                            "aria-label": "Email",
                            placeholder: "Email",
                            ...formik.getFieldProps("email")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.email}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        {...{
                          isInvalid:
                            formik.touched.phone && !!formik.errors.phone
                        }}
                      >
                        <FormLabel>Contact Number</FormLabel>
                        <Input
                          {...{
                            "aria-label": "Contact Phone Number",
                            placeholder: "Phone number",
                            ...formik.getFieldProps("phone")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.phone}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        {...{
                          isInvalid:
                            formik.touched.address && !!formik.errors.address
                        }}
                      >
                        <FormLabel>Address</FormLabel>
                        <Input
                          {...{
                            "aria-label": "Address",
                            placeholder: "Address",
                            ...formik.getFieldProps("address")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.address}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                  <TabPanel {...{ px: 0 }}>
                    <Stack {...{ spacing: 4 }}>
                      <FormControl
                        {...{
                          isRequired: false,
                          isInvalid:
                            formik.touched.programs && !!formik.errors.programs
                        }}
                      >
                        <Stack>
                          <BasicTable
                            {...{
                              data: programsData,
                              columns: programsColumns,
                              initialState,
                              sortable: true
                            }}
                          />
                          <ProgramAddItem
                            {...{
                              addItem: (program: Program) => {
                                addProgram({
                                  ...program,
                                  services:
                                    program.services?.map((service) => ({
                                      ...service,
                                      booked: 0,
                                      used: 0
                                    })) || [],
                                  createdAt: new Date().toISOString(),
                                  updatedAt: new Date().toISOString()
                                });
                              },
                              items: programs.filter(
                                ({ id }) =>
                                  !formik.values.programs?.find(
                                    (program) => id === program.id
                                  )
                              )
                            }}
                          />
                          <FormErrorMessage>
                            {formik.errors.programs}
                          </FormErrorMessage>
                        </Stack>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                  <TabPanel {...{ px: 0 }}>
                    <Stack {...{ spacing: 4 }}>
                      <FormControl
                        {...{
                          isInvalid:
                            formik.touched.notes && !!formik.errors.notes
                        }}
                      >
                        <FormLabel>Notes</FormLabel>
                        <Textarea
                          {...{
                            rows: 4,
                            ...formik.getFieldProps("notes")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.notes}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter {...{ justifyContent: "space-between" }}>
              <div>
                {handleDelete && (
                  <Button
                    {...{
                      "aria-label": "Delete",
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
                    "aria-label": successButtonText,
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
