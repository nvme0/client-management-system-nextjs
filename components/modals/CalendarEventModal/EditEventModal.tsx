import React from "react";

import EventModal, { EventModalProps } from ".";

export const EditEventModal = (props: EventModalProps) => {
  return (
    <EventModal
      {...{
        ...props,
        eventModalProps: {
          modalTitle: "Edit Event",
          successButtonText: "Update"
        }
      }}
    />
  );
};

export default EditEventModal;
