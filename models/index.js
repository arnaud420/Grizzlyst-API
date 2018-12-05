const Sequelize = require('sequelize');
const { DB_NAME, DB_PASSWORD, DB_USERNAME } = require('../config/db');

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false
});

const User = sequelize.import(__dirname + '/User');

module.exports = {
    sequelize
};