const Sequelize = require('sequelize');

const sequelize = require('../utill/database');

const rat = sequelize.define('users',{

    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name : Sequelize.STRING,
    phone : Sequelize.STRING,
    email: {
        type : Sequelize.STRING,
        unique : true
    },
    password : Sequelize.STRING,
});

module.exports = rat;