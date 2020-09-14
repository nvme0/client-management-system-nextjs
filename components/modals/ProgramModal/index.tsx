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
  Box
} from "@chakra-ui/core";

import { Button } from "components/Button";
import { BasicTable } from "components/Table";
import {
  GetPrograms_getPrograms as Program,
  GetPrograms_getPrograms_services as ServiceToProgram
} from "gql/__generated__/GetPrograms";
import { GetCategories_getCategories as Category } from "gql/__generated__/GetCategories";
import { GetServices_getServices as Service } from "gql/__generated__/GetServices";
import ProgramAddItem from "./components/ProgramAddItem";
import ProgramAddItemWithQuantity from "./components/ProgramAddItemWithQuantity";

const schema = yup.object().shape({
  name: yup.string().min(3).max(255).required(),
  categories: yup.array(),
  services: yup.array(),
  notes: yup.string()
});

export interface FormInputState {
  name: string;
  categories: Category[];
  services: ServiceToProgram[];
  notes: string;
}

export interface ProgramModalProps {
  program: Program;
  categories: Category[];
  services: Service[];
  modalProps: ModalProps;
  handleSave: (program: Program) => void;
  handleDelete?: () => void;
}

export interface Props extends ProgramModalProps {
  programModalProps: {
    modalTitle: string;
    successButtonText: string;
  };
}

const ProgramModal = ({
  program,
  categories,
  services,
  modalProps,
  handleSave,
  handleDelete,
  programModalProps: { modalTitle, successButtonText }
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      name: program.name,
      categories: program.categories || [],
      services: program.services || [],
      notes: program.notes || ""
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      modalProps.onClose();
      handleSave({
        ...program,
        ...values
      });
    }
  });

  const addCategory = (category: Category) =>
    formik.setValues({
      ...formik.values,
      categories: [...formik.values.categories, category]
    });

  const addService = (service: ServiceToProgram) => {
    formik.setValues({
      ...formik.values,
      services: [...formik.values.services, service]
    });
  };

  const removeCategory = (category: Category) =>
    formik.setValues({
      ...formik.values,
      categories: formik.values.categories.filter(
        ({ id }) => id !== category.id
      )
    });

  const removeService = (service: Service) => {
    formik.setValues({
      ...formik.values,
      services: formik.values.services.filter(
        ({ service: { id } }) => id !== service.id
      )
    });
  };

  const categoriesData = useMemo<TableOptions<Category>["data"]>(
    () => formik.values.categories || [],
    [formik.values.categories]
  );

  const servicesData = useMemo<TableOptions<ServiceToProgram>["data"]>(
    () => formik.values.services || [],
    [formik.values.services]
  );

  const categoriesColumns = useMemo<TableOptions<Category>["columns"]>(
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
                size: "sm",
                templateStyle: "danger-outline",
                onClick: () => removeCategory(row.original)
              }}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ],
    [formik.values.categories, formik.values.services]
  );

  const servicesColumns = useMemo<
    TableOptions<Service & { quantity: Number }>["columns"]
  >(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Quantity",
        accessor: "quantity"
      },
      {
        id: "actionButtonColumn",
        Cell: ({ row }) => (
          <Box {...{ justifyContent: "right", display: "flex" }}>
            <Button
              {...{
                size: "sm",
                templateStyle: "danger-outline",
                onClick: () => removeService(row.original)
              }}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ],
    [formik.values.services, formik.values.categories]
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
                "data-testid": `close-${program.id}`
              }}
            />
            <ModalBody>
              <Stack {...{ spacing: 4 }}>
                <FormControl
                  {...{
                    isRequired: true,
                    isInvalid: formik.touched.name && !!formik.errors.name
                  }}
                >
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...{
                      placeholder: "Name",
                      ...formik.getFieldProps("name")
                    }}
                  />
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isRequired: false,
                    isInvalid:
                      formik.touched.services && !!formik.errors.services
                  }}
                >
                  <FormLabel>Services</FormLabel>
                  <Stack>
                    <BasicTable
                      {...{
                        data: servicesData.map(({ service, quantity }) => ({
                          ...service,
                          quantity
                        })),
                        columns: servicesColumns,
                        initialState,
                        sortable: true
                      }}
                    />
                    <ProgramAddItemWithQuantity
                      {...{
                        addItem: (service: Service, quantity: number) => {
                          addService({
                            service,
                            quantity,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          });
                        },
                        items: services.filter(
                          ({ id }) =>
                            !formik.values.services?.find(
                              ({ service }) => id === service.id
                            )
                        )
                      }}
                    />
                    <FormErrorMessage>
                      {formik.errors.services}
                    </FormErrorMessage>
                  </Stack>
                </FormControl>
                <FormControl
                  {...{
                    isRequired: false,
                    isInvalid:
                      formik.touched.categories && !!formik.errors.categories
                  }}
                >
                  <FormLabel>Categories</FormLabel>
                  <Stack>
                    <BasicTable
                      {...{
                        data: categoriesData,
                        columns: categoriesColumns,
                        initialState,
                        sortable: true
                      }}
                    />
                    <ProgramAddItem
                      {...{
                        addItem: addCategory,
                        items: categories.filter(
                          ({ id }) =>
                            !formik.values.categories?.find(
                              ({ id: _id }) => id === _id
                            )
                        )
                      }}
                    />
                    <FormErrorMessage>
                      {formik.errors.categories}
                    </FormErrorMessage>
                  </Stack>
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
                      "data-testid": `delete-${program.id}`,
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
                    "data-testid": `submit-${program.id}`,
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

export default ProgramModal;
