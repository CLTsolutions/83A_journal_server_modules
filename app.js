// When require ('dependency') such as on line 1,
// - we are importing and accessing dependencies installed in the project
require('dotenv').config()
// app.js is the entrance into this application
// If a file or piece of logic is not connected by one import/export, the app cannot access or run the logic
//- implemented in that file (as if the file is simply floating and thus inaccessible)
const Express = require('express')
// creating an instance of express (firing off a top-level Express() fn exported by Express module.
// Allows us to create an Express app.
const app = Express()
const db = require('./db')

/*
- Keep in mind the order here.
- - The file will be read sequentially, meaning the headers must come before the routes are declared.
- it also needs to be high enough in the order of the file being read to pass the value of "Content-Type" into Express.json().
*/
app.use(require('./middleware/headers'))

// When the route is requested, Express finds the method for the specific route.
// res.send is an Express fn
// res (response) handles packaging the response obj
// .send() method's job is to send off the response
// app.use('/test', (req, res) => {
//   res.send('This is a message from the test endpoint on the server!')
// })

// importing the controllers as a bundle through the obj we exported in the index.js file
// - it's being stored it in a variable called controllers
const controllers = require('./controllers')

// this allows us to use the req.body middleware
// - Express needs to jsonify the request and parse and interpret the body of data sent through req
// app.use MUST got above any routes (routes above won't have access to this statement)
// this tells the app we want json to be used as we process this req
app.use(Express.json())

app.use('/user', controllers.userController)

// anything beneath this middleware line will require a token to access (thus becoming protected)
// - best if we have multiple controllers where ALL THE ROUTES need to be restricted
// app.use(require('./middleware/validate-jwt')) ******************

// calling app.use and using base url /journal as the first param
// base URL is now http://localhost:3000/journal
// for the second param, the use() fn, we pass in the controllers obj and use dot notation
// - to access the desired journalController
app.use('/journal', controllers.journalController)

// app.listen(3000, () => {
//   console.log(`[Server]: App is listening on 3000.`)
// })

// authenticate method returns a promise
db.authenticate()
  .then(() => db.sync()) // method ensures all defined models are synced to db
  // .then(() => db.sync({ force: true })) // to drop tables
  // promise resolver to access the returned promise from sync() and fire off the fn showing if we are connected
  .then(() => {
    app.listen(
      process.env.PORT,
      console.log(`[Server]: listening on localhost:${process.env.PORT}`)
    )
  })
  // promise rejection that fires off error if present
  .catch(err => {
    console.log('[server]: Server Crashed')
    console.log(err)
  })
