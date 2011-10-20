
/**
 * Constructor for token objects.
 *
 * Examples:
 *
 *     utils.escape('<script></script>')
 *     // => '&lt;script&gt;&lt;/script&gt;'
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
