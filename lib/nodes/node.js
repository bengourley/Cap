var node = function (spec) {
	
	var node = {};
	
	node.type = spec.type || 'primitive';
	
	node.print = function () {
		return spec.value;
	};

	node.compile = function (options) {
		return (options && options.shouldReturn ? 'return ' : '') + spec.value;
	};

	return node;

};

module.exports = node;
