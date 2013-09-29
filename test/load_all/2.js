module.exports = function $init(next) {
	this.register('2').as.value('two');

	next();
};