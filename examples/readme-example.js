var loader = require('minioc-loader')({ basePath: __dirname })
, minioc = loader.minioc // minioc is exported for convenience
;

loader.loadSync(minioc.root, './config.js');
loader.loadSync(minioc.root, './lib/');

// standard minioc here, our startup function has two
// dependencies that will be injected by minioc...
minioc.fulfill('startup', function($config, $app) {

	// assuming that the two paths loaded above result in registrations
	// being made for both `$config` and `$app` objects, minioc will call
	// this function.

	//... do your stuff ...
	console.log('nothing to see here');

});