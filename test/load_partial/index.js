module.exports = function $init(next) {
	this.register('first').as.value("first");

	// NOTE: we bound a `next` argument and calling
	// it so `minioc_loader` will continue to load
	// files in the directory.
	next();
};