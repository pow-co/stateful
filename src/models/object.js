'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Object extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Object.init({
    origin: DataTypes.STRING,
    location: DataTypes.STRING,
    script: DataTypes.TEXT,
    code_part: DataTypes.TEXT,
    state_part: DataTypes.TEXT,
    contract_uid: DataTypes.STRING,
    inpoint: DataTypes.STRING,
    block_hash: DataTypes.STRING,
    block_height: DataTypes.NUMBER,
    merkle_proof: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Object',
  });
  return Object;
};