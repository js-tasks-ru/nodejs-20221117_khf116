const Message = require('../models/Message');
const mapMessage = require('../mappers/message.js');

module.exports.messageList = async function messages(ctx, next) {
  const user = ctx.user;
  const messages = await Message.find(
    { user: user.displayName },
    null,
    { limit: 20, sort: [{ date: -1 }] }
  );

  ctx.body = {messages: messages.map(mapMessage)};
};
