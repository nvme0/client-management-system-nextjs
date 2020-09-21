import React from "react";

import PaymentPlanModal, { PaymentPlanModalProps } from ".";

export const CreatePaymentPlanModal = (props: PaymentPlanModalProps) => {
  return (
    <PaymentPlanModal
      {...{
        ...props,
        paymentPlanModalProps: {
          modalTitle: "New Payment Plan",
          successButtonText: "Create"
        }
      }}
    />
  );
};

export default CreatePaymentPlanModal;
