'use strict';

var gulp = require("gulp"),//http://gulpjs.com/
	gutil = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	rename = require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps = require('gulp-sourcemaps'), //Genera un mapa de referencias para los archivos. 
	path = require('path'), //Es de Node. Concatena.
	debug = require('gulp-debug'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	changed = require('gulp-changed'),
	del = require('del'),
	cleanDest = require('gulp-clean-dest'),
	// imagemin = require('gulp-imagemin'),
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
var HTML_FILES = SRC_HTML_BASE + '/**/*.html';
var JS_FILES = SRC_JAVASCRIPT_BASE + '/**/*.js';
var JS_FILES_BUNDLES = path.join(SRC_JAVASCRIPT_BASE, 'bundles') + '/**/*';
var IMAGES_FILES = SRC_IMAGES_BASE + '/**/*';
var ICON_FILES = SRC_FONTS_BASE + '/**/*';

var ENVIRONMENT;  // 'dev' | 'dep' 
var runFirstTime = true;


//*************************************    SECCIÓN  Tasks    *************************************

// require('gulp-stats')(gulp);

function clean (done) {
	if(runFirstTime) { return del(['dev']); }
	return done();	
};

gulp.task("sass", gulp.series(clean, function sassFunction(){
	showComment('Changed SASS File');
	return gulp.src(SRC_SASS_BASE + '/style.scss')
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer())	
	.pipe(rename('style.css'))
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest(path.join(FOLDER_DEV, 'css'))).on('error', gutil.log);
}));


//*************************************    SECCIÓN  util    *************************************

function showComment(string){
	if(runFirstTime) { return; }
	log('');
	log('------------------------------------------------');
	log(string);
	log('------------------------------------------------');
}

function onError(err) {
	log(err);
}

function returnDestFolder(){
	var destFolder;
	switch (ENVIRONMENT) {
		case 'dev':
			destFolder = FOLDER_DEV;
			break;
		case 'dep':
			destFolder = FOLDER_DIST;
			break;
		default:
			destFolder = FOLDER_DEV;
			break;
	}
	return destFolder;
}

//*************************************    SECCIÓN  runner    *************************************

gulp.task('default', gulp.series(clean, 'sass', function () {
	ENVIRONMENT = 'dev';
	showComment('COMPLETE');
	runFirstTime = false;
}));	
/*
gulp.task('deploy', ['copyTemplates'], function () {
	ENVIRONMENT = 'dep';
	runFirstTime = false;
	showComment('COMPLETE DEPLOY');
});	
*/
//************************************************************************************

