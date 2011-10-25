
// Token object creator

var token;

token = function (spec) {
	var token = {};
	token.type = spec.type;
	token.value = spec.value;
	return token;
};

module.exports = token;
