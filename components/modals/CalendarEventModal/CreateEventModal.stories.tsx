import { useState } from "react";
import { v4 as uuid } from "uuid";

import { Button } from "components/Button";
import CreateEventModal from "./CreateEventModal";

export default {
  title: "Modals/CreateEventModal",
  component: CreateEventModal
};

export const Default = () => {
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const handleCreateCalendarEvent = () => {
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
        <CreateEventModal
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
          onClick: handleCreateCalendarEvent
        }}
      >
        Open Modal
      </Button>
      {state.Modal && <state.Modal />}
    </>
  );
};
