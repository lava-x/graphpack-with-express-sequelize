import fs from 'fs';
import defaultModule from './module';
import context from './context';

let rootResolvers = Object.assign({}, defaultModule(context));
const req = require.context('../modules/', true, /\/module.(js|ts)$/);
req.keys().forEach((path) => {
  const fileName = path.split('/');
  const schemaName = fileName[1];
  const esFilePath = `./src/modules/${schemaName}/module.js`;
  const tsFilePath = `./src/modules/${schemaName}/module.ts`;
  if (fs.existsSync(esFilePath) || fs.existsSync(tsFilePath)) {
    const modules = require(`../modules/${schemaName}/module`);
    const resolvers = modules.default(context);
    const { Query, Mutation, ...rest } = resolvers;

    Object.assign(rootResolvers, { ...rest });
    if (Query) {
      Object.assign(rootResolvers.Query, { ...Query });
    }
    if (Mutation) {
      Object.assign(rootResolvers.Mutation, { ...Mutation });
    }

    console.log(`[ Resolver ] '${schemaName}' is registered`);
  }
});

export default rootResolvers;
