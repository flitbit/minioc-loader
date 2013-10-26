"use strict";

/* jshint laxbreak: true, laxcomma: true */

var fs = require('fs')
, util = require('util')
, dbc    = require('dbc.js')
, path   = require('path')
, minioc = require('minioc')
, pkg    = require('./package')
, extend = util._extend
;

var cachePath,
cacheLog,
indentStr = '  '
;

function indent(n, message) {
	n = n || 1;
	return new Array(n + 1).join(indentStr).concat(message);
}

function log(level, message) {
	if (level && cacheLog && cacheLog[level])
	{
		cacheLog[level](message);
	}
}

function loader(options) {
	if (options) {
		if (options.basePath) { loader.basePath = options.basePath; }
		if (options.log) { loader.log = options.log; }
	}
	return loader;
}

function withoutBasePath(f, dir) {
	dir = dir || cachePath;
	return (f.indexOf(dir) === 0)
	? f.substring(dir.length + 1)
	: f;
}

function withBasePath(f, dir) {
	dir = dir || cachePath;
	return (f.indexOf(dir) === 0) ? f : path.join(dir, f);
}

function loadFile(depth, container, file, options, next) {
	var m
	;
	if (path.extname(file) === '.js') {
		log('info', 'loader: '.concat(indent(depth, file)));
		m = require(file);
		if ('function' === typeof m && m.name === '$init') {
			container.fulfill(file, m, extend(options, { next: next, loader: loader}));
		} else if (m.$init && typeof m.$init === 'function') {
			container.fulfill(file, m.$init, extend(options, { next: next, loader: loader }));
		} else {
			if (next) { next(); }
		}
	} else {
		if (next) { next(); }
	}
}

function arrayExcept(arr, i) {
	if (i > 0)
	{
		if (i === arr.length - 1)
		{
			return arr.slice(0, arr.length - 1);
		}
		return arr.slice(0, i).concat(arr.slice(i + 1));
	}
	return arr.slice(1);
}

function loadDir(depth, container, dir, options, next) {
	var files = fs.readdirSync(dir)
	, i = -1
	, f
	, stat
	, len = files.length
	, pipe = function next(err) {
		if (err) {
			if (next) { next(err); }
			return;
		}
		if (++i < len) {
			f = withBasePath(files[i], dir);
			stat = fs.lstatSync(f);
			if (stat.isDirectory()) {
				loadDir(depth + 1, container, f, options);
				next();
			} else {
				loadFile(depth + 1, container, f, options, next);
			}
		}
	}
	;
	log('info', 'loader: '.concat(indent(depth, dir)));
	files = files.sort(function (lhs, rhs) {
		if (lhs < rhs) { return -1; }
		if (lhs > rhs) { return 1; }
		return 0;
	});
	if (len) {
		i = files.indexOf('index.js');
		if (i >= 0) {
			loadFile(depth + 1, container, withBasePath(files[i], dir), options, function (err) {
				files = arrayExcept(files, i);
				--len;
				i = -1;
				pipe(err);
			});
		} else {
			pipe(null);
		}
	} else {
		if (next) { next(null, loader); }
	}
}

function loadSync(container, file, options) {
	dbc(['string' === typeof cachePath], 'Invalid operation; basePath must be set before loading modules.');
	var fp = (file.indexOf(cachePath) === 0) ? file : path.join(cachePath, file)
	, stat = fs.lstatSync(fp)
	, m
	;
	options = options || {};
	if (stat.isDirectory()) {
		loadDir(0, container, fp, options);
	} else {
		loadFile(0, container, fp, options);
	}
	return loader;
}

Object.defineProperties(loader, {

	basePath: {
		get: function () { return cachePath; },
		set: function (val) {
			dbc([fs.existsSync(val), fs.lstatSync(val).isDirectory()], 'Base path must be an existing directory.');
			cachePath = val;
		},
		enumerable: true
	},

	log: {
		get: function () { return cacheLog; },
		set: function (val) {
			cacheLog = val;
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