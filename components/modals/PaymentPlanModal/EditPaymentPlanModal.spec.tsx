import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import EditPaymentPlanModal from "./EditPaymentPlanModal";
import { PaymentPlanModalProps } from ".";

describe("Edit Payment Plan Modal", () => {
  beforeAll(async () => {
    await preloadAll();
  });

  afterEach(cleanup);

  let props: PaymentPlanModalProps;

  beforeEach(() => {
    props = {
      paymentPlan: {
        id: "4089eabc-69fd-4525-9a41-a3a3177cfdee",
        installments: [],
        notes: ""
      },
      clients: [],
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
    const { asFragment } = render(<EditPaymentPlanModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<EditPaymentPlanModal {...props} />);
    const close = getByTestId(`close-`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });
});
