import { combineResolvers } from 'graphql-resolvers';
import { getPostComments, getComment, createComment } from './resolvers';

export default (modules) => {
  const { isAuthenticated } = modules;
  return {
    Query: {
      getComment,
      getPostComments,
    },
    Mutation: {
      createComment: combineResolvers(isAuthenticated(), createComment),
    },
  };
};
