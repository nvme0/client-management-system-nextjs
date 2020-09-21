import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import EditClientModal from "./EditClientModal";

export default {
  title: "Modals/EditClientModal",
  component: EditClientModal
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
      paymentPlans: [],
      programs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState({
      ...state,
      Modal: () => (
        <EditClientModal
          {...{
            client,
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
