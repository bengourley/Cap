var Token = module.exports = function (type, value) {
	this.type = type;
	if (value) {
		this.value = value;
	}
};
