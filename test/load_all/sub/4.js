module.exports = function $init(next) {
	this.register('4').as.value("four");

	next();
};