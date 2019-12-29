import React from "react";
import { headerStyle } from "./style";

const Header = () => {
  return (
    <div style={headerStyle}>
      <i class="fab fa-ethereum"></i>
      <div style={{ marginLeft: "15px" }}>Ethereum Bid System</div>
    </div>
  );
};

export default Header;
