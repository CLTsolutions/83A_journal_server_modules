// importing sequelize pkg and creating an instance of sequelize for use in the module with the Sequelize var
const Sequelize = require('sequelize')

// use constructor to create new sequelize obj.
// constructor takes in a string which holds all pertinent data required to connect to a db (URI connection)
const sequelize = new Sequelize(process.env.DB_URL)

module.exports = sequelize
