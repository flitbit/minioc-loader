module.exports = function $init(next) {
	this.register('3').as.value("three");

	next();
};