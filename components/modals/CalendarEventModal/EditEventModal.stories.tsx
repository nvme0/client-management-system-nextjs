import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import EditEventModal from "./EditEventModal";

export default {
  title: "Modals/EditEventModal",
  component: EditEventModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleEditCalendarEvent = () => {
    const calendarEvent = {
      id: uuid(),
      title: "",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      allDay: false,
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resource: null,
      service: null,
      client: null
    };

    setState({
      ...state,
      Modal: () => (
        <EditEventModal
          {...{
            calendarEvent,
            clients: [],
            services: [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (calendarInput) => {
              alert("Saved: " + calendarInput.id);
            },
            handleDelete: () => {
              alert("Deleted: " + calendarEvent.id);
            }
          }}
        />
      )
    });
  };

  return (
    <>
      <Button
        {...{
          templateStyle: "primary-outline",
          onClick: handleEditCalendarEvent
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
