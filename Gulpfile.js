'use strict';

var gulp = require("gulp"),//http://gulpjs.com/
	gutil = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	rename = require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps = require('gulp-sourcemaps'),
	path = require('path'),
	plumber = require('gulp-plumber'),
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

require('gulp-stats')(gulp);

gulp.task("sass", function(){ 
	log("Generate CSS files " + (new Date()).toString());
    return gulp.src(SASS_FILES)
    	.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())	
		.pipe(rename('style.css'))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(path.join(FOLDER_DEV, 'css')))
		.pipe(plumber({
            errorHandler: onError
        }));
});





//*************************************    SECCIÓN  Prod    *************************************

	gulp.task("minCss", function(){
		log("Generate minify CSS   " + (new Date()).toString());
		return gulp.src(FOLDER_DEV + '/**/*.css')
			.pipe(minifycss())
			.pipe(gulp.dest(FOLDER_DIST))
			.pipe(plumber({
	            errorHandler: onError
	        }));
	});

//************************************************************************************


function onError(err) {
    log(err);
}

gulp.task("watch", function(){
	log("Watching scss files for modifications");
	gulp.watch(SASS_FILES, ["sass"]);
});
	

//************************************************************************************



