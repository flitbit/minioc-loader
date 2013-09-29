module.exports = function $init(next) {
	this.register('5').as.value("five");

	next();
};