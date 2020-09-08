import React from "react";

import EventModal, { EventModalProps } from ".";

export const CreateEventModal = (props: EventModalProps) => {
  return (
    <EventModal
      {...{
        ...props,
        eventModalProps: {
          modalTitle: "New Event",
          successButtonText: "Create"
        }
      }}
    />
  );
};

export default CreateEventModal;
