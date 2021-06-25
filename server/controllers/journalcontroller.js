// importing Express framework and storing it inside variable 'Express'
// this instance becomes our gateway to using Express methods
const Express = require('express')
// can access express props and methods by calling express.methodName()
// - therefore we call Express.Router() - using Express variable to access the Router() method
// router method returns a router obj
const router = Express.Router()

// use router obj by using router variable to gain access to the Router() obj methods
// - get() is one of the methods in the obj and is called here.
// - allows us to  complete a HTTP GET req
router.get('/practice', (req, res) => {
  res.send('Hey! Practice route!')
})

// exporting for outside use of the file
module.exports = router
