const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = [];

async function logger(ctx, next) {
  const start_time = Date.now();

  await next();

  console.log(ctx.method, ctx.url, 'time spent:', Date.now() - start_time);
}

app.use(async (ctx, next) => {
  await next();

  if (ctx.status === 404 && ctx.body === undefined) {
    ctx.status = 404;
    ctx.body = 'unknown route';
  }
});

router.get('/subscribe', logger, async (ctx, next) => {
  // console.log('subscribe');
  const promise = new Promise((resolve, reject) => {
    ctx.state._resolve = resolve;
    clients.push(ctx);

    ctx.req.on('close', () => {
      clients.splice(clients.indexOf(ctx), 1);
      ctx.body = 'connection closed';
      reject;
    });
  });

  await promise;
});

router.post('/publish', logger, async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.body = 'empty message';
    return next();
  }

  clients.forEach((ctx) => {
    ctx.body = message;
    ctx.state._resolve();
  });

  clients = [];
  ctx.body = 'Ok';
});

app.use(router.routes());

module.exports = app;
