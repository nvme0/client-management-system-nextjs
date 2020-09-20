import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import CreatePaymentPlanModal from "./CreatePaymentPlanModal";

export default {
  title: "Modals/CreatePaymentPlanModal",
  component: CreatePaymentPlanModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleCreateClient = () => {
    setState({
      ...state,
      Modal: () => (
        <CreatePaymentPlanModal
          {...{
            paymentPlan: {
              id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
              installments: [],
              notes: ""
            },
            clients: [],
            programs: [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (clientInput) => {
              alert("Saved: " + clientInput.id);
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
          onClick: handleCreateClient
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
