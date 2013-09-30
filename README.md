minioc-loader [![Build Status](https://travis-ci.org/flitbit/minioc-loader.png?branch=master)](https://travis-ci.org/flitbit/minioc-loader)
=============

Utility for loading and initializing minioc aware modules (nodejs).

[minioc](https://github.com/flitbit/minioc) is a miniature IoC container for [nodejs](http://nodejs.org/) - see the [github repo](https://github.com/flitbit/minioc) for more info.

## Loader

The loader loads either an individual .js files or a directory. Loader treats each .js file as a module, using node's `require` function. Loader works by convention; it looks for a top-level exported function with the name `$init`. If a module makes such an export, loader simply hands the function to `minioc` to `fulfill`.

`minioc`'s `fulfill` logic will call the `$init` function as soon as it is able to inject the dependencies indicated by the `$init` function's signature.

## Usage

```javascript
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
```
## Install

```bash
npm install minioc-loader
```

## Options

* `basePath` - **required** base directory path, used to resolve relative paths during `loadSync` calls

## Operations

* `loadSync` - loads a module or a directory according to the minioc-loader convention
 * `container` (argument 0) - a minioc container used when initializing modules
 * `path` (argument 1) - a path (relative to loader's `basePath`) to be loaded. Can be a .js module or a directory.

## Conventions

When calling `loadSync`...

If `path` is a .js file then the loader will treat the file as a module and load it using node's `require` function. If the module exports a function with the name `$init` then the loader will tell `minioc` to `fulfill` it. Minioc identifies dependencies by convention; any named argument will be injected if there is a matching registration in the container. Arguments beginning with a dollar sign `$` is considered _required dependencies_ and minioc will call the function as soon as minioc is able to inject all of the required dependencies. When minioc calls the exported `$init` function, `this` is bound to the IoC container previously given to `loadSync`.

If `path` is a directory, the loader will look for an `index.js` file and if present, the index file will be processed. For initializing modules other than `index.js`, see the discussion on controlling what gets initialized below.

[Study the example code to understand it fully](https://github.com/netsteps/minioc-loader/blob/master/examples/example.js), in particular, notice that the order in which registrations occur on the container is unimportant because minioc will fulfill all requests as soon as their dependencies can be met.

## Controlling What Gets Initialized in Directories

The loader will always invoke the first exported `$init` function that it finds in a directory. It begins by loading an `index.js` file if one exists, otherwise it processes all files in alphabetical (_string sort_) order.

If the directory contains sub-directories, they are processed in-line as the files are being processed. The loader process is repeated for each sub-directory.

For a given directory, the first exported `$init` function is scheduled. The loader does not directly call the `$init` function, instead it uses the minioc `container`'s `fulfill` operation. When the loader calls minioc's `fulfill`, it always provides two options: `next` and `loader`.

**next** --- a callback function used to tell the loader to continue processing the directory.
**loader*** --- the loader itself enabling you to load other files and directories

When an `$init` function fails to bind and call the `next` callback, it effectively cancels the loading process.

## Building Blocks

You may also find these other projects useful...

* [minioc-broadway](https://github.com/spicydonuts/minioc-broadway) - Broadway plugin for adding minioc and minioc-loader to broadway/flatiron apps.
