// object destructuring is used to extrapolate the DataTypes object from the sequelize dependency.
const { DataTypes } = require('sequelize')
// import connection to db (unlocks methods from the sequelize connection that we can call upon)
const db = require('../db')

// definition and creation of the model takes place here
// - calling .define() method which maps model props in the server file to a table in Postgres.
// -- this map is the act of determining how objects and their relationships are persisted in permanent data storage (unlike js .map)
// first arg is the name of the table (in this case, 'user')
const User = db.define('user', {
  // email & pw are objs and become columns in the 'user' table.
  email: {
    // sequelize makes us define the type of dataTypes being stored in its column
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

module.exports = User
