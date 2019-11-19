const fs = require('fs');
const _ = require('lodash');
const { resolve } = require('path');
const requireContext = require('require-context');

module.exports = (models, helpers, resources) => {
  let services = {};
  const req = requireContext(resolve('./src/modules'), true, /\/services.js$/);
  req.keys().forEach((path) => {
    const fileName = path.split('/');
    const moduleName = _.camelCase(fileName[0]);
    const filePath = `./src/modules/${moduleName}/services.js`;
    if (fs.existsSync(filePath)) {
      if (!services[moduleName]) {
        services[moduleName] = require(resolve(filePath))(
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
