/**
 * See http://docs.sequelizejs.com/manual/getting-started.html#modeling-a-table
 * or http://docs.sequelizejs.com/manual/models-definition.html#configuration
 * for more details
 */
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize) => {
  class CommentSchema extends Model {}
  CommentSchema.init(
    {
      content: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'comment',
      timestamps: true,
    }
  );

  CommentSchema.associate = (models) => {
    CommentSchema.belongsTo(models.user);
    CommentSchema.belongsTo(models.post);
  };

  return CommentSchema;
};
