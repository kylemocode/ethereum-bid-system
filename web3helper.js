const Web3 = require('web3');
const solc = require('solc');
const accountKeys = require('./accountKeys.json');

const fs = require('fs');
const TX = require('ethereumjs-tx').Transaction;

const web3 = new Web3('http://localhost:8545');
const contract_src = fs.readFileSync("contract/blind_v19.sol", 'utf8');
const contract_output = solc.compile(contract_src);

const bytecode = contract_output.contracts[':BlindAuction'].bytecode;
const abi = JSON.parse(contract_output.contracts[':BlindAuction'].interface);


async function build(accountAddress, bidEnd, revealEnd){
  
  const privkey = Buffer.from(accountKeys.private_keys[accountAddress], 'hex');

	let MyContract = new web3.eth.Contract(abi);
    const nonce = await web3.eth.getTransactionCount(accountAddress);
    const txObject = {
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(4700000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei')),
        data: await MyContract.deploy({ data: '0x'+ bytecode, arguments: [bidEnd, revealEnd, accountAddress] }).encodeABI()
    }

	var tx = new TX(txObject, {'chain': 'ropsten'});
    tx.sign(privkey);
    const serializedTX = tx.serialize();
    const rawTX = '0x' + serializedTX.toString('hex');
  
    const txHash = await web3.eth.sendSignedTransaction(rawTX);
  return txHash.contractAddress
  
}

module.exports = {
  build,
}