'use strict';

var gulp = require("gulp"),//http://gulpjs.com/
	gutil = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	rename = require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps = require('gulp-sourcemaps'),
	path = require('path'),
	log = gutil.log;


// Folders for assets, development environment and production environment
var SRC_ASSETS_BASE = 'assets';

var FOLDER_ASSETS = 'assets';
var FOLDER_DEV = 'dev';
var FOLDER_BUILD = 'build';
var FOLDER_DIST = 'dist';

var SRC_SASS_BASE = path.join(SRC_ASSETS_BASE, 'styles');
var SRC_IMAGES_BASE = path.join(SRC_ASSETS_BASE, 'images');
var SRC_FONTS_BASE = path.join(SRC_ASSETS_BASE, 'icons');
var SRC_JAVASCRIPT_BASE = path.join(SRC_ASSETS_BASE, 'js');
var SRC_HTML_BASE = path.join(SRC_ASSETS_BASE, 'templates');

var SASS_FILES = SRC_SASS_BASE + '/**/*.scss';


//*************************************    SECCIÓN  Tasks    *************************************

gulp.task("sass", function(){ 
	log("Generate CSS files " + (new Date()).toString());
    gulp.src(SASS_FILES)
    	// .pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4' ))	
		// .pipe(sourcemaps.write('./maps'))
		.pipe(rename('nico.css'))
		.pipe(gulp.dest(path.join(FOLDER_DEV, 'css')));
		// .pipe(rename({suffix: '.min'}))
		// .pipe(minifycss())
		// .pipe(gulp.dest('target/css'));
});

gulp.task('auto', function () {
	log("Generate CSS files");
	return gulp.src('dev/css/nico.css')
		.pipe(autoprefixer('last 2 version'))	 //, 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
		.pipe(rename('asd.css'))
		.pipe(gulp.dest('dev/css'));
});

gulp.task("watch", function(){
	log("Watching scss files for modifications");
	gulp.watch(SASS_FILES, ["sass"]);
});
	

//************************************************************************************



