var expect = require('expect.js')
Container  = require('minioc')
;

module.exports = function $init($app, config, next) {
	// the loader ensures dependencies are injected...
	expect($app).to.be.ok();
	expect(config.jib).to.be('jab');

	console.log('peter.js initialized with app and config');

	// conventional $init methods are called in the context of the
	// IoC container...
	expect(this).to.be.a(Container);

	// provide a $peter...
	this.register('peter').as.value('peter');

	$app.use('peter');

	next();
};