// this file centralizes the imports of our current and future models in one location
// - they are then exported in a single object.
const UserModel = require('./user')
const JournalModel = require('./journal')

module.exports = { UserModel, JournalModel }
