// app.js is the entrance into this application
const Express = require('express')
// creating an instance of express (firing off a top-level Express() fn exported by Express module.
// Allows us to create an Express app.
const app = Express()

// res.send is an Express fn
// res (response) handles packaging the response obj
// .send() method's job is to send off the response
app.use('/test', (req, res) => {
  res.send('This is a message from the test endpoint on the server!')
})

// importing the controllers as a bundle through the obj we exported in the index.js file
// - it's being stored it in a variable called controllers
const controllers = require('./controllers')

// calling app.use and using /journal as the first parameter
// base URL is now http://localhost:3000/journal
// for the second parameter for the use() fn, we pass in the controllers obj and use dot notation
// - to access the desired journalController
app.use('/journal', controllers.journalController)

app.listen(3000, () => {
  console.log(`[Server]: App is listening on 3000.`)
})

// db.authenticate()
//   .then(() => db.sync())
//   // .then(() => db.sync({ force: true }))
//   .then(() => {
//     app.listen(
//       process.env.PORT,
//       console.log(`[server]: listening on localhost:${process.env.PORT}`)
//     )
//   })
//   .catch(err => {
//     console.log('[server]: Server Crashed')
//     console.log(err)
//   })
