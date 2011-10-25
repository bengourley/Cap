
// Module dependencies

var indentHandler = require('./indent-handler')();

var nodes = {

	program : require('./nodes/program')(indentHandler),
	statementList : require('./nodes/statement-list')(indentHandler),
	assign : require('./nodes/assign')(indentHandler),
	object : require('./nodes/object')(indentHandler),
	fn : require('./nodes/fn')(indentHandler),
	call : require('./nodes/call')(indentHandler),
	conditional : require('./nodes/conditional')(indentHandler),
	where : require('./nodes/where')(indentHandler),
	dynamicId : require('./nodes/dynamic-id')(indentHandler),
	node : require('./nodes/node')

};

module.exports = nodes;
