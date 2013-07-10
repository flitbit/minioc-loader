var expect = require('expect.js')
, minioc   = require('minioc')
, loader   = require('..')({basePath: __dirname}) // initialize base-path
;

describe('minioc-loader', function() {
	var container = minioc.create();

	describe('loading the examples in ./sample', function() {

		var sample;

		it('completes without error', function() {
			loader.loadSync(container, './sample');
		});

		describe('since ./sample.index.js` exported $init function requires dependency-injected $callback', function() {
			var sample_module = require('./sample');

			it('it has not been called', function() {
				expect(sample_module.call_count).to.be(0);
			});

			it('it has not made it`s own regisrations ($sample)', function() {
				expect(container.has('$sample')).to.be(false);
			});

			it('the container won`t fulfill requests for the $sample value', function() {
 				// sample hasn't been fulfilled yet...
				expect(sample).to.be.an('undefined');
			});

			describe('when a $callback is registered with the container', function() {

				var ourdata = 'This is ours';

				// capture the $sample when it becomes available...
				container.when('$sample', function(val) {
					sample = val;
				});

				it('the module`s $init is called', function() {
					// ./sample/index.js' $init method is awaiting a $callback,
					// this registration will allow minioc to fulfill the $init
					// method...
					container.register('$callback').as.value(
						function(data){
							return (data === ourdata) ? 'Yay!' : 'Booo!';
						});
					expect(sample_module.call_count).to.be(1);
				});

				describe('once the module`s $init function has been called', function() {

					it('$sample is registered with the container', function() {
						expect(container.has('$sample')).to.be(true);
					});

					it('$sample cannot be resolved by the container due to the missing dependency ($data)', function() {
						expect(container.can('$sample')).to.be(false);
						expect(sample).to.be.an('undefined');
					});

					describe('when we register the last remaining dependency ($data)', function() {

						it('the dependency graph is fully fulfilled and our callback is invoked', function() {
 							// now that the $init method has been called there is a
							// registration for $sample; it is awaiting a $config...
							container.register('$data').as.value(ourdata);

							// now that there is a $data, all registrations are fulfilled
							// and our callback was invoked, capturing the $sample value...
							expect(sample).to.be('Yay!');
						});

					});

				});

			});

		});

	});

});