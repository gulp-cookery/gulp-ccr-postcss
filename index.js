'use strict';

var schema = {
	title: 'PostCSS',
	description: 'Transforming styles with JS plugins.',
	type: 'object',
	properties: {
		processors: {
			alias: ['processor'],
			anyOf: [{
				type: 'object',
				patternProperties: {
					'.*': {
					}
				}
			}, {
				type: 'array',
				items: {
					type: 'string'
				}
			}]
		},
		flatten: {
			description: 'Remove or replace relative paths for files.',
			type: 'boolean',
			default: false
		},
		syntax: {
			description: 'Use a custom parser. Currently only supports `scss`, note that the `postcss-scss` plugin must be installed first.',
			type: 'string'
		},
		sourcemaps: {
			description: 'Source map support.',
			alias: ['sourcemap'],
			anyOf: [{
				type: 'boolean'
			}, {
				type: 'string'
			}],
			default: false
		},
		required: ['processors']
	}
};

function postcss() {
	var ps = require('gulp-postcss');
	var flatten = require('gulp-flatten');
	var sourcemaps = require('gulp-sourcemaps');

	var gulp, config, map, stream, processors, parser;

	if (this) {
		gulp = this.gulp;
		config = this.config;
	} else {
		gulp = require('gulp');
		config = arguments[0] || {};
	}

	processors = load(config.processors);
	stream = config.upstream || gulp.src(config.src.globs || config.src, config.src.options);
	map = typeof config.sourcemaps === 'boolean' ? null : config.sourcemaps;

	if (config.sourcemaps) {
		stream = stream.pipe(sourcemaps.init());
	}

	if (config.syntax === 'scss') {
		parser = require('postcss-scss');
		stream = stream.pipe(ps(processors, { syntax: parser }));
	} else {
		stream = stream.pipe(ps(processors));
	}

	if (config.flatten) {
		stream = stream.pipe(flatten());
	}

	if (config.sourcemaps) {
		stream = stream.pipe(sourcemaps.write(map));
	}

	return stream.pipe(gulp.dest(config.dest.path, config.dest.options));
}

function load(list) {
	if (Array.isArray(list)) {
		return list.map(function (value) {
			if (typeof value === 'function') {
				return value;
			} else if (typeof value === 'string') {
				return _load(value);
			}
		});
	}
	return Object.keys(list).map(function (name) {
		var opts = list[name];

		if (typeof opts === 'function') {
			return opts;
		}
		return _load(name, opts);
	});
}

function _load(name, opts) {
	var processor;

	processor = _require(name);
	return opts ? processor(opts) : processor;
}

function _require(name) {
	try {
		return require(name);
	} catch (ex) {
		if (ex.code !== 'MODULE_NOT_FOUND') {
			throw ex;
		}
		return require('postcss-' + name);
	}
}

module.exports = postcss;
module.exports.schema = schema;
module.exports.type = 'task';
