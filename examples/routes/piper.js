module.exports = function $init() {
	// conventional $init methods are called in the context of the
	// IoC container so dependencies can be retrieved directly...
	var app = this.get('$app');

	app.use('piper');
};