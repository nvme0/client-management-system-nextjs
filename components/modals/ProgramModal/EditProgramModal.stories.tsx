import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import EditProgramModal from "./EditProgramModal";

export default {
  title: "Modals/EditProgramModal",
  component: EditProgramModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleEditProgram = () => {
    const program = {
      id: uuid(),
      name: "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState({
      ...state,
      Modal: () => (
        <EditProgramModal
          {...{
            program,
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (programInput) => {
              alert("Saved: " + programInput.id);
            },
            handleDelete: () => {
              alert("Deleted: " + program.id);
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
          onClick: handleEditProgram
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
