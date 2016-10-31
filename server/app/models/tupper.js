/**
 * Created by tstauber on 10/17/16.
 */

const Sequelize = require('sequelize');
const Database  = require("../databases");
const User      = require("./user");

module.exports = Database.define('tupper', {
    uuid: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
    },
    user: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid'
        }
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    foodGroups: Sequelize.STRING,
    weight: Sequelize.INTEGER,
    freezeDate: Sequelize.DATE,
    expiryDate: Sequelize.DATE
});

