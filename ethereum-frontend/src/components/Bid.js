import React, { useContext, useState } from "react";
import { bidStyle } from "./style";
import { ContractContext } from "../contexts/ContractContext";
import { AccountContext } from "../contexts/AccountContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import { BidValueContext } from "../contexts/BidValueContext";
import { fake, secret } from "../secret";
import { setUserStatus } from "../actions/status";
import { setBidValueAction } from "../actions/bid";
import axios from "axios";

const Bid = () => {
  const [bidValue, setBidValue] = useState(0);
  const [isBiding, setIsBiding] = useState(false);
  const [bidRes, setBidRes] = useState(null);
  const { currentAccount } = useContext(AccountContext);
  const { currentContract } = useContext(ContractContext);
  const { userStatus, dispatch_status } = useContext(UserStatusContext);
  const { dispatch_bidValue } = useContext(BidValueContext);

  const handleBid = () => {
    if (userStatus !== 0) {
      alert("用戶狀態無法寫價");
      return;
    }
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
        dispatch_status(setUserStatus(1));
        dispatch_bidValue(setBidValueAction(bidValue));
      })
      .catch(err => console.log(err));
  };

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
            <span style={bidStyle.span}>寫價成功！抵押1000wei </span>
          </p>
          <span>TransactionHash: {bidRes.transactionHash}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Bid;
