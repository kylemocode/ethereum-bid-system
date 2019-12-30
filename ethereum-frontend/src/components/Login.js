import React, { useContext, useState } from "react";
import { loginStyle } from "./style";
import { AccountContext } from "../contexts/AccountContext";
import { setCurrentAccount } from "../actions/account";

const Login = () => {
  const { accounts, currentAccount, dispatch_account } = useContext(
    AccountContext
  );
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleClick = () => {
    dispatch_account(setCurrentAccount(selectedAccount));
  };

  return (
    <div style={loginStyle.container}>
      <p style={loginStyle.title}>帳戶登入</p>
      <select
        onChange={e => setSelectedAccount(e.target.value)}
        value={selectedAccount}
      >
        {accounts.map(account => {
          return <option value={account}>{account}</option>;
        })}
      </select>
      <button style={loginStyle.button} onClick={handleClick}>
        登入
      </button>
      {selectedAccount ? (
        <p style={loginStyle.currentAccount}>當前帳號： {currentAccount}</p>
      ) : (
        <p style={loginStyle.currentAccount}>尚未登入</p>
      )}
    </div>
  );
};

export default Login;
