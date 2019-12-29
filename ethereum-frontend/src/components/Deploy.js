import React, { useContext, useState } from "react";
import { deployStyle } from "./style";
import { AccountContext } from "../contexts/AccountContext";
import axios from "axios";

const Deploy = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [contract, setContract] = useState("");
  const { currentAccount, dispatch } = useContext(AccountContext);

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
        setIsDeploying(false);
        setIsDeployed(true);
        setContract(res.data.contractAddress);
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
      {contract ? (
        <p style={deployStyle.successMsg}>部署成功！合約位置： {contract}</p>
      ) : null}
    </div>
  );
};

export default Deploy;
