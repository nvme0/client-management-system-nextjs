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
import { GetPrograms_getPrograms as Program } from "gql/__generated__/GetPrograms";
import { GetCategories_getCategories as Category } from "gql/__generated__/GetCategories";
import ProgramAddItem from "./components/ProgramAddItem";

const schema = yup.object().shape({
  name: yup.string().min(3).max(255).required(),
  categories: yup.array(),
  notes: yup.string()
});

export interface FormInputState {
  name: string;
  categories: Category[];
  notes: string;
}

export interface ProgramModalProps {
  program: Program;
  categories: Category[];
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
  modalProps,
  handleSave,
  handleDelete,
  programModalProps: { modalTitle, successButtonText }
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      name: program.name,
      categories: program.categories || [],
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

  const addCategory = (category: Category) => {
    formik.setValues({
      ...formik.values,
      categories: [...formik.values.categories, category]
    });
  };

  const removeCategory = (category: Category) => {
    formik.setValues({
      ...formik.values,
      categories: formik.values.categories.filter(
        ({ id }) => id !== category.id
      )
    });
  };

  const data = useMemo<TableOptions<any>["data"]>(
    () => formik.values.categories || [],
    [formik.values.categories]
  );

  const columns = useMemo<TableOptions<Category>["columns"]>(
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
    []
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
                    isRequired: true,
                    isInvalid: formik.touched.name && !!formik.errors.name
                  }}
                >
                  <FormLabel>Services</FormLabel>
                </FormControl>
                <FormControl
                  {...{
                    isRequired: true,
                    isInvalid:
                      formik.touched.categories && !!formik.errors.categories
                  }}
                >
                  <FormLabel>Categories</FormLabel>
                  <Stack>
                    <BasicTable
                      {...{
                        data,
                        columns,
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
