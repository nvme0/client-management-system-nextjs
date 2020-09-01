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
import { GetPrograms_getPrograms } from "gql/__generated__/GetPrograms";
import { Button } from "components/Button";

type Program = Omit<GetPrograms_getPrograms, "__typename">;

const schema = yup.object().shape({
  name: yup.string().min(3).max(255).required(),
  notes: yup.string()
});

export interface FormInputState {
  name: string;
  notes: string;
}

export interface ProgramModalProps {
  program: Program;
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
  modalProps,
  handleSave,
  handleDelete,
  programModalProps: { modalTitle, successButtonText }
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      name: program.name,
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
