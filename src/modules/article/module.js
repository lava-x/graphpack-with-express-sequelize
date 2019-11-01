import { combineResolvers } from 'graphql-resolvers';
import { getArticleById, getArticles, createArticle } from './resolvers';

export default (modules) => {
  const { isAuthenticated } = modules;
  return {
    Query: {
      getArticle: getArticleById,
      getArticles,
    },
    Mutation: {
      createArticle: combineResolvers(isAuthenticated(), createArticle),
    },
  };
};
