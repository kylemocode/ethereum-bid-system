import React, { createContext, useEffect, useState, useReducer } from "react";
import { accountReducer } from "../reducers/accountReducer";
import axios from "axios";

export const AccountContext = createContext();

const AccountContextProvider = props => {
  const [currentAccount, dispatch] = useReducer(accountReducer, "");
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8545/accounts").then(res => {
      setAccounts(res.data.addresses);
    });
  }, []);

  return (
    <AccountContext.Provider value={{ accounts, dispatch, currentAccount }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountContextProvider;
