import { useFormik } from "formik";
import * as yup from "yup";
import ReactDatePicker from "react-datepicker";
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
  Select
} from "@chakra-ui/core";

import { Button } from "components/Button";
import { GetCalendarEvents_getCalendarEvents as CalendarEvent } from "gql/__generated__/GetCalendarEvents";
import { GetServices_getServices as Service } from "gql/__generated__/GetServices";
import { GetClients_getClients as Client } from "gql/__generated__/GetClients";
import { schema as serviceSchema } from "components/modals/ServiceModal";
import { schema as clientSchema } from "components/modals/ClientModal";

const schema = yup.object().shape({
  title: yup.string().min(1).max(255).required(),
  start: yup.date().required(),
  end: yup.date().required(),
  allDay: yup.boolean().required(),
  client: clientSchema.nullable(),
  service: serviceSchema.nullable()
});

export interface FormInputState {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  client: Client | null;
  service: Service | null;
}

export interface EventModalProps {
  calendarEvent: CalendarEvent;
  clients: Client[];
  services: Service[];
  modalProps: ModalProps;
  handleSave: (event: CalendarEvent) => void;
  handleDelete?: () => void;
}

export interface Props extends EventModalProps {
  eventModalProps: {
    modalTitle: string;
    successButtonText: string;
  };
}

export const CalendarEventModal = ({
  calendarEvent,
  clients,
  services,
  modalProps,
  handleSave,
  handleDelete,
  eventModalProps: { modalTitle, successButtonText }
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      title: calendarEvent.title || "",
      start: calendarEvent.start,
      end: calendarEvent.end,
      allDay: calendarEvent.allDay || false,
      client: calendarEvent.client,
      service: calendarEvent.service
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      modalProps.onClose();
      let start = values.start;
      let end = values.end;
      if (!start || !end) {
        return;
      }
      if (start > end) {
        [start, end] = [end, start];
      }
      handleSave({
        ...calendarEvent,
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
        <ModalOverlay
          {...{
            zIndex: 5,
            css: `
            .react-datepicker-wrapper {
              width: 100%;
            }
            .react-datepicker__input-container input {
              width: 100%;
              border 1px solid;
              border-radius: 0.25rem;
              border-color: inherit;
              padding-left: 1rem;
              padding-right: 1rem;
              height: 2.5rem;
            }
          `
          }}
        >
          <ModalContent>
            <ModalHeader>{modalTitle}</ModalHeader>
            <ModalCloseButton
              {...{
                "data-testid": `close-${calendarEvent.id}`
              }}
            />
            <ModalBody>
              <Stack {...{ spacing: 4 }}>
                <FormControl
                  {...{
                    isRequired: true,
                    isInvalid: formik.touched.title && !!formik.errors.title
                  }}
                >
                  <FormLabel>Title</FormLabel>
                  <Input
                    {...{
                      placeholder: "Title",
                      ...formik.getFieldProps("title")
                    }}
                  />
                  <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isRequired: false,
                    isInvalid: formik.touched.client && !!formik.errors.client
                  }}
                >
                  <FormLabel>Client</FormLabel>
                  <Select
                    {...{
                      isInvalid:
                        formik.touched.client && !!formik.errors.client,
                      feedback: formik.errors.client,
                      ...formik.getFieldProps("client"),
                      value: formik.values.client?.id || "",
                      onChange: (event) => {
                        formik.setValues({
                          ...formik.values,
                          client:
                            clients.find(
                              (client) => event.target.value === client.id
                            ) || null
                        });
                      }
                    }}
                  >
                    <option value={""}>Select a Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.firstName}
                        {client.lastName ? " " + client.lastName : ""}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{formik.errors.client}</FormErrorMessage>
                </FormControl>
                <FormControl
                  {...{
                    isRequired: false,
                    isInvalid: formik.touched.service && !!formik.errors.service
                  }}
                >
                  <FormLabel>Service</FormLabel>
                  <Select
                    {...{
                      disabled: !formik.values.client,
                      isInvalid:
                        formik.touched.service && !!formik.errors.service,
                      feedback: formik.errors.service,
                      ...formik.getFieldProps("service"),
                      value: formik.values.service?.id || "",
                      onChange: (event) => {
                        formik.setValues({
                          ...formik.values,
                          service:
                            services.find(
                              (service) => event.target.value === service.id
                            ) || null
                        });
                      }
                    }}
                  >
                    <option value={""}>Select a Service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{formik.errors.service}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Start</FormLabel>
                  <ReactDatePicker
                    {...{
                      selected: new Date(formik.values.start),
                      onChange: (date) => {
                        if (date) {
                          let start = (date as Date).toISOString();
                          let end = formik.values.end;
                          if (start > end) {
                            [start, end] = [end, start];
                          }
                          formik.setValues({
                            ...formik.values,
                            start,
                            end
                          });
                        }
                      },
                      selectsRange: false,
                      showTimeSelect: true,
                      timeFormat: "HH:mm",
                      timeIntervals: 15,
                      timeCaption: "time",
                      dateFormat: "MMMM d, yyyy h:mm aa"
                    }}
                  />
                  <FormErrorMessage>{formik.errors.start}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>End</FormLabel>
                  <ReactDatePicker
                    {...{
                      selected: new Date(formik.values.end),
                      onChange: (date) => {
                        if (date) {
                          let start = formik.values.start;
                          let end = (date as Date).toISOString();
                          if (start > end) {
                            [start, end] = [end, start];
                          }
                          formik.setValues({
                            ...formik.values,
                            start,
                            end
                          });
                          formik.setValues({
                            ...formik.values,
                            end: (date as Date).toISOString()
                          });
                        }
                      },
                      selectsRange: false,
                      showTimeSelect: true,
                      timeFormat: "HH:mm",
                      timeIntervals: 15,
                      timeCaption: "time",
                      dateFormat: "MMMM d, yyyy h:mm aa"
                    }}
                  />
                  <FormErrorMessage>{formik.errors.end}</FormErrorMessage>
                </FormControl>
                <FormControl {...{ display: "flex", flexWrap: "wrap" }}>
                  <FormLabel {...{ mb: 0 }}>Show in Top</FormLabel>
                  <input
                    {...{
                      type: "checkbox",
                      feedback: formik.errors.allDay,
                      ...formik.getFieldProps("allDay"),
                      checked: formik.values.allDay
                    }}
                  />
                  <FormErrorMessage>{formik.errors.allDay}</FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter {...{ justifyContent: "space-between" }}>
              <div>
                {handleDelete && (
                  <Button
                    {...{
                      "aria-label": "Delete",
                      "data-testid": `delete-${calendarEvent.id}`,
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
                    "data-testid": `submit-${calendarEvent.id}`,
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

export default CalendarEventModal;
