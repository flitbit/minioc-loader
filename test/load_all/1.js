module.exports = function $init(next) {
	this.register('1').as.value("one");

	next();
};