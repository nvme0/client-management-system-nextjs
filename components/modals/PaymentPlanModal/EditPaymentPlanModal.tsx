import React from "react";

import PaymentPlanModal, { PaymentPlanModalProps } from ".";

const EditPaymentPlanModal = (props: PaymentPlanModalProps) => {
  return (
    <PaymentPlanModal
      {...{
        ...props,
        paymentPlanModalProps: {
          modalTitle: "Edit Payment Plan",
          successButtonText: "Save"
        }
      }}
    />
  );
};

export default EditPaymentPlanModal;
