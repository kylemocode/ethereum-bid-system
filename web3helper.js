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

	const MyContract = new web3.eth.Contract(abi);
    const nonce = await web3.eth.getTransactionCount(accountAddress);
    const txObject = {
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(4700000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei')),
        data: await MyContract.deploy({ data: '0x'+ bytecode, arguments: [bidEnd, revealEnd, accountAddress] }).encodeABI()
    }

	const tx = new TX(txObject, {'chain': 'ropsten'});
    tx.sign(privkey);
    const serializedTX = tx.serialize();
    const rawTX = '0x' + serializedTX.toString('hex');
  
    const txHash = await web3.eth.sendSignedTransaction(rawTX);
  return txHash.contractAddress
  
}

async function bid({
  accountAddress,
  contractAddress,
  value,
  fake,
  secret
}) {
  const contract = new web3.eth.Contract(abi, contractAddress);
  const msg = contract.methods.bid(value, fake, secret).send({
    from: accountAddress,
    gas: 340000
  })
    .on('receipt', function (receipt) {
      return receipt;
    })
    .on('error', function (msg, error) {
      return error.toString();
    })
  return msg;
};

async function reveal({
  accountAddress,
  contractAddress,
  value,
  fake,
  secret
}) {
  const contract = new web3.eth.Contract(abi, contractAddress);
  const msg = contract.methods.reveal(value, fake, secret).send({
    from: accountAddress,
    gas: 340000
  })
    .on('receipt', function (receipt) {
      return receipt;
    })
    .on('error', function (msg, error) {
      return error.toString();
    })
  return msg;
};

async function auctionend({
  accountAddress,
  contractAddress
}) {
  const contract = new web3.eth.Contract(abi, contractAddress);
  const msg = contract.methods.auctionEnd().send({
    from: accountAddress,
    gas: 340000
  })
    .on('receipt', function (receipt) {
      return receipt;
    })
    .on('error', function (error) {
      return error.toString();
    })
  return msg;
};

async function withdraw({
  accountAddress,
  contractAddress
}) {
  const contract = new web3.eth.Contract(abi, contractAddress);
  const msg = contract.methods.withdraw().send({
    from: accountAddress,
    gas: 340000
  })
    .on('receipt', function (receipt) {
      return receipt;
    })
    .on('error', function (msg, error) {
      return error.toString();
    })
  return msg;
};

async function get_account_balance({
  accountAddress
}) {
  const weiBalance = await web3.eth.getBalance(accountAddress)
  web3.utils.fromWei(weiBalance, 'ether').send({
    from: accountAddress
  })
    .on('receipt', function (receipt) {
      return receipt;
    })
    .on('error', function (msg, error) {
      return error.toString();
    })
};


async function highbider({
  accountAddress,
  contractAddress
}) {

  const contract = new web3.eth.Contract(abi, contractAddress);
  const bidder = contract.methods.checkhb().call({
    from: accountAddress,
    gas: 340000
  })
  return bidder;
};

async function highprice({
  accountAddress,
  contractAddress
}) {

  const contract = new web3.eth.Contract(abi, contractAddress);
  const price = contract.methods.checkprice().call({
    from: accountAddress,
    gas: 340000
  })
  return price;
};

async function chckpokt({
  accountAddress,
  contractAddress
}) {

  const contract = new web3.eth.Contract(abi, contractAddress);
  const pokt = contract.methods.checkpocket().call({
    from: accountAddress,
    gas: 340000
  })
  return pokt;
};


module.exports = {
  build,
  bid,
  reveal,
  auctionend,
  withdraw,
  get_account_balance,
  highbider,
  chckpokt,
  highprice
}
