import React from "react";

import ProgramModal, { ProgramModalProps } from ".";

const EditProgramModal = (props: ProgramModalProps) => {
  return (
    <ProgramModal
      {...{
        ...props,
        programModalProps: {
          modalTitle: "Edit Program",
          successButtonText: "Save"
        }
      }}
    />
  );
};

export default EditProgramModal;
