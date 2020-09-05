import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import EditCategoryModal from "./EditCategoryModal";

export default {
  title: "Modals/EditCategoryModal",
  component: EditCategoryModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleEditCategory = () => {
    const category = {
      id: uuid(),
      name: "",
      for: "Program",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState({
      ...state,
      Modal: () => (
        <EditCategoryModal
          {...{
            category,
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (categoryInput) => {
              alert("Saved: " + categoryInput.id);
            },
            handleDelete: () => {
              alert("Deleted: " + category.id);
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
          onClick: handleEditCategory
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
