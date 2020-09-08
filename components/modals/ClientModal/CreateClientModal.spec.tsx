import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import CreateClientModal from "./CreateClientModal";
import { ClientModalProps } from ".";

describe("Create Client Modal", () => {
  afterEach(cleanup);

  let props: ClientModalProps;

  beforeEach(() => {
    props = {
      client: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        phone: "",
        notes: "",
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z"
      },
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((clientInput) => {})
    };
  });

  it("renders", () => {
    const { asFragment } = render(<CreateClientModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<CreateClientModal {...props} />);
    const close = getByTestId(`close-${props.client.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    props.client.firstName = "Jimmy";
    const { getByTestId } = render(<CreateClientModal {...props} />);
    const submit = getByTestId(`submit-${props.client.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.client);
    });
  });
});
