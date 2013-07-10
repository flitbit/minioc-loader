var initialized;

module.exports = function $init($callback) {
	if (!initialized) {

		var cb = $callback;

		// this is bound to the current container...
		this.register('$sample').from.factory(function($config) {
			return cb($config);
		});

		initialized = true;
	}
};