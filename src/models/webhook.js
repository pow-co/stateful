'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Webhook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Webhook.init({
    outpoint: DataTypes.STRING,
    webhook_url: DataTypes.STRING,
    attempts: DataTypes.INTEGER,
    success: DataTypes.BOOLEAN,
    failed: DataTypes.BOOLEAN,
    result: DataTypes.JSON,
    secret_header_name: DataTypes.STRING,
    secret_header_value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Webhook',
  });
  return Webhook;
};