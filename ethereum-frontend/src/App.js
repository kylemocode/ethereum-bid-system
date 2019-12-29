import React from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Deploy from "./components/Deploy";
import { bodyStyle } from "./components/style";
import AccountContextProvider from "./contexts/AccountContext";

function App() {
  return (
    <div style={bodyStyle}>
      <AccountContextProvider>
        <Header />
        <Login />
        <Deploy />
      </AccountContextProvider>
    </div>
  );
}

export default App;
