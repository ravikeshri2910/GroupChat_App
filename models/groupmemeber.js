const Sequelize = require('sequelize');

const sequelize = require('../utill/database');



const Groupmembers = sequelize.define('groupmembers', {
    // No need for any specific fields here, as it's just an association table
  })

  module.exports = Groupmembers;