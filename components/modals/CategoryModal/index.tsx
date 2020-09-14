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
import { GetCategories_getCategories as Category } from "gql/__generated__/GetCategories";
import { Button } from "components/Button";

const schema = yup.object().shape({
  name: yup.string().min(3).max(255).required(),
  notes: yup.string()
});

export interface FormInputState {
  name: string;
  notes: string;
}

export interface CategoryModalProps {
  category: Category;
  modalProps: ModalProps;
  handleSave: (category: Category) => void;
  handleDelete?: () => void;
}

export interface Props extends CategoryModalProps {
  categoryModalProps: {
    modalTitle: string;
    successButtonText: string;
  };
}

const CategoryModal = ({
  category,
  modalProps,
  handleSave,
  handleDelete,
  categoryModalProps: { modalTitle, successButtonText }
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      name: category.name,
      notes: category.notes || ""
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      modalProps.onClose();
      handleSave({
        ...category,
        ...values
      });
    }
  });

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
                "data-testid": `close-${category.id}`
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
                      "data-testid": `delete-${category.id}`,
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
                    "data-testid": `submit-${category.id}`,
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

export default CategoryModal;
