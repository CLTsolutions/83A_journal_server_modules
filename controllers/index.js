// implementing CommonJS, a module formatting system built into Node
// this practice helps to organize modules
// - in this case files, routes, and dependencies, as well as manage the access to the logic.

// exporting this file as a module
module.exports = {
  // define a prop called journalController (value of this prop is the import of the journalController file)
  userController: require('./usercontroller'),
  journalController: require('./journalcontroller'),
}
