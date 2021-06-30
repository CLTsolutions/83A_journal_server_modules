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

// calling app.use and using base url /journal as the first param
// base URL is now http://localhost:3000/journal
// for the second param, the use() fn, we pass in the controllers obj and use dot notation
// - to access the desired journalController
app.use('/journal', controllers.journalController)
app.use('/user', controllers.userController)

// app.listen(3000, () => {
//   console.log(`[Server]: App is listening on 3000.`)
// })

// authenticate method returns a promise
db.authenticate()
  .then(() => db.sync()) // method ensures all defined models are synced to db
  // .then(() => db.sync({ force: true }))
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
