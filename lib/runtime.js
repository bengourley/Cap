var fs = require('fs');

module.exports = {
	compile : function () {
		return fs.readFileSync('./lib/runtime/proxies.js');
	}
};