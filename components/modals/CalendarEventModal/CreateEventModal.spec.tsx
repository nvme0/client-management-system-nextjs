import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import CreateEventModal from "./CreateEventModal";
import { EventModalProps } from ".";

describe("Create CalendarEvent Modal", () => {
  afterEach(cleanup);

  let props: EventModalProps;

  beforeEach(() => {
    props = {
      calendarEvent: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        title: "",
        start: "2019-10-10T00:54:43.549Z",
        end: "2019-10-10T00:55:43.549Z",
        allDay: false,
        notes: "",
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z",
        resource: null,
        service: null,
        client: null
      },
      clients: [],
      services: [],
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((calendarEventInput) => {})
    };
  });

  it("renders", () => {
    const { asFragment } = render(<CreateEventModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<CreateEventModal {...props} />);
    const close = getByTestId(`close-${props.calendarEvent.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    props.calendarEvent.title = "My CalendarEvent";
    const { getByTestId } = render(<CreateEventModal {...props} />);
    const submit = getByTestId(`submit-${props.calendarEvent.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.calendarEvent);
    });
  });
});
