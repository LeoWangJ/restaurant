'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addColumn('Favorites','RestaurantId',{
    type:Sequelize.INTEGER
   })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Favorites','RestaurantId')
  }
};
