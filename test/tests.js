var expect = require('expect.js')
, minioc   = require('minioc')
, loader   = require('..')
;

describe('minioc-loader', function() {
	var container = minioc.create();

	describe('loading the examples in ./sample', function() {

		var sample;

		loader.basePath = __dirname;
		loader.loadSync(container, './sample');

		// capture the $sample when it becomes available...
		container.when('$sample', function(val) {
			sample = val;
		});

		it('when minioc receives a registration for $callback, the $init is called and $sample is fulfilled', function() {

			// sample hasn't been fulfilled yet...
			expect(sample).to.be.an('undefined');

			var ours = 'This is ours';

			// ./sample/index.js' $init method is awaiting a callback...
			container.register('$callback').as.value(
				function(config){
					return (config === ours) ? 'Yay!' : 'Booo!';
				});

			// now that the $init method has been called there is a
			// registration for $sample; it is awaiting a $config...
			container.register('$config').as.value(ours);

			// now that there is a $config, all registrations are fulfilled
			// and our callback was invoked, capturing the $sample value...

			expect(sample).to.be('Yay!');
		});
	});

});