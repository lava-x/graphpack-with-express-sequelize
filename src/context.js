import config from 'config';
import passport from 'passport';
import TokenHelper from 'helpers/TokenHelper';
import sequalize from 'libs/sequalize';
import initalizePassport from 'libs/passport';

// establish sequalize connection
const { models, instance } = sequalize();
const token = config.token;
const tokenHelper = new TokenHelper(token.secret, token.jwt);
// initialize passport with strategies
initalizePassport(models);

const context = async ({ req, res }) => {
  return new Promise((resolve) => {
    // verify jwt token from header and extract user info from token
    passport.authenticate('jwt', { session: false }, (err, user) => {
      // return contextual information for resolvers
      resolve({
        req,
        res,
        user, // user info
        config, // values from config file
        schemas: models, // sequalize model with file name - e.g: user, article
        sequalize: instance, // sequalize instance
        helpers: {
          token: tokenHelper,
        },
      });
    })(req, res);
  });
};

export default context;
