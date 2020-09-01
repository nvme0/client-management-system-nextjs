import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import EditCategoryModal from "./EditCategoryModal";
import { CategoryModalProps } from ".";

describe("Edit Category Modal", () => {
  afterEach(cleanup);

  let props: CategoryModalProps;

  beforeEach(() => {
    props = {
      category: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        name: "My Category",
        for: "Program",
        notes: "",
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z"
      },
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((categoryInput) => {}),
      handleDelete: jest.fn()
    };
  });

  it("renders", () => {
    const { asFragment } = render(<EditCategoryModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<EditCategoryModal {...props} />);
    const close = getByTestId(`close-${props.category.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    const { getByTestId } = render(<EditCategoryModal {...props} />);
    const submit = getByTestId(`submit-${props.category.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.category);
    });
  });

  it("calls handleDelete on delete button click", () => {
    const { getByTestId } = render(<EditCategoryModal {...props} />);
    const deleteButton = getByTestId(`delete-${props.category.id}`);
    deleteButton.click();
    expect(props.handleDelete).toBeCalledTimes(1);
  });
});
