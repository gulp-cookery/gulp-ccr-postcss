# gulp-ccr-postcss

Transforming styles with JS plugins. A cascading configurable gulp recipe for [gulp-chef](https://github.com/gulp-cookery/gulp-chef).

## Install

``` bash
npm install --save-dev "gulpjs/gulp#4.0" gulp-chef gulp-ccr-postcss
```

## Recipe

PostCSS

## Ingredients

* [gulp-postcss](https://github.com/postcss/gulp-postcss)

* [gulp-flatten](https://github.com/armed/gulp-flatten)

* [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)

## API

### config.processors

An array or an object of processors.

If an array, items must be pre-loaded processor function; or string, and gulp-ccr-postcss will load the processor without initializing it.

If an object, property name must be processor module name, and value be pre loaded processor function; or option value, and gulp-ccr-postcss will load the processor and initialize it with the option value if it is not falsy.

In all cases, you can omit "postcss-" prefix for module names.

### config.flatten

If you are not inlining css files with [`postcss-import`](https://github.com/postcss/postcss-import), maybe you want to remove or replace file paths.

### config.sourcemaps

Options to generate sourcemaps. False to disable sourcemaps; True to generate inline sourcemaps; String to generate external sourcemaps at given dest folder.

### config.syntax

Use a custom parser. Currently only supports `"scss"`, note that the [`postcss-scss`](https://github.com/postcss/postcss-scss) plugin must be installed first.

## Usage

``` bash
$ npm install --save-dev "gulpjs/gulp#4.0" gulp-chef gulp-ccr-postcss postcss-cssnext cssnano precss
```

``` javascript
var gulp = require('gulp');
var chef = require('gulp-chef');

var meals = chef({
    src: 'app/',
    dest: 'dist/',
    postcss: {
        src: '**/*.css',
        processors: {
            cssnext: {
                features: {
                    autoprefixer: { browsers: ['last 1 version'] }
                }
            },
            cssnano: { safe: true },
            precss: ''
        },
        flatten: true,
        sourcemaps: './'
    }
});

gulp.registry(meals);
```

This roughly do the same thing as the following normal gulp construct:

``` bash
$ npm install --save-dev "gulpjs/gulp#4.0" gulp-flatten gulp-sourcemaps gulp-if gulp-postcss postcss-cssnext cssnano precss
```

``` javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var flatten = require('gulp-flatten');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');

var config = {
    dest: 'dist/',
    styles: 'app/**/*.css',
    flatten: true,
    sourcemaps: './'
};

var processors = [
    require('postcss-cssnext')({
        features: {
            autoprefixer: { browsers: ['last 1 version'] }
        }
    }),
    require('cssnano')({ safe: true }),
    require('precss')
];

function postcss() {
    return gulp.src(config.styles)
        .pipe(sourcemaps.init())
        .pipe(gulpif(config.flatten, flatten()))
        .pipe(postcss(processors))
        .pipe(gulpif(config.sourcemaps, sourcemaps.write(config.sourcemaps)))
        .pipe(gulp.dest(config.dest));
}

gulp.task(postcss);
```

### Use the postcss-scss plugin

``` bash
$ npm install --save-dev "gulpjs/gulp#4.0" gulp-chef gulp-ccr-postcss postcss-scss cssnano
```

``` javascript
var gulp = require('gulp');
var chef = require('gulp-chef');

var meals = chef({
    src: 'app/',
    dest: 'dist/',
    postcss: {
        src: '**/*.scss',
        processors: {
            cssnano: { safe: true }
        },
        syntax: 'scss',
        sourcemaps: './'
    }
});

gulp.registry(meals);
```

## Standalone

Gulp-ccr-postcss can be used as a standalone function.

``` javascript
var gulp = require('gulp');
var postcss = require('gulp-ccr-postcss');

function css() {
    return postcss({
        src: 'app/**/*.css',
        processors: {
            cssnext: {
                features: {
                    autoprefixer: { browsers: ['last 1 version'] }
                }
            },
            cssnano: { safe: true },
            precss: '',
        },
        flatten: true,
        sourcemaps: './'
    });
}

gulp.task(css);
```

## License
MIT

## Author
[Amobiz](https://github.com/amobiz)
