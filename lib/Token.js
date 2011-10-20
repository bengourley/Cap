
/**
 * Constructor for token objects.
 *
 * @param {String} type of the token
 * @param {String} token value (optional)
 * @return {Token} the generated token
 * @api public
 */

var Token = module.exports = function (type, value) {
	this.type = type;
	if (value) {
		this.value = value;
	}
};
