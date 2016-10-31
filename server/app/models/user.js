/**
 * Created by tstauber on 10/17/16.
 */

const Sequelize = require('sequelize');
const Database  = require("../databases");

module.exports = Database.define('user', {
    uuid: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: Sequelize.STRING,
    foodGroups: Sequelize.STRING
});
