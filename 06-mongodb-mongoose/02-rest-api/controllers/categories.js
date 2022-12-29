const Category = require('../models/Category');
const mapCategory = require('../mappers/category.js');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({}).populate('subcategories');
  ctx.body = {categories: categories.map(mapCategory)};
};


module.exports.categoryAdd = async function categoryAdd(ctx, next) {
  const nowString = new Date().toString();
  const category = await Category.create({
    title: 'Category-' + nowString,
    subcategories: [{
      title: 'Subcategory-' + nowString,
    }],
  });
  console.log(category);
  ctx.body = {category: category};
};
