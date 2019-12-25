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
    addresses: accountKeys.addresses,
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


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(9521, () => {
  console.log('Server started on localhost:9521');
});