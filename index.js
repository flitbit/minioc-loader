var fs   = require('fs')
, dbc    = require('dbc.js')
, path   = require('path')
, minioc = require('minioc')
, pkg    = require('./package')
;

var _base
, _log
, _indentStr = '  '
;

function indent(n, message) {
	n= n || 1;
	return Array(n + 1).join(_indentStr).concat(message);
}

function log(level, message) {
	if (level && _log && _log[level])
	{
		_log[level](message);
	}
}

function loader(options) {
	if (options) {
		if (options.basePath) loader.basePath = options.basePath;
		if (options.log) loader.log = options.log;
	}
	return loader;
}

function withoutBasePath(f, dir) {
	dir= dir || _base;
	return (f.indexOf(dir) == 0)
	? f.substring(dir.length+1)
	: f;
}

function withBasePath(f, dir) {
	dir= dir || _base;
	return (f.indexOf(dir) === 0) ? f : path.join(dir, f)
}

function loadFile(depth, container, file, cb) {
	var m
	;
	if (path.extname(file) === '.js') {
		log('info', 'loader: '.concat(indent(depth, file)));
		m = require(file);
		if ('function' === typeof m && m.name === '$init') {
			container.fulfill(file, m, { next: cb });
		} else if (m.$init && typeof m.$init === 'function') {
			container.fulfill(file, m.$init, { next: cb });
		}
	}
}

function loadDir(depth, container, dir, cb) {
	var files = fs.readdirSync(dir)
	, i = -1
	, f
	, stat
	, len = files.length
	, pipe = function next(err) {
		if (err) {
			if (cb) cb(err); return;
		}
		if (++i < len) {
			f = withBasePath(files[i], dir);
			stat = fs.lstatSync(f);
			if (stat.isDirectory()) {
				loadDir(depth+1, container, f);
				next();
			} else {
				loadFile(depth+1, container, f, next);
			}
		} else {
			if (cb) cb(null, loader);
		}
	}
	;
	log('info', 'loader: '.concat(indent(depth, dir)));
	if (len) {
		i = files.indexOf('index.js');
		if (i >= 0) {
			loadFile(depth + 1, container, withBasePath(files[i]), function(err) {
				files = files.splice(i, 1);
				--len; i = -1;
				pipe(err);
			});
		} else {
			pipe(null);
		}
	} else {
		if (cb) cb(null, loader);
	}
}

function loadSync(container, file) {
	dbc(['string' === typeof _base], 'Invalid operation; basePath must be set before loading modules.');
	var fp = (file.indexOf(_base) === 0) ? file : path.join(_base, file)
	, stat = fs.lstatSync(fp)
	, m
	;
	if (stat.isDirectory()) {
		loadDir(0, container, fp);
	} else {
		loadFile(0, container, fp);
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

	log: {
		get: function() { return _log; },
		set: function(val) {
			_log = val;
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