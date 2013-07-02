var util = require('util')
, minioc = require('minioc')
, loader = require('..')
, expect = require('expect.js')
;

// We write some connect/express apps so often have
// variables with these names...
var app = {
	use: function(what) {
		console.log('Using: '.concat(what));
	}
}
, config = { jib: 'jab' }
, container = minioc.root
;

// place some useful things into the container...
container.register('$app').as.value(app);
container.register('$config').as.value(config);

// always establish the loader's base path so
// relatives work.
loader.basePath = __dirname;

// again, when using connect/express apps this is common...
loader.loadSync(container, './routes');