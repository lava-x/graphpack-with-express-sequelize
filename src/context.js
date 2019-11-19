import config from 'config';
import passport from 'passport';

const context = async ({ req, res }) => {
  const { helpers, services, sequelize, facebook } = req;
  const { schemas, instance } = sequelize;

  // remove from request
  delete req.sequelize;
  delete req.services;
  delete req.helpers;
  delete req.facebook;

  return new Promise((resolve) => {
    // verify jwt token from header and extract user info from token
    passport.authenticate('jwt', { session: false }, (err, user) => {
      // return contextual information for resolvers
      resolve({
        req,
        res,
        user, // user info
        config, // values from config file
        schemas, // sequelize model with module name - e.g: user, article
        sequelize: instance, // sequelize instance
        services, // modules data services
        helpers, // helpers e.g: TokenHelper
        facebook, // facebook sdk
      });
    })(req, res);
  });
};

export default context;
