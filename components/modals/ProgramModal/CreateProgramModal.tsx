import React from "react";

import ProgramModal, { ProgramModalProps } from ".";

export const CreateProgramModal = (props: ProgramModalProps) => {
  return (
    <ProgramModal
      {...{
        ...props,
        programModalProps: {
          modalTitle: "New Program",
          successButtonText: "Create"
        }
      }}
    />
  );
};

export default CreateProgramModal;
