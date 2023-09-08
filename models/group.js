const Sequelize = require('sequelize');

const sequelize = require('../utill/database');

const Group = sequelize.define('groups',{

    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    group : Sequelize.STRING,
    adminId : Sequelize.STRING
   
});

module.exports = Group;