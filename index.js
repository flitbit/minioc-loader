var fs = require('fs')
, dbc  = require('dbc.js')
, path = require('path')
, minioc = require('minioc')
, pkg = require('./package')
;

var _base
;

function loader(options) {
	if (options && options.basePath) {
		loader.basePath = options.basePath;
	}
	return loader;
}

function trimBasePath(p) {
	return (p.indexOf(_base) == 0)
	? p.substring(_base.length+1)
	: p;
}

function loadSync(container, file) {
	dbc(['string' === typeof _base], 'Invalid operation; basePath must be set before loading modules.');
	var fp = (file.indexOf(_base) === 0) ? file : path.join(_base, file)
	, stat = fs.lstatSync(fp)
	, m
	;
	if (stat.isDirectory()) {
		var files = fs.readdirSync(fp)
		, f
		, i
		, len = files.length
		;
		if (len) {
			i = files.indexOf('index.js');
			if (i >= 0) {
				f = path.join(fp, files[i]);
				loadSync(container, f);
			} else {
				for(i = 0; i < len; i++) {
					f = path.join(fp, files[i]);
					loadSync(container, f);
				}
			}
		}
	} else {
		if (path.extname(file) === '.js') {
			m = require(file);
			if ('function' === typeof m && m.name === '$init') {
				// conventional $init method,
				// have the container fulfill...
				container.fulfill(file, m);
			}
		}
	}
	return loader;
}

Object.defineProperties(loader, {

	basePath: {
		get: function() { return _base; },
		set: function(val) {
			dbc([fs.existsSync(val), fs.lstatSync(val).isDirectory()], 'Base path must be an existing directory.');
			_base = val;
		},
		enumerable: true
	},

	loadSync: {
		value: loadSync,
		enumerable: true
	},

	minioc: { value: minioc, enumerable: true },
	
	version: { enumerable: true, value: pkg.version }

});

module.exports = loader;