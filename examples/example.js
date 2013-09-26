var util = require('util')
, loader = require('..')
, expect = require('expect.js')
, minioc = loader.minioc
;

// initialize loader...
loader({ basePath: __dirname, log:
	{
		info: function(message) {
			console.log(message);
		}
	}
});

// We write some connect/express apps so often have
// variables with these names...
var app = {
	use: function(what) {
		console.log(what.concat(' provided to the app'));
	}
}
, config = { jib: 'jab' }
, container = minioc.root
;

container.fulfill("main", function($piper) {

	// this `main` function will be called by minioc as soon
	// as its dependency can be injected.

	console.log('main received: `'.concat($piper, '`.'));

});

// place some useful things into the container...
container.register('app').as.value(app);
container.register('config').as.value(config);

// again, when using connect/express apps this is common...
loader.loadSync(container, './routes');