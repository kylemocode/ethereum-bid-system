import React from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Deploy from "./components/Deploy";
import Bid from "./components/Bid";
import { bodyStyle } from "./components/style";
import AccountContextProvider from "./contexts/AccountContext";
import ContractContextProvider from "./contexts/ContractContext";

function App() {
  return (
    <div style={bodyStyle}>
      <AccountContextProvider>
        <ContractContextProvider>
          <Header />
          <Login />
          <Deploy />
          <Bid />
        </ContractContextProvider>
      </AccountContextProvider>
    </div>
  );
}

export default App;
