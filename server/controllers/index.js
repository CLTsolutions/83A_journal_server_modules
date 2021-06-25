// implementing CommonJS, a module formatting system built into Node
// this practice helps to organize modules
// - in this case files, routes, and dependencies, as well as manage the access to the logic.
module.exports = {
  journalController: require('./journalcontroller'),
}
