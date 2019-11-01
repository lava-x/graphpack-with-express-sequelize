/**
 * See http://docs.sequelizejs.com/manual/getting-started.html#modeling-a-table
 * or http://docs.sequelizejs.com/manual/models-definition.html#configuration
 * for more details
 * For data types - http://docs.sequelizejs.com/manual/data-types.html
 */
const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = (sequelize) => {
  class UserSchema extends Model {}
  UserSchema.init(
    {
      name: { type: Sequelize.STRING, allowNull: false },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      password: { type: Sequelize.STRING, allowNull: false },
      roles: {
        type: Sequelize.ARRAY(Sequelize.ENUM('admin', 'user')),
        allowNull: false,
        defaultValue: ['user'],
      },
    },
    {
      sequelize,
      modelName: 'user',
      timestamps: true,
    }
  );

  UserSchema.associate = (models) => {
    UserSchema.hasMany(models.post, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
    UserSchema.hasMany(models.comment, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
    UserSchema.hasMany(models.article, {
      onDelete: 'CASCADE',
      foreignKey: 'userId',
    });
  };
  return UserSchema;
};
