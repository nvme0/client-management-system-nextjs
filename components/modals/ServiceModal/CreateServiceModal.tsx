import React from "react";

import ServiceModal, { ServiceModalProps } from ".";

export const CreateServiceModal = (props: ServiceModalProps) => {
  return (
    <ServiceModal
      {...{
        ...props,
        serviceModalProps: {
          modalTitle: "New Service",
          successButtonText: "Create"
        }
      }}
    />
  );
};

export default CreateServiceModal;
