import React from "react";

import ClientModal, { ClientModalProps } from ".";

const EditClientModal = (props: ClientModalProps) => {
  return (
    <ClientModal
      {...{
        ...props,
        clientModalProps: {
          modalTitle: "Edit Client",
          successButtonText: "Save"
        }
      }}
    />
  );
};

export default EditClientModal;
