"use strict";

/* global describe, it */
/* jshint laxbreak: true, laxcomma: true */

var expect = require('expect.js')
, minioc   = require('minioc')
, loader   = require('..')({basePath: __dirname}) // initialize base-path
;

describe('minioc-loader', function () {
	var container = minioc.create();

	describe('loading the examples in ./sample', function () {

		var sample;

		it('completes without error', function () {
			loader.loadSync(container, './sample');
		});

		describe('since ./sample.index.js` exported $init function requires dependency-injected $callback', function () {
			var sample_module = require('./sample');

			it('it has not been called', function () {
				expect(sample_module.call_count).to.be(0);
			});

			it('it has not made it`s own regisrations ($sample)', function () {
				expect(container.has('sample')).to.be(false);
			});

			it('the container won`t fulfill requests for the $sample value', function () {
				// sample hasn't been fulfilled yet...
				expect(sample).to.be.an('undefined');
			});

			describe('when a $callback is registered with the container', function () {

				var ourdata = 'This is ours';

				// capture the $sample when it becomes available...
				container.when('sample', function (val) {
					sample = val;
				});

				it('the module`s $init is called', function () {
					// ./sample/index.js' $init method is awaiting a $callback,
					// this registration will allow minioc to fulfill the $init
					// method...
					container.register('callback').as.value(
						function (data) {
							return (data === ourdata) ? 'Yay!' : 'Booo!';
						});
					expect(sample_module.call_count).to.be(1);
				});

				describe('once the module`s init function has been called', function () {

					it('sample is registered with the container', function () {
						expect(container.has('sample')).to.be(true);
					});

					it('sample cannot be resolved by the container due to the missing dependency (data)', function () {
						expect(container.can('sample')).to.be(false);
						expect(sample).to.be.an('undefined');
					});

					describe('when we register the last remaining dependency (data)', function () {

						it('the dependency graph is fully fulfilled and our callback is invoked', function () {
							// now that the $init method has been called there is a
							// registration for $sample; it is awaiting a $config...
							container.register('data').as.value(ourdata);

							// now that there is a data, all registrations are fulfilled
							// and our callback was invoked, capturing the $sample value...
							expect(sample).to.be('Yay!');
						});

					});

				});

			});

		});

	});

	describe('loading the examples in ./coffee', function () {

		var coffee;

		it('completes without error', function () {
			loader.loadSync(container, './coffee');
		});

		describe('since ./coffee/index.js` exported $init property requires dependency-injected $callback', function () {
			var coffee_module = require('./coffee');

			it('it has not been called', function () {
				expect(coffee_module.call_count).to.be(0);
			});

			it('it has not made it`s own regisrations (black)', function () {
				expect(container.has('black')).to.be(false);
			});

			it('the container won`t fulfill requests for the $black value', function () {
				// coffee hasn't been fulfilled yet...
				expect(coffee).to.be.an('undefined');
			});

			describe('when a $coffeeCb is registered with the container', function () {

				var ourdata = 'This is our coffee value';

				// capture the $coffee when it becomes available...
				container.when('black', function (val) {
					coffee = val;
				});

				it('the module`s $init is called', function () {
					// ./coffee/index.js' $init method is awaiting a $coffeeCb,
					// this registration will allow minioc to fulfill the $init
					// method...
					container.register('coffeeCb').as.value(
						function ($moreData) {
							return ($moreData === ourdata) ? 'Yay!' : 'Booo!';
						});
					expect(coffee_module.call_count).to.be(1);
				});

				describe('once the module`s init function has been called', function () {

					it('black is registered with the container', function () {
						expect(container.has('black')).to.be(true);
					});

					it('coffee cannot be resolved by the container due to the missing dependency (moreData)', function () {
						expect(container.can('black')).to.be(false);
						expect(coffee).to.be.an('undefined');
					});

					describe('when we register the last remaining dependency (moreData)', function () {

						it('the dependency graph is fully fulfilled and our callback is invoked', function () {
							// now that the $init method has been called there is a
							// registration for $black; it is awaiting a $config...
							container.register('moreData').as.value(ourdata);

							// now that there is a data, all registrations are fulfilled
							// and our callback was invoked, capturing the $coffee value...
							expect(coffee).to.be('Yay!');
						});

					});

				});

			});

		});

	});


	describe('loading the examples in ./load_all', function () {

		// the directory ./load_all contains javascript files,
		// each exporting an $init function, each binding a 'next'
		// parameter, and calling next() so that loading continues.

		it('loads without error', function () {
			loader.loadSync(container, './load_all');
		});

		it('loaded 1.js', function () {
			expect(container.can('1')).to.be(true);
		});

		it('loaded 2.js', function () {
			expect(container.can('2')).to.be(true);
		});

		it('loaded 3.js', function () {
			expect(container.can('3')).to.be(true);
		});

		it('loaded sub/4.js', function () {
			expect(container.can('4')).to.be(true);
		});

		it('loaded sub/5.js', function () {
			expect(container.can('5')).to.be(true);
		});
	});



	describe('loading the examples in ./load_partial', function () {

		// the directory ./load_partial contains javascript files,
		// each exporting an $init function. 'index.js' binds and calls
		// next(), but 'second.js' does not, so 'third.js' is not
		// initialized.

		it('loads without error', function () {
			loader.loadSync(container, './load_partial');
		});

		it('loaded index.js', function () {
			expect(container.can('first')).to.be(true);
		});

		it('loaded second.js', function () {
			expect(container.can('second')).to.be(true);
		});

		it('did not loaded third.js', function () {
			expect(container.can('third')).to.be(false);
		});

	});
});