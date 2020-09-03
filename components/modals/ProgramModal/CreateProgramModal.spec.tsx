import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import CreateProgramModal from "./CreateProgramModal";
import { ProgramModalProps } from ".";

describe("Create Program Modal", () => {
  beforeAll(async () => {
    await preloadAll();
  });

  afterEach(cleanup);

  let props: ProgramModalProps;

  beforeEach(() => {
    props = {
      program: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        name: "",
        notes: "",
        createdAt: "2019-10-10T00:53:43.549Z",
        updatedAt: "2019-10-10T00:53:43.549Z",
        categories: []
      },
      categories: [],
      modalProps: {
        isOpen: true,
        onClose: jest.fn()
      },
      handleSave: jest.fn((programInput) => {})
    };
  });

  it("renders", () => {
    const { asFragment } = render(<CreateProgramModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<CreateProgramModal {...props} />);
    const close = getByTestId(`close-${props.program.id}`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });

  it("calls handleSave on form submission", async () => {
    props.program.name = "My Program";
    const { getByTestId } = render(<CreateProgramModal {...props} />);
    const submit = getByTestId(`submit-${props.program.id}`);
    submit.click();

    await waitFor(() => {
      expect(props.modalProps.onClose).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledTimes(1);
      expect(props.handleSave).toBeCalledWith(props.program);
    });
  });
});
