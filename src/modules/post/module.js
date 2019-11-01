import { combineResolvers } from 'graphql-resolvers';
import { getPost, getPosts, createPost } from './resolvers';

export default (modules) => {
  const { isAuthenticated } = modules;
  return {
    Query: {
      getPost,
      getPosts,
    },
    Mutation: {
      createPost: combineResolvers(isAuthenticated(), createPost),
    },
    Post: {
      comments: function(obj, args, context, info) {
        return context.schemas.comment.find({ post: obj.id });
      },
    },
  };
};
