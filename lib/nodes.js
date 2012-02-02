
// Get an `indentHandler` object

var indentHandler = require('./indent-handler')();

// Pull in all the node type constructors, passing in
// the shared indent handler to each

var nodes = {
  program : require('./nodes/program')(indentHandler),
  statementList : require('./nodes/statement-list')(indentHandler),
  assign : require('./nodes/assign')(indentHandler),
  object : require('./nodes/object')(indentHandler),
  fn : require('./nodes/fn')(indentHandler),
  call : require('./nodes/call')(indentHandler),
  conditional : require('./nodes/conditional')(indentHandler),
  loop : require('./nodes/loop')(indentHandler),
  where : require('./nodes/where')(indentHandler),
  concatenation : require('./nodes/concatenation')(indentHandler),
  dynamicId : require('./nodes/dynamic-id')(indentHandler),
  reference : require('./nodes/reference')(indentHandler),
  operator : require('./nodes/operator')(indentHandler),
  node : require('./nodes/node')
};

module.exports = nodes;