import React, { useContext, useState } from "react";
import { bidStyle } from "./style";
import { ContractContext } from "../contexts/ContractContext";
import { AccountContext } from "../contexts/AccountContext";
import { fake, secret } from "../secret";
import axios from "axios";

const Bid = () => {
  const [bidValue, setBidValue] = useState(0);
  const [isBiding, setIsBiding] = useState(false);
  const [bidRes, setBidRes] = useState(null);
  const { currentAccount } = useContext(AccountContext);
  const { currentContract } = useContext(ContractContext);

  const handleBid = () => {
    if (bidValue <= 0) {
      alert("寫價金額不得為負或0");
      return;
    }
    if (!currentAccount || !currentContract) {
      alert("請先完成登入與部屬");
      return;
    }
    setIsBiding(true);
    axios
      .post("http://localhost:8545/bid", {
        accountAddress: currentAccount,
        contractAddress: currentContract,
        value: bidValue,
        fake,
        secret
      })
      .then(res => {
        setBidRes(res.data.result);
        setIsBiding(false);
      })
      .catch(err => console.log(err));
  };
  console.log(bidRes);
  return (
    <div style={bidStyle.container}>
      <p style={bidStyle.title}>寫價/投標</p>
      <input
        type="number"
        value={bidValue}
        onChange={e => setBidValue(e.target.value)}
      />
      <p>寫價金額: {bidValue}</p>
      <button style={bidStyle.button} onClick={handleBid}>
        {isBiding ? "寫價中..." : "寫價"}
      </button>
      {bidRes ? (
        <div>
          <p style={bidStyle.info}>
            <span style={bidStyle.span}>寫價成功！ transactionHash: </span>
            {bidRes.transactionHash}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Bid;
