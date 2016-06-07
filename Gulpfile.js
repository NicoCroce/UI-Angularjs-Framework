'use strict';

var gulp = require("gulp"),//http://gulpjs.com/
	gutil = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	rename = require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps = require('gulp-sourcemaps'), //Genera un mapa de referencias para los archivos. 
	path = require('path'), //Es de Node. Concatena.
	plumber = require('gulp-plumber'), //Control de errores.
	debug = require('gulp-debug'),
	connect = require('gulp-connect'),
	log = gutil.log;


// Folders for assets, development environment and production environment
var FOLDER_ASSETS = 'assets';
var FOLDER_DEV = 'dev';
var FOLDER_BUILD = 'build';
var FOLDER_DIST = 'dist';

var SRC_SASS_BASE = path.join(FOLDER_ASSETS, 'styles');
var SRC_IMAGES_BASE = path.join(FOLDER_ASSETS, 'images');
var SRC_FONTS_BASE = path.join(FOLDER_ASSETS, 'icons');
var SRC_JAVASCRIPT_BASE = path.join(FOLDER_ASSETS, 'js');
var SRC_HTML_BASE = path.join(FOLDER_ASSETS, 'templates');

var SASS_FILES = SRC_SASS_BASE + '/**/*.scss';
var HTML_FILES = SRC_HTML_BASE + '/**/*';

var runFirstTime = true;


//*************************************    SECCIÓN  Tasks    *************************************

// require('gulp-stats')(gulp);

// gulp.task('connect', connect.server({
//     root: ['dev'],
//     open: { browser: 'Google Chrome' }
//   }));

gulp.task('connect', function() {
	connect.server({
		root: 'dev',
		port: 2173
	});
});


gulp.task("sass", function(){
	showComment('Changed SASS File');
	return gulp.src(SASS_FILES)
	.pipe(debug({title: 'Source file: '}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer())	
	.pipe(rename('style.css'))
	.pipe(debug({title: 'Dest file: '}))
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest(path.join(FOLDER_DEV, 'css')))
	.pipe(plumber({
		errorHandler: onError
	}));
});

gulp.task("copyTemplates", function () {
	showComment('Copying HTML Files');
	return gulp.src(HTML_FILES)
	.pipe(gulp.dest(FOLDER_DEV))
	.pipe(plumber({
		errorHandler: onError
	}));
});

//*************************************    SECCIÓN  Prod    *************************************

gulp.task("minCss", ['sass'], function(){
	log("Generate minify CSS   " + (new Date()).toString());
	return gulp.src(FOLDER_DEV + '/**/*.css')
	.pipe(minifycss())
	.pipe(gulp.dest(FOLDER_DIST))
	.pipe(plumber({
		errorHandler: onError
	}));
});

//************************************************************************************


//*************************************    SECCIÓN  util    *************************************

function showComment(string){
	if(runFirstTime) { return; }
	log('');
	log('------------------------------------------------');
	log(string);
	log('------------------------------------------------');
}

//************************************************************************************

function onError(err) {
	log(err);
}

gulp.task("watch", function(){
	gulp.watch(SASS_FILES, ["sass"]);
});

gulp.task('default', ['connect', 'copyTemplates', 'sass', 'watch'], function () {
	 showComment('COMPLETE');
	 !runFirstTime;
});

//************************************************************************************



