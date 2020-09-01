import React from "react";

import CategoryModal, { CategoryModalProps } from ".";

export const CreateCategoryModal = (props: CategoryModalProps) => {
  return (
    <CategoryModal
      {...{
        ...props,
        categoryModalProps: {
          modalTitle: "New Category",
          successButtonText: "Create"
        }
      }}
    />
  );
};

export default CreateCategoryModal;
