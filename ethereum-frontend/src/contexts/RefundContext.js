import React, { createContext, useReducer } from "react";
import { refundReducer } from "../reducers/refundReducer";

export const RefundContext = createContext();

const RefundContextProvider = props => {
  const [totalRefund, dispatch_refund] = useReducer(refundReducer, 0);

  return (
    <RefundContext.Provider value={{ dispatch_refund, totalRefund }}>
      {props.children}
    </RefundContext.Provider>
  );
};

export default RefundContextProvider;
