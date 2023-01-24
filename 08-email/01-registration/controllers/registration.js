const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const userEmail = ctx.request.body.email;
  const user = new User({
    token: token,
    email: userEmail,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
  });
  await user.setPassword(ctx.request.body.password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: token},
    to: userEmail,
    subject: 'Подтвердите почту',
  });

  ctx.body = {
    status: 'ok'
  };
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;
  // const user = await User.findOneAndUpdate(
  //   { verificationToken: verificationToken },
  //   { verificationToken: null },
  //   { returnDocument: 'after' }
  // );

  const user = await User.findOne({ verificationToken: verificationToken });

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    return;
  }

  user.verificationToken = undefined;
  await user.save();

  // console.log(user);

  const token = await ctx.login(user);
  ctx.body = {token};

};
