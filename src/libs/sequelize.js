const fs = require('fs');
const _ = require('lodash');
const { resolve } = require('path');
const config = require('config');
const Sequelize = require('sequelize');
const requireContext = require('require-context');
const execSync = require('child_process').execSync;

const DataTypes = Sequelize.DataTypes;

// === Register sequelize schemas
const registerSchemas = (sequelize) => {
  let schemas = {};
  const req = requireContext(resolve('./src/modules'), true, /\/model.js$/);
  req.keys().forEach((path) => {
    const fileName = path.split('/');
    const schemaName = _.camelCase(fileName[0]);
    const filePath = `./src/modules/${schemaName}/model.js`;
    if (fs.existsSync(filePath)) {
      if (!schemas[schemaName]) {
        schemas[schemaName] = require(resolve(filePath))(sequelize, DataTypes);
        console.log(`[ Model ] '${schemaName}' is registered`);
      } else {
        console.log(`[ Model ] '${schemaName}' already existed`);
      }
    }
  });
  return schemas;
};

// === Associate sequelize schemas relation
const associateSchemas = (schemas) => {
  Object.keys(schemas).forEach((key) => {
    const model = schemas[key];
    if ('associate' in model) {
      model.associate(schemas);
    }
  });
};

const seeding = () => {
  return new Promise((resolve, reject) => {
    try {
      execSync('node_modules/.bin/sequelize db:seed:all', { stdio: 'inherit' });
      resolve('OK');
    } catch (e) {
      console.log('Failed to perform seeding');
      console.log(JSON.stringify(e, null, 8));
      reject(e);
    }
  });
};

const runSeedResource = (schemas, sequelize, wipeData) => {
  const req = requireContext(resolve('./seeding'), true, /\.js$/);
  // req.keys().forEach((path) => {
  //   const fileName = path.split('.');
  //   const schemaName = _.camelCase(fileName[0]);
  //   const filePath = `./seeding/${schemaName}.js`;
  //   if (fs.existsSync(filePath)) {
  //     require(resolve(filePath))({ schemas, sequelize, wipeData }, () => {
  //       console.log(`[ Seeding ] '${schemaName}' has succeed`);
  //     });
  //   }
  // });
};

module.exports = {
  initialize: (helpers, resources) => {
    // establish  connection - see http://docs.sequelizejs.com/manual/getting-started.html#setting-up-a-connection
    const {
      database,
      username,
      password,
      host,
      dialect,
      dialectOptions,
      timezone,
    } = config.database;
    const sequelize = new Sequelize(database, username, password, {
      host,
      dialect /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
      dialectOptions /* https://github.com/sequelize/sequelize/issues/854#issuecomment-294385560 */,
      timezone,
      logging: false,
    });

    let wipeData = false;

    // WARNING: DONT EDIT THIS
    if (config.util.getEnv('NODE_ENV') !== 'development') {
      // MAKE SURE THIS IS ALWAYS FALSE AND ONLY FALSE
      wipeData = false;
    }

    // register schemas
    const schemas = registerSchemas(sequelize);

    // associate schemas
    associateSchemas(schemas);

    sequelize
      .sync({
        force: wipeData,
      })
      .then(async () => {
        console.log('Database connection has been established successfully.');
      })
      .catch((err) => {
        console.log('Unable to connect to the database', err);
        console.log(JSON.stringify(err, null, 8));
      });

    return {
      instance: sequelize,
      schemas,
    };
  },
};
