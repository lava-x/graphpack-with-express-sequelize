export function getPosts(obj, args, context) {
  const { size, page } = args;
  const SchemaPost = context.schemas.post;
  return SchemaPost.findAll();
}

export function getPost(obj, args, context) {
  const SchemaPost = context.schemas.post;
  return SchemaPost.findByPk(args.id);
}

export async function createPost(obj, args, context) {
  const SchemaPost = context.schemas.post;
  const user = context.user;
  const post = await SchemaPost.create({
    user: user.id,
    title: args.title,
    content: args.content,
  });
  return post;
}
