

module.exports = {
	$init: function (next) {
		console.log('piper.js initialized');

		// conventional $init methods are called in the context of the
		// IoC container so dependencies can be retrieved directly...
		var app = this.get('app');

		// provide a $piper, note its dependency on $peter
		this.register('$piper').as.factory(
			function($peter) {
				return ''.concat($peter, ' piper');
			});

		app.use('piper');

		next();
	}
};