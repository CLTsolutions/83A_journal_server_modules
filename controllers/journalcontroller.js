// importing Express framework and storing it inside variable 'Express'
// this instance becomes our gateway to using Express methods
const Express = require('express')
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

/*==========================
* journal GET ALL BY USER *
============================*/
router.get('/mine', validateJWT, async (req, res) => {
  // user who sends req
  // digging into user obj within req obj and accessing user's id.
  const { id } = req.user
  try {
    // sequelize lets us use the 'where' attribute to specify specific items from the db
    // want to look in thw owner column in the db and find journal entries that correlate with specific user id
    // - extracted using the validateSession middleware fn.
    const userJournals = await JournalModel.findAll({ where: { owner: id } })
    res.status(200).json(userJournals)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/*=======================
* journal GET BY TITLE *
=========================*/
// /:title is a dynamic route
// substitute /:title with word or title correlated with a journal entry
router.get('/:title', async (req, res) => {
  // grabbing params obj found in request obj
  // - from here we can access the values passed into the url's parameter
  const { title } = req.params
  try {
    // finding journal's title in title column of db
    // - find's specific title extrapolated from url's parameters
    const results = await JournalModel.findAll({ where: { title: title } })
    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/*=================
* journal UPDATE *
===================*/
// PUT replaces whatever is already there with what we give it (update)
router.put('/update/:entryId', validateJWT, async (req, res) => {
  const { title, date, entry } = req.body.journal
  const journalId = req.params.entryId
  const userId = req.user.id

  const query = { where: { id: journalId, owner: userId } }

  const updatedJournal = {
    title: title,
    date: date,
    entry: entry,
  }

  try {
    // update is sequelize method that takes two args
    // - 1st arg contains obj of the new value we want to edit in the db
    // - 2ns arg tells Sequelize where to place the new data if a match is found (query we crafted above)
    const update = await JournalModel.update(updatedJournal, query)
    res
      .status(200)
      // using 'updatedJournal' instead of 'update' so I can see what has been updated
      .json({ message: 'Your entry has been updated.', updatedJournal })
    // res.status(200).json(update)
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

/*=================
* journal DELETE *
===================*/
// When delete req is received, controller looks for matching fn
// :id allows url param to be passed through the URL to the server so we can specify what to delete
router.delete('/delete/:id', validateJWT, async (req, res) => {
  const userId = req.user.id
  const journalId = req.params.id

  try {
    const query = { where: { id: journalId, owner: userId } }
    // destroy is Sequelize method to remove an item from the db
    // tell Sequelize what to look for in trying to find item to delete
    // modules did not set await JournalModel to a variable
    const result = await JournalModel.destroy(query)
    res.status(200).json({ message: 'Your entry has been deleted.', result })
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

// router.get('/about', (req, res) => {
//   res.send('Hey! About route!') // .send() is an Express method that can call on the res obj
// })

// router.get('/about', (req, res) => {
//   res.send('Hey! About route!') // .send() is an Express method that can call on the res obj
// })

// exporting for outside use of the file
module.exports = router
