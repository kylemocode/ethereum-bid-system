import React, { createContext, useReducer } from "react";
import { contractReducer } from "../reducers/contractReducer";

export const ContractContext = createContext();

const ContractContextProvider = props => {
  const [currentContract, dispatch_contract] = useReducer(contractReducer, "");

  return (
    <ContractContext.Provider value={{ dispatch_contract, currentContract }}>
      {props.children}
    </ContractContext.Provider>
  );
};

export default ContractContextProvider;
