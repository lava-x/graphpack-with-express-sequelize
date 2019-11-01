import fs from 'fs';
import defaultModule from './module';
import context from './context';

let rootResolvers = Object.assign({}, defaultModule(context));
const req = require.context('../modules/', true, /\/module.js$/);
req.keys().forEach((path) => {
  const fileName = path.split('/');
  const schemaName = fileName[1];
  const filePath = `./src/modules/${schemaName}/module.js`;
  if (fs.existsSync(filePath)) {
    const modules = require(`../modules/${schemaName}/module.js`);
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
