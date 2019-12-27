const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const TX = require('ethereumjs-tx').Transaction;


// // Connect to local node
const web3 = new Web3('http://localhost:8545');
var contracts_path = "contract/blind_v19.sol";
var input = fs.readFileSync(contracts_path, 'utf8');


// 1 activates the optimiser
var output = solc.compile(input);
//console.log(output);

const bytecode = output.contracts[':BlindAuction'].bytecode;
const abi = JSON.parse(output.contracts[':BlindAuction'].interface);
//(console.log(bytecode);
//console.log(abi);


// deploy a contract
async function build(abi, privke, bidend, revealend, who){

	let accounts = await web3.eth.getAccounts()

	//const privke= "d19d68c5009a8801681f3c38f82c9d49903c98ec5d7da398f67808de383deb60";
	const account = accounts[who]; 
	const privkey = Buffer.from(privke, 'hex');

	if (web3.eth.personal.unlockAccount(account, privke)) {
		console.log(`${account} is unlocaked`);
	}else{
		console.log(`unlock failed, ${account}`);
	}

	//let gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode});
	//console.log('gasEstimate = ' + gasEstimate); //'20000000000'
	console.log('deploying contract...');
	//let MyContract = new web3.eth.Contract(abi, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {from: account  , gasPrice: '20000000000', data: bytecode, gas: 100});
	
	let MyContract = new web3.eth.Contract(abi);
    const nonce = await web3.eth.getTransactionCount(accounts[who]);
    const txObject = {
        nonce:    web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(4700000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('1', 'gwei')),
        data: await MyContract.deploy({ data: '0x'+ bytecode, arguments: [bidend, revealend, accounts[who]] }).encodeABI()
    }

	var tx = new TX(txObject, {'chain': 'ropsten'});
	//let privke = Buffer.from(privkey, 'hex');
    tx.sign(privkey);
    const serializedTX = tx.serialize();
    const rawTX = '0x' + serializedTX.toString('hex');
  
    const txHash = await web3.eth.sendSignedTransaction(rawTX)
	console.log(txHash);

	return txHash.contractAddress;
}



async function bid(abi, contractAddress, value, fake, secret, i) {

    let contract = new web3.eth.Contract(abi, contractAddress);
	
	//const {SHA3} = require('sha3')
	//ar blindedBid = web3.utils.sha3(value, fake, secret);
	
	let accounts = await web3.eth.getAccounts()
	//web3.eth.personal.unlockAccount(account, privkey)
	contract.methods.bid(value, fake, secret).send({
		from: accounts[i],
		gas: 340000
	})
		.on('receipt', function (receipt) {
			console.log('success bid')
			console.log(receipt);
			
		})
		.on('error', function (error) {
			 console.log(error.toString());
		})	
	
};

async function reveal(abi, contractAddress, value, fake, secret, i) {
	let contract = await new web3.eth.Contract(abi, contractAddress);
	let accounts = await web3.eth.getAccounts()
	if ( fake==1 ){
		fake = 0;
	}
	contract.methods.reveal(value, fake, secret).send({
		from: accounts[i],
		gas: 340000
	})
		.on('receipt', function (receipt) {
			console.log('success reveal')
			console.log(receipt);
			
		})
		.on('error', function (error) {
			console.log('fail reveal')
			console.log(error.toString());
		})	

};

async function auctionend(abi, contractAddress, who) {
	let contract = await new web3.eth.Contract(abi, contractAddress);
	let accounts = await web3.eth.getAccounts()
	
	contract.methods.auctionEnd().send({
		from: accounts[who],
		gas: 340000
	})
		.on('receipt', function (receipt) {
			console.log('success end')
			console.log(receipt);
		})
		.on('error', function (error) {
			console.log('fail end')
			console.log(error.toString());
		})	

};

async function withdraw(abi, contractAddress, who) {
	let contract = await new web3.eth.Contract(abi, contractAddress);
	let accounts = await web3.eth.getAccounts()
	
	contract.methods.withdraw().send({
		from: accounts[who],
		gas: 340000
	})
		.on('receipt', function (receipt) {
			console.log('success withdraw')
			console.log(receipt);
			
		})
		.on('error', function (error) {
			console.log('fail withdraw')
			console.log(error.toString());
		})	
};

// get account balance
async function get_account_balance(who) {

	let accounts = await web3.eth.getAccounts()
	let weiBalance = await web3.eth.getBalance(accounts[who])
	ethBalance = web3.utils.fromWei(weiBalance, 'ether')

	console.log("Get Balance", ethBalance);
};

async function highbid(abi, contractAddress, who) {
	let contract = await new web3.eth.Contract(abi, contractAddress);
	let accounts = await web3.eth.getAccounts()
	
	let a = await contract.methods.checkprice().call({
		from: accounts[who]
	})
	console.log("High", a);
};


// check highest bidder
async function highbider(abi, contractAddress, who) {
	let contract = await new web3.eth.Contract(abi, contractAddress);
	let accounts = await web3.eth.getAccounts()
	
	let a = await contract.methods.checkhb().call({
		from: accounts[who]
	})
	console.log("Highbidder", a);
};


// Check pocket of given account
async function chckpokt(abi, contractAddress, who) {
	let contract = await new web3.eth.Contract(abi, contractAddress);
	let accounts = await web3.eth.getAccounts()
	
	let a = await contract.methods.checkpocket().call({
		from: accounts[who]
	})
	console.log("pocket", a);
};


// async function main(){

// 	const contract_address = await build(abi, "1e703f9bb3a226f70e455b9bea5a40990a960e286a9ee8511550d47418cca951" ,10, 10, 0);
	
// 	await bid(abi, contract_address, 100, 0, '0xa', 5);
// 	await bid(abi, contract_address, 20, 0, '0xb', 6);

// 	await reveal(abi, contract_address, 100, 0, '0xa', 5);
// 	await reveal(abi, contract_address, 20, 0, '0xb', 6);


// }

// main().then(get_account_balance(5));

