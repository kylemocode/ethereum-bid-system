import React, { createContext, useReducer } from "react";
import { bidReducer } from "../reducers/bidReducer";

export const BidValueContext = createContext();

const BidValueContextProvider = props => {
  const [bidValue, dispatch_bidValue] = useReducer(bidReducer, 0);

  return (
    <BidValueContext.Provider value={{ dispatch_bidValue, bidValue }}>
      {props.children}
    </BidValueContext.Provider>
  );
};

export default BidValueContextProvider;
