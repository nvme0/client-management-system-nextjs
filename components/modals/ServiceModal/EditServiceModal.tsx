import React from "react";

import ServiceModal, { ServiceModalProps } from ".";

const EditServiceModal = (props: ServiceModalProps) => {
  return (
    <ServiceModal
      {...{
        ...props,
        serviceModalProps: {
          modalTitle: "Edit Service",
          successButtonText: "Save"
        }
      }}
    />
  );
};

export default EditServiceModal;
