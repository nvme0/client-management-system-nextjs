import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import CreateCategoryModal from "./CreateCategoryModal";
import { CategoryModalProps } from ".";

describe("Create Category Modal", () => {
  afterEach(cleanup);

  let props: CategoryModalProps;

  beforeEach(() => {
    props = {
      category: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        name: "",
        for: "Program",
        notes: "",
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z"
      },
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((categoryInput) => {})
    };
  });

  it("renders", () => {
    const { asFragment } = render(<CreateCategoryModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<CreateCategoryModal {...props} />);
    const close = getByTestId(`close-${props.category.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    props.category.name = "My Category";
    const { getByTestId } = render(<CreateCategoryModal {...props} />);
    const submit = getByTestId(`submit-${props.category.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.category);
    });
  });
});
