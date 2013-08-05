var initialized
, call_count = 0
;

function $init($callback) {
	// minioc-loader always calls a module's $init method with `this` bound to
	// the container.

	if (!initialized) {

		var cb = $callback;

		this.register('sample').from.factory(
			function($data) {
				return cb($data);
			});

		initialized = true;
	}
	call_count++;
}

Object.defineProperties($init, {

	call_count: { get: function() { return call_count; }, enumerable: true }

});

module.exports = $init;