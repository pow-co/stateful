'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Webhooks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      outpoint: {
        type: Sequelize.STRING
      },
      webhook_url: {
        type: Sequelize.STRING
      },
      attempts: {
        type: Sequelize.INTEGER
      },
      success: {
        type: Sequelize.BOOLEAN
      },
      failed: {
        type: Sequelize.BOOLEAN
      },
      result: {
        type: Sequelize.JSON
      },
      secret_header_name: {
        type: Sequelize.STRING
      },
      secret_header_value: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Webhooks');
  }
};