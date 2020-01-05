import React, { useContext, useState } from "react";
import { withdrawStyle } from "./style";
import { ContractContext } from "../contexts/ContractContext";
import { AccountContext } from "../contexts/AccountContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import { BidValueContext } from "../contexts/BidValueContext";
import { RefundContext } from "../contexts/RefundContext";
import { setUserStatus } from "../actions/status";
import { setBidValueAction } from "../actions/bid";
import { addRefund } from "../actions/refund";
import axios from "axios";

const AuctionEnd = () => {
  const [isAuctionEnding, setIsAuctionEnding] = useState(false);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [highbider, setHighbider] = useState(null);
  const [highprice, setHighprice] = useState(null);
  const { currentAccount } = useContext(AccountContext);
  const { currentContract } = useContext(ContractContext);
  const { userStatus, dispatch_status } = useContext(UserStatusContext);

  const handleAuctionEnd = () => {
    if (userStatus !== 2) {
      alert("用戶狀態無法關閉寫標系統");
      return;
    }
    if (!currentAccount || !currentContract) {
      alert("請先完成登入與部屬");
      return;
    }
    setIsAuctionEnding(true);
    axios
      .post("http://localhost:8545/auctionend", {
        accountAddress: currentAccount,
        contractAddress: currentContract
      })
      .then(res => {
        setIsAuctionEnded(true);
        setIsAuctionEnding(false);
      })
      .catch(err => console.log(err));
    axios
      .post("http://localhost:8545/highbider", {
        accountAddress: currentAccount,
        contractAddress: currentContract
      })
      .then(res => {
        setHighbider(res.data.result);
      })
      .catch(err => console.log(err));
    axios
      .post("http://localhost:8545/highprice", {
        accountAddress: currentAccount,
        contractAddress: currentContract
      })
      .then(res => {
        setHighprice(res.data.result);
      })
      .catch(err => console.log(err));
  };
  return (
    <div style={withdrawStyle.container}>
      <p style={withdrawStyle.title}>關閉寫標系統</p>

      <button style={withdrawStyle.button} onClick={handleAuctionEnd}>
        {isAuctionEnding ? "關閉寫標系統中..." : "關閉寫標系統"}
      </button>
      {isAuctionEnded ? (
        <div>
          <p style={withdrawStyle.info}>
            <span style={withdrawStyle.span}>
              關閉寫標系統成功！ 
            </span>
          </p>
          <p>得標者: {highbider} </p>
          <p>得標金額: {highprice} wei</p>
        </div>
      ) : null}
    </div>
  );
};

export default AuctionEnd;
