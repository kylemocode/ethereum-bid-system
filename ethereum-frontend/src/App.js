import React from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import { bodyStyle } from "./components/style";
import AccountContextProvider from "./contexts/AccountContext";

function App() {
  return (
    <div style={bodyStyle}>
      <AccountContextProvider>
        <Header />
        <Login />
      </AccountContextProvider>
    </div>
  );
}

export default App;
