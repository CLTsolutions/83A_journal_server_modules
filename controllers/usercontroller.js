// combined two lines of code (import Express framework and access Router() method)
// - assigned to Router method.
// - in journalcontroller code is divided up over two lines
const router = require('express').Router()
const { UniqueConstraintError } = require('sequelize/lib/errors')
// using obj destructuring to import the user model and store it in 'userModel' variable.
const { UserModel } = require('../models')

/*************
 * REGISTER *
 ************/
// we use the router obj by using the router variable to get access into the Router() obj methods.
// post() is one of the methods in the obj and is called here
// can pass 2 args into the .post method
router.post('/register', async (req, res) => {
  // using obj deconstruction to take in and parse the req
  // using req.body middleware provided by Express to append 2 props (key/value pairs) to it.
  // - what is being sent to db
  // - req is the actual request and body is where our data is being held.
  // -- user is prop of body while email and password are props of user
  // -- SEE NOTES BELOW EXPORTS
  let { email, password } = req.body.user

  // assigning data to variable 'User'
  // using UserModel var created on line 2 to access the user model props and sequelize methods
  // .create is a sequelize method allowing us to create an instance of the User model and send it off to the db
  // using await to capture the Promise returned from our query to the model in our db.
  try {
    const User = await UserModel.create({
      email,
      password,
    })
    // .status allows us to add a status code to a res
    // res.json and res.send nearly identical except .json can convert non objs into valid json (null/undefined)
    res.status(201).json({
      message: 'User created successfully.',
      // User data (above) is being sent to client and stored in 'user' property. 'user' is key, 'User' is value.
      user: User,
    })
  } catch (err) {
    // in case there is a SequelizeUniqueConstraintError
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: 'Email already in use',
      })
    } else {
      res.status(500).json({
        message: 'Failed to register user',
        error: err,
      })
    }
  }
})

/***********
 * LOGIN *
 **********/
// using post because logging in is sending data to the db
router.post('/login', async (req, res) => {
  // obj deconstruction to pull email and password from reqs
  let { email, password } = req.body.user
  try {
    // findOne is a Sequelize method that tries to find 1 element from the matching model within the db
    // - called data retrieval
    const loginUser = await UserModel.findOne({
      // where filters what we want to locate within our db
      where: { email: email },
    })
    // checking if res is true or false
    // null is not an err, but it does have a falsy value
    if (loginUser) {
      res.status(200).json({
        message: 'Login successful.',
        user: loginUser,
      })
    } else {
      res.status(401).json({ message: 'Login failed. User not found.' })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Failed to login user',
      error: err,
    })
  }
})

module.exports = router

// ------- NOTES FROM ABOVE -------
/*
'req': {
  'body': {
    'user': {
      'email':
      'password':
    }
  }
}
*/

// ---------- SUMMARY OF FLOW -------------
/*
1. We make a POST request with Postman.
2. app.use(express.json()) breaks the request into JSON.
3. The router sends that request to the usercontroller.
4. Our usercontroller POST method allows access to the User model.
5. The controller with the /register endpoint is called..
6. The req.body.user obj is captured.
7. We then use the Sequelize create() method to create the object to be sent to the DB.
8. The object is sent and Postgres stores it.
9. We store the data from our promise created by the create() method in a variable.
10. The method sends the data back as JSON this time, and the res goes to Postman.
10. After the data is stored, we fire the .then() method, which returns a Promise.
11. A method fires a response to Postman.
*/
