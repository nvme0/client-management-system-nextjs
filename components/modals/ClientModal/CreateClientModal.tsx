import React from "react";

import ClientModal, { ClientModalProps } from ".";

export const CreateClientModal = (props: ClientModalProps) => {
  return (
    <ClientModal
      {...{
        ...props,
        clientModalProps: {
          modalTitle: "New Client",
          successButtonText: "Create"
        }
      }}
    />
  );
};

export default CreateClientModal;
