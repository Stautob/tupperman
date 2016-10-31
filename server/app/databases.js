

const Sequelize = require("sequelize");

module.exports = new Sequelize('main', 'tupperman', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './databases/tupperdb.sqlite'
});