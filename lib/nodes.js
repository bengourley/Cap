
// Pull in all the node type constructors

var nodes = {
  program : require('./nodes/program'),
  statementList : require('./nodes/statement-list'),
  assign : require('./nodes/assign'),
  object : require('./nodes/object'),
  fn : require('./nodes/fn'),
  call : require('./nodes/call'),
  conditional : require('./nodes/conditional'),
  loop : require('./nodes/loop'),
  where : require('./nodes/where'),
  concatenation : require('./nodes/concatenation'),
  dynamicId : require('./nodes/dynamic-id'),
  reference : require('./nodes/reference'),
  operator : require('./nodes/operator'),
  node : require('./nodes/node')
};

module.exports = nodes;