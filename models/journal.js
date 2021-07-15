const { DataTypes } = require('sequelize')
const db = require('../db')

const Journal = db.define('journal', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    // not part of modules, playing around with validation
    validate: {
      notNull: {
        msg: 'Please enter a title.',
      },
    },
  },
  date: {
    type: DataTypes.STRING,
  },
  entry: {
    type: DataTypes.STRING,
  },
  // owner ties each post to a specific user
  // through JWT and ValidateSession middleware fn, we have access to each user's id
  owner: {
    type: DataTypes.INTEGER,
  },
})

module.exports = Journal
