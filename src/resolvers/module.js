export default (modules) => {
  const { isAuthenticated } = modules;
  return {
    Query: {
      hello: () => 'world!',
      testExtendsQuery: (obj, args, context) => {
        return args.text;
      },
    },
    Mutation: {},
  };
};
