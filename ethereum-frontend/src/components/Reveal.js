import React, { useContext, useState } from "react";
import { revealStyle } from "./style";
import { ContractContext } from "../contexts/ContractContext";
import { AccountContext } from "../contexts/AccountContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import { BidValueContext } from "../contexts/BidValueContext";
import { fake, secret } from "../secret";
import { setUserStatus } from "../actions/status";
import axios from "axios";

const Reveal = () => {
  const [revealRes, setRevealRes] = useState(null);
  const [revealValue, setRevealValue] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRevealEnd, setIsRevealEnd] = useState(false);
  const { currentAccount } = useContext(AccountContext);
  const { currentContract } = useContext(ContractContext);
  const { userStatus, dispatch_status } = useContext(UserStatusContext);
  const { bidValue } = useContext(BidValueContext);

  const handleReveal = () => {
    if (userStatus !== 1) {
      alert("用戶狀態無法確認寫價");
      return;
    }
    if (bidValue !== revealValue) {
      alert("金額與寫價金額不相符");
      return;
    }
    if (!currentAccount || !currentContract) {
      alert("請先完成登入與部屬");
      return;
    }

    setIsRevealing(true);
    axios
      .post("http://localhost:8545/reveal", {
        accountAddress: currentAccount,
        contractAddress: currentContract,
        value: revealValue,
        fake,
        secret
      })
      .then(res => {
        setRevealRes(res.data.result);
        setIsRevealEnd(true);
        setIsRevealing(false);
        dispatch_status(setUserStatus(0));
      })
      .catch(err => console.log(err));
  };
  return (
    <div style={revealStyle.container}>
      <p style={revealStyle.title}>確認出價</p>
      <p>寫價金額: {bidValue}</p>
      <input
        type="number"
        value={revealValue}
        onChange={e => setRevealValue(e.target.value)}
      />
      <p>確認出價金額: {revealValue}</p>
      <button style={revealStyle.button} onClick={handleReveal}>
        {isRevealing ? "確認出價中..." : "確認出價"}
      </button>
      {isRevealEnd ? (
        <div>
          <p style={revealStyle.info}>
            <span style={revealStyle.span}>確認寫價成功！ </span>
          </p>
          <span>TransactionHash: {revealRes.transactionHash}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Reveal;
