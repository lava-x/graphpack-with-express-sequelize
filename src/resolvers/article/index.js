import { getUserId } from 'resolvers/auth';

export function getArticles(obj, args, context) {
  const { size, page } = args;
  const SchemaArticle = context.schemas.article;
  return SchemaArticle.findAll();
}

export function getArticleById(obj, args, context) {
  const SchemaArticle = context.schemas.article;
  return SchemaArticle.findByPk(args.id);
}

export async function createArticle(obj, args, context) {
  const user = context.user;
  const SchemaArticle = context.schemas.article;
  const article = await SchemaArticle.create({
    userId: user.id,
    title: args.title,
    body: args.body,
  });
  return article;
}
