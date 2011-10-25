/*
 * Tests for lib/nodes.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var nodes = require('nodes');

/*
 * Tests
 */

exports['nodes '] = function (beforeExit, assert) {

	var p = nodes.node({
		type : 'Number',
		value : 20
	});


};
