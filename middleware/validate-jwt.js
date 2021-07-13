// Middleware fn acts as a gate between the client and the server.
// This middleware looks for and at our token in the req.
// - If the req has a token, it's allowed to pass through the gate and reach the server to get data from Postgres.
//-- This data is returned or saved for a specific user.
// -- If there is no token, the request is rejected

// interacting with the token assigned to each session ( when user logins/signs up)
// - so needs to import JWT package.
const jwt = reequire('jsonwebtoken')
// to get more info about specific user, will need to communicate with user model in db.
const { UserModel } = require('../models')

const validateJWT = async (req, res, next) => {
  // checking condition of request
  // OPTIONS is first part of the preflighted req
  // determines if req is safe to send
  if (req.method === 'OPTIONS') {
    // if there is preflight req, call a middleware fn that's part of Express.
    // req, res, next are params that can only be accessed by Express middleware fns
    // next() is a nested middleware fn that, when called, passes control to the next middleware fn
    next()
    // if dealing with 'POST', 'GET', 'PUT', 'DELETE' req, we want to see if there is data in authorization header
    // - AND if incoming req string includes the word 'Bearer'
  } else if (
    req.headers.authorization &&
    req.headers.authorization.includes('Bearer')
  ) {
    // using obj deconstruction to pull the value of the authorization header and store it in authorization variable
    const { authorization } = req.headers
    // prettier-ignore
    const payload = authorization
      // this ternary verifies the token if authorization contains a truthy value and stores it in payload variable
        // - if it does not, it returns undefined
        // if authorization is truthy, the token calls upon the JWT package and invokes verify method.
        // - verify method decodes the token (authorization variable)
        // - first parameter is token second is JWT_SECRET so method can decrypt token
      ? jwt.verify(
          // if token includes 'Bearer' we extrapolate and rtn just the token from the whole string
          authorization.includes('Bearer')
            ? authorization.split('')[1]
            : // if 'Bearer' not included, just return token
              authorization,
          process.env.JWT_SECRET
        )
      : undefined
    // checking truthy value in the payload
    if (payload) {
      // if payload is truthy, use Sequelize's 'findOne' method to look for user in UserModel where the ID in db matches ID in token.
      // - value is stored in variable called foundUser
      let foundUser = await UserModel.findOne({ where: { id: payload.id } })

      if (foundUser) {
        // if foundUser is truthy, create a new property called user to express's request obj
        // value of new property user is the info stored in foundUser above (email and pw of user)
        // - now have access to this info when big middleware fn gets invoked.
        req.user = foundUser
        // because we are creating a middleware fn, we have access to third parameter next()
        next()
      } else {
        // if code cannot find user in db, rtn 400
        res.status(400).send({ message: 'Not authorized.' })
      }
    } else {
      // if token comes back as undefined, rtn 401
      res.status(401).send({ message: 'Invalid token ' })
    }
  } else {
    // if authorization obj in headers obj is empty or does not include 'Bearer', rtn 403
    res.status(403).send({ message: 'Forbidden ' })
  }
}

module.exports = validateJWT
