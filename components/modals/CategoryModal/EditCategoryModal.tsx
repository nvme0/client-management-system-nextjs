import React from "react";

import CategoryModal, { CategoryModalProps } from ".";

const EditCategoryModal = (props: CategoryModalProps) => {
  return (
    <CategoryModal
      {...{
        ...props,
        categoryModalProps: {
          modalTitle: "Edit Category",
          successButtonText: "Save"
        }
      }}
    />
  );
};

export default EditCategoryModal;
