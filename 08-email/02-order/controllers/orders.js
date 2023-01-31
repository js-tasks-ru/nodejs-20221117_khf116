const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');
const mapOrderConfirmation = require('../mappers/orderConfirmation.js');
const mapOrder = require('../mappers/order.js');

module.exports.checkout = async function checkout(ctx, next) {
  const product = await Product.findById(ctx.request.body.product);

  const user = ctx.user;
  const order = new Order({
    user: user,
    product: product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address
  });
  await order.save();

  await sendMail({
    template: 'order-confirmation',
    locals: mapOrderConfirmation(order, product),
    to: user.email,
    subject: 'Подтверждение заказа',
  });

  ctx.body = {
    order: order.id
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;
  const orders = await Order.find({ user: user });
  ctx.body = {orders: orders.map(mapOrder)};
};
