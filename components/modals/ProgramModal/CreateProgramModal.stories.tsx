import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import CreateProgramModal from "./CreateProgramModal";

export default {
  title: "Modals/CreateProgramModal",
  component: CreateProgramModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleCreateProgram = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateProgramModal
          {...{
            program: {
              id: uuid(),
              name: "",
              notes: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              categories: []
            },
            categories: [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (programInput) => {
              alert("Saved: " + programInput.id);
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
          onClick: handleCreateProgram
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
