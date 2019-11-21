const { resolve } = require('path');
const requireContext = require('require-context');

module.exports = (schemas, services, helpers) => {
  // initialize available strategies under folder `strategies`
  const path = resolve('./src/libs/passport/strategies');
  const req = requireContext(path, true, /\.(ts|js)$/);
  req.keys().forEach((filepath) => {
    const fileName = filepath.replace(/^.*(\\|\/|\|ts|js|:)/, '');
    const strategyNane = fileName.split('.')[0];
    require(`./strategies/${fileName}`)(schemas, services, helpers);
    console.log(`[ Passport strategy ] '${strategyNane}' is registered`);
  });
};
