'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Objects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      origin: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      script: {
        type: Sequelize.TEXT
      },
      code_part: {
        type: Sequelize.TEXT
      },
      state_part: {
        type: Sequelize.TEXT
      },
      contract_uid: {
        type: Sequelize.STRING
      },
      inpoint: {
        type: Sequelize.STRING
      },
      block_hash: {
        type: Sequelize.STRING
      },
      block_height: {
        type: Sequelize.NUMBER
      },
      merkle_proof: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Objects');
  }
};