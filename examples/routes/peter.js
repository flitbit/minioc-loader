var expect = require('expect.js')
Container  = require('minioc')
;

module.exports = function $init($app, $config) {
	// the loader ensures dependencies are injected...
	expect($app).to.be.ok();
	expect($config).to.be.ok();

	// conventional $init methods are called in the context of the
	// IoC container...
	expect(this).to.be.a(Container);

	$app.use('peter');
};