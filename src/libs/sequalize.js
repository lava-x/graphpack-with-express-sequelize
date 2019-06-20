import Sequelize from 'sequelize';
import config from 'config';
import _ from 'lodash';

const registerModels = (sequelize) => {
  let models = {};
  const req = require.context('../models', true, /\.js$/);
  req.keys().forEach((filepath) => {
    const fileName = filepath.replace(/^.*(\\|\/|\|js|:)/, '');
    const schemaName = _.camelCase(fileName.split('.')[0]);
    if (!models[schemaName]) {
      models[schemaName] = require(`../models/${fileName}`)(sequelize);
      console.log(`Model '${schemaName}' is registered`);
    } else {
      console.log(`Model '${schemaName}' already existed`);
    }
  });
  return models;
};

const associateModels = (models) => {
  Object.keys(models).forEach((key) => {
    const model = models[key];
    if ('associate' in model) {
      model.associate(models);
    }
  });
};

export default () => {
  // establish  connection - see http://docs.sequelizejs.com/manual/getting-started.html#setting-up-a-connection
  const { database, username, password, host, dialect } = config.database;
  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });
  sequelize
    .sync({ force: true })
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
  const models = registerModels(sequelize);
  associateModels(models);
  return {
    instance: sequelize,
    models,
  };
};
