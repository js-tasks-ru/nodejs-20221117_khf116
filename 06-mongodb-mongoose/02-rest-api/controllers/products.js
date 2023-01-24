const Product = require('../models/Product');
const mapProduct = require('../mappers/product.js');
const { default: mongoose } = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();

  const products = await Product.find({subcategory: subcategory});
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;
  if (!mongoose.isValidObjectId(productId))
    ctx.throw(400, 'invalid ObjectId');

  const product = await Product.findById(productId);

  if (!product)
    ctx.throw(404, 'product not found');

  ctx.body = {product: mapProduct(product)};
};

module.exports.productAdd = async function productAdd(ctx, next) {
  const nowString = new Date().toString();
  const product = await Product.create({
    title: 'Product-' + nowString,
    images: ['image1', 'image2'],
    category: '63a3be6719e712e5942b2e00',
    subcategory: '63a3be6719e712e5942b2e01',
    price: 10,
    description: 'Description'
  });
  console.log(product);
  ctx.body = {product: product};
};
