const { resolve } = require('path');
const config = require('config');
const FB = require('fb');
const TokenHelper = require(resolve('./src/helpers/TokenHelper'));
// libs
const { initialize } = require(resolve('./src/libs/sequalize'));
const initalizeServices = require(resolve('./src/libs/services'));
const initalizePassport = require(resolve('./src/libs/passport'));

module.exports = () => {
  /**
   * =======================
   * Setup helpers
   * =======================
   * */

  // --- setup token helper
  const tokenHelper = new TokenHelper(config.token.secret, config.token.jwt);

  // --- helpers to use in application
  const helpers = {
    Token: tokenHelper,
  };

  /**
   * =======================
   * Setup Instance / Resources
   * =======================
   * */
  const resources = {};

  // create mongoose instance, model
  const { schemas, instance } = initialize(helpers, resources);

  // initialize services
  const services = initalizeServices(schemas, helpers, resources);

  // initialize passport strategies
  initalizePassport(schemas, services, helpers);

  // initialize Facebook SDK instance
  const facebook = new FB.Facebook({
    version: 'v4.0',
    appId: config.facebook.appID,
    appSecret: config.facebook.appSecret,
  });

  // initialize passport with strategies
  return {
    mongoose: {
      schemas, // mongoose model with file name - e.g: user, article
      instance, // mongoose instance
    },
    services,
    helpers,
    facebook,
  };
};
