const config = require('config');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

module.exports = (schemas, services) => {
  // see https://github.com/themikenicholson/passport-jwt for options
  const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.token.secret,
    jsonWebTokenOptions: config.token.verify || {},
  };
  passport.use(
    new JWTStrategy(options, async (payload, done) => {
      try {
        const user = await schemas.user.findById(payload.userId);
        return done(null, user);
      } catch (err) {
        console.log('Failed to validate jwt');
        console.log(JSON.stringify(err, null, 8));
        return done(err);
      }
    })
  );
};
