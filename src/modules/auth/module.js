import { combineResolvers } from 'graphql-resolvers';
import { signin, signup } from './resolvers';

export default (modules) => {
  const { isAuthenticated } = modules;
  return {
    Mutation: {
      signin,
      signup,
    },
  };
};
