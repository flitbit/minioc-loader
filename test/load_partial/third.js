module.exports = function $init(next) {
	// NOTE: this `$init` function never gets called by
	// the loader because a prior .js file (second.js) doesn't
	// bind and call a `next` argument.

	this.register('third').as.value("third");

	next();
};