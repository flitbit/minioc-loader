module.exports = function $init() {
	this.register('second').as.value("second");

	// NOTE: we did not bind a `next` argument,
	// therefore we're indicating that loading is done.
};