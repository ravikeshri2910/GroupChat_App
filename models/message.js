const Sequelize = require('sequelize');

const sequelize = require('../utill/database');

const Message = sequelize.define('messages',{

    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    message : Sequelize.STRING,
   
});

module.exports = Message;