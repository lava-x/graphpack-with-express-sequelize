const express = require('express');
const passport = require('passport');

/**
 * ==============================
 * Create express instance
 * @param {string} mode - production, development
 * ==============================
 */
const createInstance = (mode) => {
  const init = require('./init');

  // --- initialize express instance
  const app = express();
  const configuration = init();

  // --- Initialize passport middleware - see http://www.passportjs.org/docs/configure/
  app.use(passport.initialize());

  // --- Route handling
  app.use('*', function(req, res, next) {
    Object.assign(req, configuration);
    next();
  });

  app.get('/health_check', (req, res) => {
    res.send('OK');
  });

  return app;
};

/**
 * ==============================
 * Graphpack configuration
 * ==============================
 */
module.exports = (mode) => {
  const IS_DEV = mode !== 'production';
  const app = createInstance(mode);

  return {
    server: {
      port: 4100,
      introspection: IS_DEV,
      playground: IS_DEV,
      applyMiddleware: {
        app,
        path: '/graphql', // default
      },
    },
  };
};
