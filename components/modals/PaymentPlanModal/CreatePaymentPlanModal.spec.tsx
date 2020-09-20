import { render, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import preloadAll from "jest-next-dynamic";

import CreatePaymentPlanModal from "./CreatePaymentPlanModal";
import { PaymentPlanModalProps } from ".";

describe("Create Payment Plan Modal", () => {
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
      handleSave: jest.fn((clientInput) => {})
    };
  });

  it("renders", () => {
    const { asFragment } = render(<CreatePaymentPlanModal {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose on close button click", () => {
    const { getByTestId } = render(<CreatePaymentPlanModal {...props} />);
    const close = getByTestId(`close-`);
    close.click();
    expect(props.modalProps.onClose).toBeCalledTimes(1);
  });
});
