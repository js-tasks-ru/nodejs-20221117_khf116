const Koa = require('koa');
const {v4: uuid} = require('uuid');
const Router = require('koa-router');
const handleMongooseValidationError = require('./libs/validationErrors');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');
const {login} = require('./controllers/login');
const {oauth, oauthCallback} = require('./controllers/oauth');
const {me} = require('./controllers/me');
const {register, confirm} = require('./controllers/registration');
const {checkout, getOrdersList} = require('./controllers/orders');
const Session = require('./models/Session');

const app = new Koa();

app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

app.use((ctx, next) => {
  ctx.login = async function(user) {
    const token = uuid();
    await Session.create({token, user, lastVisit: new Date()});

    return token;
  };

  return next();
});

const router = new Router({prefix: '/api'});

router.use(async (ctx, next) => {
  const header = ctx.request.get('Authorization');
  if (!header) return next();

  const token = header.split(' ')[1];
  if (!token) return next();

  const session = await Session.findOne({token}).populate('user');
  if (!session) {
    ctx.throw(401, 'Неверный аутентификационный токен');
  }
  session.lastVisit = new Date();
  await session.save();

  ctx.user = session.user;
  return next();
});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

router.post('/login', login);

router.get('/oauth/:provider', oauth);
router.post('/oauth_callback', handleMongooseValidationError, oauthCallback);

router.get('/me', mustBeAuthenticated, me);

router.post('/register', handleMongooseValidationError, register);
router.post('/confirm', confirm);

router.get('/orders', mustBeAuthenticated, getOrdersList);
router.post('/orders', mustBeAuthenticated, handleMongooseValidationError, checkout);

app.use(router.routes());

module.exports = app;
