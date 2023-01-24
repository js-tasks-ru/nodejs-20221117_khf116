const Product = require('../models/Product');
const mapProduct = require('../mappers/product.js');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) return next();

  const products = await Product.find({ $text: { $search: query } });
  ctx.body = {products: products.map(mapProduct)};
};
