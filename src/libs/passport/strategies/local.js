const config = require('config');
const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');

const LocalStrategy = passportLocal.Strategy;

module.exports = (schemas, services) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await schemas.user.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: 'Please enter a valid email and password',
            });
          }
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }
          return done(null, user, {
            message: 'Logged In Successfully',
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
