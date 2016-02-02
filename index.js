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

	var gulp = this.gulp;
	var config = this.config;
	var map = typeof config.sourcemaps === 'boolean' ? null : config.sourcemaps;
	var stream, processors;

	processors = load(config.processors);
	stream = config.upstream || gulp.src(config.src.globs, config.src.options);

	if (config.sourcemaps) {
		stream = stream.pipe(sourcemaps.init());
	}

	stream = stream.pipe(ps(processors));

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
		if (ex.code !== 'ENOENT') {
			throw ex;
		}
		return require('postcss-' + name);
	}
}

module.exports = postcss;
module.exports.schema = schema;
module.exports.type = 'task';
