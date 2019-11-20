const fs = require('fs');
const _ = require('lodash');
const { resolve } = require('path');
const requireContext = require('require-context');

module.exports = (models, helpers, resources) => {
  let services = {};
  const req = requireContext(resolve('./src/modules'), true, /\/services.(js|ts)$/);
  req.keys().forEach((path) => {
    const fileName = path.split('/');
    const moduleName = _.camelCase(fileName[0]);
    const esFilePath = `./src/modules/${moduleName}/services.js`;
    const tsFilePath = `./src/modules/${moduleName}/services.ts`;
    if (fs.existsSync(esFilePath) || fs.existsSync(tsFilePath)) {
      if (!services[moduleName]) {
        const servicePath = `./src/modules/${moduleName}/service`;
        services[moduleName] = require(resolve(servicePath))(
          models,
          helpers,
          services,
          resources
        );
        console.log(`[ Service ] '${moduleName}' is registered`);
      } else {
        console.log(`[ Service ] '${moduleName}' already existed`);
      }
    }
  });

  return services;
};
