export function getUsers(obj, args, context) {
  const SchemaUser = context.schemas.user;
  return SchemaUser.findAll();
}

export function getUser(obj, args, context) {
  const SchemaUser = context.schemas.user;
  return SchemaUser.findByPk(args.id);
}

export function getProfile(obj, args, context) {
  return context.user;
}
