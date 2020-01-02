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

const Withdraw = () => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isWithdrawEnd, setIsWithdrawEnd] = useState(false);
  const { currentAccount } = useContext(AccountContext);
  const { currentContract } = useContext(ContractContext);
  const { userStatus, dispatch_status } = useContext(UserStatusContext);
  const { dispatch_bidValue } = useContext(BidValueContext);
  const { dispatch_refund, totalRefund } = useContext(RefundContext);

  const handleWithdraw = () => {
    if (userStatus !== 2) {
      alert("用戶狀態無法重置寫價");
      return;
    }
    if (!currentAccount || !currentContract) {
      alert("請先完成登入與部屬");
      return;
    }
    setIsWithdrawing(true);
    axios
      .post("http://localhost:8545/withdraw", {
        accountAddress: currentAccount,
        contractAddress: currentContract
      })
      .then(res => {
        setIsWithdrawEnd(true);
        setIsWithdrawing(false);
        dispatch_status(setUserStatus(0));
        dispatch_bidValue(setBidValueAction(0));
        dispatch_refund(addRefund(1000));
      })
      .catch(err => console.log(err));
  };
  return (
    <div style={withdrawStyle.container}>
      <p style={withdrawStyle.title}>重置寫價</p>

      <button style={withdrawStyle.button} onClick={handleWithdraw}>
        {isWithdrawing ? "重置寫價中..." : "重置寫價"}
      </button>
      {isWithdrawEnd ? (
        <div>
          <p style={withdrawStyle.info}>
            <span style={withdrawStyle.span}>
              重置寫價成功！ 抵押餘額加入總還款金額
            </span>
          </p>
          <p>總還款金額: {totalRefund} wei</p>
        </div>
      ) : null}
    </div>
  );
};

export default Withdraw;
