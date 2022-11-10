const Sequelize = require('sequelize');
module.exports = {
    up: (queryInterface, Sequelize) => (
      queryInterface.createTable('Products', {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING,
        },
        price: {
          allowNull: false,
          type: Sequelize.FLOAT,
          defaultValue: 0.00,
        },
        currency: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        views:{
          allowNull: true,
          type: Sequelize.BIGINT,
          defaultValue: 0,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      })
        .then(() => {
          queryInterface.addIndex('Products', { fields: ['name'] });
        })
    ),
    down: (queryInterface) => (
      queryInterface.dropTable('Products')
    ),
  };
  