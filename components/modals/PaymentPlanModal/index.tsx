import ReactDatePicker from "react-datepicker";
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/core";

import { Button } from "components/Button";
import {
  GetClients_getClients as Client,
  GetClients_getClients_paymentPlans as PaymentPlan,
  GetClients_getClients_paymentPlans_installments as Installment
} from "gql/__generated__/GetClients";
import { GetPrograms_getPrograms as Program } from "gql/__generated__/GetPrograms";
import { cloneDeep } from "lodash";
import { useEffect } from "react";

export const schema = yup.object().shape({
  title: yup.string().min(3).max(255).required(),
  clientIndex: yup.number().required(),
  amount: yup
    .string()
    .matches(
      /(^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{1,2})?$)/,
      "Must be a valid currency input"
    )
    .required(`Amount is a required field`),
  currency: yup.string().default("USD").required(),
  numberOfInstallments: yup.number().integer().min(1).required(),
  installments: yup
    .array()
    .of(
      yup.object().shape({
        date: yup.date(),
        amount: yup
          .string()
          .matches(
            /(^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{1,2})?$)/,
            "Must be a valid currency input"
          )
          .required(`Amount is a required field`),
        currency: yup.string().default("USD").required()
      })
    )
    .required(),
  notes: yup.string().max(255)
});

export interface FormInputState {
  title: string;
  clientIndex: number;
  amount: string;
  currency: string;
  numberOfInstallments: number;
  installments: Installment[];
  notes: string;
}

export interface PaymentPlanModalProps {
  paymentPlan: PaymentPlan;
  clients: Client[];
  clientIndex?: number;
  programs: Program[];
  modalProps: ModalProps;
  handleSave: (client: Client) => void;
  handleDelete?: () => void;
}

export interface Props extends PaymentPlanModalProps {
  paymentPlanModalProps: {
    modalTitle: string;
    successButtonText: string;
  };
}

const PaymentPlanModal = ({
  paymentPlan,
  clients,
  programs,
  modalProps,
  handleSave,
  handleDelete,
  paymentPlanModalProps: { modalTitle, successButtonText },
  ...props
}: Props) => {
  const formik = useFormik<FormInputState>({
    initialValues: {
      title: paymentPlan.title || "",
      clientIndex: props.clientIndex != null ? props.clientIndex : -1,
      amount:
        (paymentPlan.installments || [])
          .reduce((amt, { amount }) => amt + Number(amount), 0)
          .toString() || "",
      currency: "USD",
      numberOfInstallments: paymentPlan.installments?.length || 1,
      installments: paymentPlan.installments || [],
      notes: paymentPlan.notes || ""
    },
    validationSchema: schema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      const clientIndex = values.clientIndex;
      if (clientIndex > -1) {
        modalProps.onClose();
      } else {
        formik.setErrors({
          ...formik.errors,
          clientIndex: "No client selected"
        });
      }
      const client = clients[clientIndex];
      const installments: Installment[] = [];
      for (let i = 0; i < formik.values.numberOfInstallments; i++) {
        installments.push({
          ...values.installments[i],
          notes: values.notes
        });
      }
      if (client) {
        const paymentPlans = cloneDeep(client.paymentPlans) || [];
        const paymentPlanIndex = paymentPlans.findIndex(
          ({ id }) => id === paymentPlan.id
        );
        if (paymentPlanIndex > -1) {
          paymentPlans[paymentPlanIndex] = {
            id: paymentPlan.id,
            title: values.title,
            paymentNumber: 0,
            installments,
            notes: values.notes
          };
        } else {
          paymentPlans.push({
            id: paymentPlan.id,
            title: values.title,
            paymentNumber: 0,
            installments,
            notes: values.notes
          });
        }
        handleSave({
          ...client,
          paymentPlans
        });
      }
    }
  });

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      amount:
        formik.values.installments
          ?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
          .toString() || ""
    });
  }, [formik.values.installments]);

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
                "data-testid": `close-`
              }}
            />
            <ModalBody
              {...{
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
              <Tabs>
                <TabList>
                  <Tab>Plan</Tab>
                  <Tab>Installments</Tab>
                  <Tab>Notes</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel {...{ px: 0 }}>
                    <Stack {...{ spacing: 4 }}>
                      <FormControl
                        {...{
                          isRequired: true,
                          isInvalid:
                            formik.touched.title && !!formik.errors.title
                        }}
                      >
                        <FormLabel>Title</FormLabel>
                        <Input
                          {...{
                            "aria-label": "Title",
                            placeholder: "Title",
                            ...formik.getFieldProps("title")
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.title}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        {...{
                          isRequired: true,
                          isInvalid:
                            formik.touched.clientIndex &&
                            !!formik.errors.clientIndex
                        }}
                      >
                        <FormLabel>Client</FormLabel>
                        <Select
                          {...{
                            "aria-label": "Select a Client",
                            value: formik.values.clientIndex,
                            onChange: (event) => {
                              const newClientIndex = Number(event.target.value);
                              formik.setValues({
                                ...formik.values,
                                clientIndex: isNaN(newClientIndex)
                                  ? -1
                                  : newClientIndex
                              });
                            }
                          }}
                        >
                          <option value={-1}>Select a Client</option>
                          {clients.map((client, index) => (
                            <option key={client.id} value={index}>
                              {client.firstName}
                              {client.lastName ? " " + client.lastName : ""}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>
                          {formik.errors.clientIndex}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        {...{
                          isRequired: true,
                          isInvalid:
                            formik.touched.amount && !!formik.errors.amount
                        }}
                      >
                        <FormLabel>Amount</FormLabel>
                        <Input
                          {...{
                            "aria-label": "Amount",
                            placeholder: "0.00",
                            value: formik.values.amount || "",
                            disabled: true
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.amount}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        {...{
                          isRequired: true,
                          isInvalid:
                            formik.touched.numberOfInstallments &&
                            !!formik.errors.numberOfInstallments
                        }}
                      >
                        <FormLabel>Number of Installments</FormLabel>
                        <NumberInput
                          {...{
                            defaultValue: formik.values.numberOfInstallments,
                            min: 1,
                            max: 10,
                            onChange: (e) => {
                              const value = e ? Number(e) : 1;
                              formik.setValues({
                                ...formik.values,
                                numberOfInstallments: value
                              });
                            }
                          }}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormErrorMessage>
                          {formik.errors.numberOfInstallments}
                        </FormErrorMessage>
                      </FormControl>
                    </Stack>
                  </TabPanel>
                  <TabPanel {...{ px: 0 }}>
                    <Stack {...{ spacing: 6 }}>
                      <FormControl
                        {...{
                          isInvalid:
                            formik.touched.amount && !!formik.errors.amount
                        }}
                      >
                        <FormLabel>Total Amount</FormLabel>
                        <Input
                          {...{
                            "aria-label": "Total Amount",
                            placeholder: "0.00",
                            value: formik.values.amount || "",
                            disabled: true
                          }}
                        />
                        <FormErrorMessage>
                          {formik.errors.amount}
                        </FormErrorMessage>
                      </FormControl>
                      {(() => {
                        const Installments: JSX.Element[] = [];
                        const installments: FormInputState["installments"] =
                          formik.values.installments;

                        for (
                          let i = 0;
                          i < formik.values.numberOfInstallments;
                          i++
                        ) {
                          if (!installments[i]) {
                            installments.push({
                              amount: "",
                              currency: "USD",
                              notes: null,
                              date: new Date().toISOString()
                            });
                          }

                          Installments.push(
                            <Stack
                              {...{ key: `installment-${i + 1}`, spacing: 1 }}
                            >
                              <p style={{ fontWeight: 600 }}>
                                Installment {i + 1}
                              </p>
                              <FormControl
                                {...{
                                  isRequired: true,
                                  isInvalid:
                                    ((formik.touched.installments || [])[i] &&
                                      !!(formik.errors.installments || [])[
                                        i
                                      ]) ||
                                    (formik.touched.installments &&
                                      !!formik.errors.installments &&
                                      typeof formik.errors.installments ===
                                        "string")
                                }}
                              >
                                <FormLabel>Amount</FormLabel>
                                <Input
                                  {...{
                                    "aria-label": "Installmant Amount",
                                    placeholder: "0.00",
                                    ...formik.getFieldProps(
                                      `installments[${i}].amount`
                                    ),
                                    value:
                                      formik.getFieldProps(
                                        `installments[${i}].amount`
                                      ).value || ""
                                  }}
                                />
                                <FormErrorMessage>
                                  {(() => {
                                    if (
                                      typeof formik.errors.installments ===
                                      "string"
                                    ) {
                                      return formik.errors.installments;
                                    }
                                    if (
                                      formik.errors.installments?.length &&
                                      formik.errors.installments[i] &&
                                      (formik.errors.installments[i] as any)
                                        .amount
                                    ) {
                                      return (formik.errors.installments[
                                        i
                                      ] as any).amount;
                                    }
                                    return "";
                                  })()}
                                </FormErrorMessage>
                              </FormControl>
                              <FormControl
                                {...{
                                  isRequired: true
                                }}
                              >
                                <FormLabel>Date</FormLabel>
                                <ReactDatePicker
                                  {...{
                                    selected: (formik.values.installments ||
                                      [])[i]?.date
                                      ? new Date(
                                          (formik.values.installments || [])[
                                            i
                                          ]?.date
                                        )
                                      : new Date(),
                                    onChange: (date: Date) => {
                                      if (date) {
                                        const installments = cloneDeep(
                                          formik.values.installments
                                        );
                                        installments[
                                          i
                                        ].date = date.toISOString();
                                        formik.setValues({
                                          ...formik.values,
                                          installments
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
                              </FormControl>
                            </Stack>
                          );
                        }
                        return Installments;
                      })()}
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
                      "data-testid": `delete-`,
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
                    "data-testid": `submit-`,
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

export default PaymentPlanModal;
