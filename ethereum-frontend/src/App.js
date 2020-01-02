import React from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Deploy from "./components/Deploy";
import Bid from "./components/Bid";
import Withdraw from "./components/Withdraw";
import Reveal from "./components/Reveal";
import { bodyStyle } from "./components/style";
import AccountContextProvider from "./contexts/AccountContext";
import ContractContextProvider from "./contexts/ContractContext";
import UserStatusContextProvider from "./contexts/UserStatusContext";
import BidValueContextProvider from "./contexts/BidValueContext";
import RefundContextProvider from "./contexts/RefundContext";

function App() {
  return (
    <div style={bodyStyle}>
      <AccountContextProvider>
        <ContractContextProvider>
          <UserStatusContextProvider>
            <BidValueContextProvider>
              <RefundContextProvider>
                <Header />
                <Login />
                <Deploy />
                <Bid />
                <Reveal />
                <Withdraw />
              </RefundContextProvider>
            </BidValueContextProvider>
          </UserStatusContextProvider>
        </ContractContextProvider>
      </AccountContextProvider>
    </div>
  );
}

export default App;
