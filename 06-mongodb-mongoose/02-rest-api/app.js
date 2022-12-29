const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById, productAdd} = require('./controllers/products');
const {categoryList, categoryAdd} = require('./controllers/categories');

const app = new Koa();

async function mongoTest1() {
  const mongoose = require('mongoose');
  const schema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
  });

  const Model = mongoose.model('Product', schema);

  await mongoose.connect('mongodb://127.0.0.1:27017/mytest');

  const product = await Model.find();
  console.log(product);
};
// mongoTest1();


async function mongoTest2() {
  const mongoose = require('mongoose');
  const schema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
  });

  // const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/mytest2');

  const Model = connection.model('test1', schema);

  const product = await Model.find();
  console.log(product);
};
// mongoTest2();

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

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

router.post('/categoryAdd', categoryAdd);
router.post('/productAdd', productAdd);

app.use(router.routes());

module.exports = app;
