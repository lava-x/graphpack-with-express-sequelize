export function getPostComments(obj, args, context) {
  const SchemaComment = context.schemas.comment;
  return SchemaComment.findAll({ where: { postId: args.post } });
}

export function getComment(obj, args, context) {
  const SchemaComment = context.schemas.comment;
  return SchemaComment.findByPk(args.id);
}

export async function createComment(obj, args, context) {
  const SchemaComment = context.schemas.comment;
  const user = context.user;
  const comment = await SchemaComment.create({
    user: user.id,
    post: args.postId,
    content: args.content,
  });
  return comment;
}
