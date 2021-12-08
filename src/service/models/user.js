'use strict';

const {DataTypes, Model} = require(`sequelize`);

class User extends Model {}
const define = (sequelize) => User.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

module.exports = define;
