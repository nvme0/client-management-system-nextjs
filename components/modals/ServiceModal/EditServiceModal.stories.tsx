import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import EditServiceModal from "./EditServiceModal";

export default {
  title: "Modals/EditServiceModal",
  component: EditServiceModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleEditService = () => {
    const service = {
      id: uuid(),
      name: "",
      duration: null,
      expires: null,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState({
      ...state,
      Modal: () => (
        <EditServiceModal
          {...{
            service,
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (serviceInput) => {
              alert("Saved: " + serviceInput.id);
            },
            handleDelete: () => {
              alert("Deleted: " + service.id);
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
          onClick: handleEditService
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
