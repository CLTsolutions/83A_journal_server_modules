// importing Express framework and storing it inside variable 'Express'
// this instance becomes our gateway to using Express methods
const Express = require('express')
const { restart } = require('nodemon')
// can access express props and methods by calling express.methodName()
// - therefore we call Express.Router() - using Express variable to access the Router() method
// Router method returns a router obj
const router = Express.Router()
// placing validateJWT here instead of in app.js is best if only a specific number of routes needs to be restricted
let validateJWT = require('../middleware/validate-jwt')
const { JournalModel } = require('../models')

// use router obj by using router variable to gain access to the Router() obj methods
// - get() is one of the methods in the obj and is called here.
// -- get () allows us to complete a HTTP GET req (.get takes 2 args)
// --- first arg is the path and second is an anon callback fn (aka handler fn))
// ----- this fn gets called when app receives req to specified route and HTTP method.
// validateJWT checks if incoming req has a token for this route
router.get('/practice', validateJWT, (req, res) => {
  res.send('Hey! Practice route!') // .send() is an Express method that can call on the res obj
})

/*=================
* journal CREATE *
==================*/
// using router obj to access the .post()
// /create is a subroute
router.post('/create', validateJWT, async (req, res) => {
  const { title, date, entry } = req.body.journal
  // this is coming from validateJWT (user obj we created in validateSession.js).
  // - we can grab user's id and assign it to a specific journal entry
  const { id } = req.user
  // this accesses model we are using
  const journalEntry = { title, date, entry, owner: id }
  try {
    // .create() is a sequelize method allowing us to crete an instance of the Journal model
    // - and sending the journalEntry obj to the db as long as it matches the model.
    const newJournal = await JournalModel.create(journalEntry)
    res.status(200).json(newJournal)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.get('/about', (req, res) => {
  res.send('Hey! About route!') // .send() is an Express method that can call on the res obj
})

// exporting for outside use of the file
module.exports = router

/*=================
* journal GET ALL *
==================*/
router.get('/', async (req, res) => {
  try {
    // findAll() finds all items inside the journal table in our db
    // - this method rtns a promise which we await
    const entries = await JournalModel.findAll()
    res.status(200).json(entries)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})
