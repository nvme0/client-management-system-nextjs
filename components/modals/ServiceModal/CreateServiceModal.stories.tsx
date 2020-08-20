import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import CreateServiceModal from "./CreateServiceModal";

export default {
  title: "Modals/CreateServiceModal",
  component: CreateServiceModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleCreateService = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateServiceModal
          {...{
            service: {
              id: uuid(),
              name: "",
              duration: null,
              expires: null,
              notes: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (serviceInput) => {
              alert("Saved: " + serviceInput.id);
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
          onClick: handleCreateService
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
