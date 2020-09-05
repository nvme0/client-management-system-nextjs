import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import CreateCategoryModal from "./CreateCategoryModal";

export default {
  title: "Modals/CreateCategoryModal",
  component: CreateCategoryModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleCreateCategory = () => {
    setState({
      ...state,
      Modal: () => (
        <CreateCategoryModal
          {...{
            category: {
              id: uuid(),
              name: "",
              for: "Program",
              notes: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (categoryInput) => {
              alert("Saved: " + categoryInput.id);
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
          onClick: handleCreateCategory
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
