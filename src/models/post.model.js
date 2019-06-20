/**
 * See http://docs.sequelizejs.com/manual/getting-started.html#modeling-a-table
 * or http://docs.sequelizejs.com/manual/models-definition.html#configuration
 * for more details
 */
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize) => {
  class PostSchema extends Model {}
  PostSchema.init(
    {
      title: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'post',
      timestamps: true,
    }
  );

  PostSchema.associate = (models) => {
    PostSchema.belongsTo(models.user);
    PostSchema.hasMany(models.comment, { onDelete: 'CASCADE' });
  };

  return PostSchema;
};
