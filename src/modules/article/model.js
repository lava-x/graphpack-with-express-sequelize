/**
 * See http://docs.sequelizejs.com/manual/getting-started.html#modeling-a-table
 * or http://docs.sequelizejs.com/manual/models-definition.html#configuration
 * for more details
 * For data types - http://docs.sequelizejs.com/manual/data-types.html
 */
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize) => {
  class ArticleSchema extends Model {}
  ArticleSchema.init(
    {
      title: { type: Sequelize.STRING, allowNull: false },
      body: { type: Sequelize.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'article',
      timestamps: true,
    }
  );

  ArticleSchema.associate = (models) => {
    ArticleSchema.belongsTo(models.user);
  };

  return ArticleSchema;
};
