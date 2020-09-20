import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import EditPaymentPlanModal from "./EditPaymentPlanModal";

export default {
  title: "Modals/EditPaymentPlanModal",
  component: EditPaymentPlanModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleEditClient = () => {
    const client = {
      id: uuid(),
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
      notes: "",
      programs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState({
      ...state,
      Modal: () => (
        <EditPaymentPlanModal
          {...{
            paymentPlan: {
              id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
              title: "",
              paymentNumber: 0,
              installments: [],
              notes: ""
            },
            client,
            clients: [],
            programs: [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (clientInput) => {
              alert("Saved: " + clientInput.id);
            },
            handleDelete: () => {
              alert("Deleted: " + client.id);
            }
          }}
        />
      )
    });
  };

  return (
    <>
      <Button
        {...{
          templateStyle: "primary-outline",
          onClick: handleEditClient
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
