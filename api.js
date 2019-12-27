const Koa = require('koa');
const Router = require('koa-router');
var bodyParser = require('koa-bodyparser');

const accountKeys = require('./accountKeys.json');
const transactions = require('./web3helper.js');

const app = new Koa();
const router = new Router();
app.use(bodyParser());

router.get('/accounts', async ctx => {
  ctx.body = {
    addresses: Object.keys(accountKeys.addresses),
  };
})

router.post('/build', async (ctx) => {
  const {
    accountAddress,
    bidEnd,
    revealEnd,
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!bidEnd) {
    ctx.throw(400, 'bidEnd required')
  } else if (!revealEnd) {
    ctx.throw(400, 'revealEnd required')
  }
  const contractAddress = await transactions.build(accountAddress, bidEnd, revealEnd);
  ctx.body = {
    contractAddress,
  }
})


router.post('/bid', async (ctx) => {
  const {
    accountAddress,
    contractAddress,
    value,
    fake,
    secret,
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!contractAddress) {
    ctx.throw(400, 'contractAddress required')
  } else if (!value) {
    ctx.throw(400, 'value required')
  } else if (!fake) {
    ctx.throw(400, 'fake required')
  } else if (!secret) {
    ctx.throw(400, 'secret required')
  }
  const msg = await transactions.bid(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.post('/reveal', async (ctx) => {
  const {
    accountAddress,
    contractAddress,
    value,
    fake,
    secret,
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!contractAddress) {
    ctx.throw(400, 'contractAddress required')
  } else if (!value) {
    ctx.throw(400, 'value required')
  } else if (!fake) {
    ctx.throw(400, 'fake required')
  } else if (!secret) {
    ctx.throw(400, 'secret required')
  }
  const msg = await transactions.reveal(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.post('/auctionend', async (ctx) => {
  const {
    accountAddress,
    contractAddress
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!contractAddress) {
    ctx.throw(400, 'contractAddress required')
  } 
  const msg = await transactions.auctionend(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.post('/withdraw', async (ctx) => {
  const {
    accountAddress,
    contractAddress
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!contractAddress) {
    ctx.throw(400, 'contractAddress required')
  } 
  const msg = await transactions.withdraw(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.post('/get_account_balance', async (ctx) => {
  const {
    accountAddress
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } 
  const msg = await transactions.get_account_balance(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.post('/highbider', async (ctx) => {
  const {
    accountAddress,
    contractAddress
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!contractAddress) {
    ctx.throw(400, 'contractAddress required')
  } 
  const msg = await transactions.checkhb(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.post('/chckpokt', async (ctx) => {
  const {
    accountAddress,
    contractAddress
  } = ctx.request.body;
  if (!accountAddress) {
    ctx.throw(400, 'accountAddress required')
  } else if (!contractAddress) {
    ctx.throw(400, 'contractAddress required')
  } 
  const msg = await transactions.chckpokt(ctx.request.body);
  ctx.body = {
    result: msg,
  }
})

router.get('/login', async(ctx) => {     
  ctx.body = `     
      <form method="POST" action="/login">             
          <label>UserName</label>         
          <input name="user" /><br/>         
          <button type="submit">submit</button>       
      </form>     
  `; 
});

app
  .use(router.routes())
  .use(router.allowedMethods());
  //.use(async function(ctx) { ctx.body = 'Hello Koa2'; });

app.listen(8545, () => {
  console.log('Server started on http://localhost:8545');
});
