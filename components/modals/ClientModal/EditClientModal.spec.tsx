import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import EditClientModal from "./EditClientModal";
import { ClientModalProps } from ".";

describe("Edit Client Modal", () => {
  afterEach(cleanup);

  let props: ClientModalProps;

  beforeEach(() => {
    props = {
      client: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        firstName: "Jimmy",
        lastName: "",
        address: "",
        email: "",
        phone: "",
        notes: "",
        programs: [],
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z"
      },
      programs: [],
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((clientInput) => {}),
      handleDelete: jest.fn()
    };
  });

  it("renders", () => {
    const { asFragment } = render(<EditClientModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<EditClientModal {...props} />);
    const close = getByTestId(`close-${props.client.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    const { getByTestId } = render(<EditClientModal {...props} />);
    const submit = getByTestId(`submit-${props.client.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.client);
    });
  });

  it("calls handleDelete on delete button click", () => {
    const { getByTestId } = render(<EditClientModal {...props} />);
    const deleteButton = getByTestId(`delete-${props.client.id}`);
    deleteButton.click();
    expect(props.handleDelete).toBeCalledTimes(1);
  });
});
