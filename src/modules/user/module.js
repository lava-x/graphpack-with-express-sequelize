import { combineResolvers } from 'graphql-resolvers';
import { getProfile, getUser, getUsers } from './resolvers';

export default (modules) => {
  const { isAuthenticated } = modules;
  return {
    Query: {
      profile: getProfile,
      getUser: combineResolvers(isAuthenticated('admin'), getUser),
      getUsers: combineResolvers(isAuthenticated('admin'), getUsers),
    },
  };
};
