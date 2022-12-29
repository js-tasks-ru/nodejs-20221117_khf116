const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email)
    return done(null, false, 'Не указан email');

  let user = await User.findOne({ email: email }).exec();
  if (user)
    return done(null, user);

  try {
    user = await User.create({
      email: email,
      displayName: displayName
    });

    done(null, user);
  } catch (error) {
    done(error, false);
  }

  // done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
