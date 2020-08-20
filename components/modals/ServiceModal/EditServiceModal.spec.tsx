import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import EditServiceModal from "./EditServiceModal";
import { ServiceModalProps } from ".";

describe("Edit Service Modal", () => {
  afterEach(cleanup);

  let props: ServiceModalProps;

  beforeEach(() => {
    props = {
      service: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        name: "My Service",
        duration: null,
        expires: null,
        notes: "",
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z"
      },
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((serviceInput) => {}),
      handleDelete: jest.fn()
    };
  });

  it("renders", () => {
    const { asFragment } = render(<EditServiceModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<EditServiceModal {...props} />);
    const close = getByTestId(`close-${props.service.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    const { getByTestId } = render(<EditServiceModal {...props} />);
    const submit = getByTestId(`submit-${props.service.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.service);
    });
  });

  it("calls handleDelete on delete button click", () => {
    const { getByTestId } = render(<EditServiceModal {...props} />);
    const deleteButton = getByTestId(`delete-${props.service.id}`);
    deleteButton.click();
    expect(props.handleDelete).toBeCalledTimes(1);
  });
});
