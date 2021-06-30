// combined two lines of code (import Express framework and access Router() method)
// - assigned to Router method.
// - in journalcontroller code is divided up over two lines
const router = require('express').Router()
// using obj destructuring to import the user model and store it in 'userModel' variable.
const { UserModel } = require('../models')

/***********
 * LOGIN *
 **********/
// we use the router obj by using the router variable to get access into the Router() obj methods.
// post() is one of the methods in the obj and is called here
// can pass 2 args into the .post method
router.post('./register', async (req, res) => {
  // using UserModel var created on line 2 to access the user model props and sequelize methods
  // .create is a sequelize method allowing us to create an instance of the User model and send it off to the db
  UserModel.create({
    email: '',
  })
})

module.exports = router
