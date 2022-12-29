const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    session: false
  },
  async function(email, password, done) {
    const user = await User.findOne({ email: email }).exec();

    if (!user)
      return done(null, false, 'Нет такого пользователя');

    if (!await user.checkPassword(password))
      return done(null, false, 'Неверный пароль');

    return done(null, user);

    // done(null, false, 'Стратегия подключена, но еще не настроена');
  },
);
