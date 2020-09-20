import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import CreateClientModal from "./CreateClientModal";

export default {
  title: "Modals/CreateClientModal",
  component: CreateClientModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleCreateClient = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateClientModal
          {...{
            client: {
              id: uuid(),
              firstName: "",
              lastName: "",
              address: "",
              email: "",
              phone: "",
              notes: "",
              paymentPlans: [],
              programs: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
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
