import React, { useContext, useState } from "react";
import { deployStyle } from "./style";
import { ContractContext } from "../contexts/ContractContext";
import { AccountContext } from "../contexts/AccountContext";
import { setCurrentContract } from "../actions/contract";
import axios from "axios";

const Deploy = () => {
  const [isDeploying, setIsDeploying] = useState(false);

  const [hasError, setHasError] = useState(false);
  const { currentAccount } = useContext(AccountContext);
  const { currentContract, dispatch_contract } = useContext(ContractContext);

  const handleDeploy = () => {
    setIsDeploying(true);
    setHasError && setHasError(false);
    axios
      .post("http://localhost:8545/build", {
        accountAddress: currentAccount,
        bidEnd: 10,
        revealEnd: 100000
      })
      .then(res => {
        dispatch_contract(setCurrentContract(res.data.contractAddress));
        setIsDeploying(false);
      })
      .catch(err => setHasError(true));
  };

  return (
    <div style={deployStyle.container}>
      <p style={deployStyle.title}>合約部署</p>

      {currentAccount ? (
        <button style={deployStyle.button} onClick={handleDeploy}>
          {isDeploying ? "部署中..." : "部署"}
        </button>
      ) : (
        <p style={deployStyle.message}>請先登入</p>
      )}
      {currentContract ? (
        <p style={deployStyle.successMsg}>
          部署成功！合約位置： {currentContract}
        </p>
      ) : null}
      {hasError ? <p>部署失敗</p> : null}
    </div>
  );
};

export default Deploy;
