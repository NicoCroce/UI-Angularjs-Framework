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
	concat = require('gulp-concat'),
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
var JS_FILES = path.join(SRC_JAVASCRIPT_BASE, 'partials') + '/**/*.js';
var JS_FILES_BUNDLES = path.join(SRC_JAVASCRIPT_BASE, 'bundles') + '/**/*';
var IMAGES_FILES = SRC_IMAGES_BASE + '/**/*';

var ENVIRONMENT;  // 'dev' | 'dep' 
var runFirstTime = true;


//*************************************    SECCIÓN  Tasks    *************************************

// require('gulp-stats')(gulp);

gulp.task('connect', ['copyTemplates', 'sass', 'jsConcat', 'copyImg'], function() {
	connect.server({
		root: 'dev',
		port: 2173
	});
});


gulp.task("sass", function(){
	showComment('Changed SASS File');
	return gulp.src(SASS_FILES)
	// .pipe(debug({title: 'Source file: '}))
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(autoprefixer())	
	.pipe(rename('style.css'))
	// .pipe(debug({title: 'Dest file: '}))
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest(path.join(FOLDER_DEV, 'css')))
	.pipe(plumber({
		errorHandler: onError
	}));
});

gulp.task("copyTemplates", function () {
	var destFolder = returnDestFolder();	
	showComment('Copying HTML Files');
	return gulp.src(HTML_FILES)
	.pipe(gulp.dest(destFolder))
	.pipe(plumber({
		errorHandler: onError
	}));
});

gulp.task("copyImg", function () {
	var destFolder = returnDestFolder();	
	showComment('Copying Images Files');
	return gulp.src(IMAGES_FILES)
	.pipe(gulp.dest(path.join(destFolder, 'img')))
	.pipe(plumber({
		errorHandler: onError
	}));
});

gulp.task("copyJs", function () {
	var destFolder = returnDestFolder();	
	showComment('Copying JS Files');
	return gulp.src(JS_FILES_BUNDLES)
	.pipe(gulp.dest(path.join(destFolder, 'js/bundles')))
	.pipe(plumber({
		errorHandler: onError
	}));
});

gulp.task('jsConcat', ['copyJs'], function() {
  gulp.src(JS_FILES)
  	.pipe(sourcemaps.init())
    .pipe( concat('script.js') ) // concat pulls all our files together before minifying them
    .pipe(sourcemaps.write('./maps'))
    // .pipe(uglify())
    .pipe(gulp.dest(path.join(FOLDER_DEV, 'js')))
    .pipe(plumber({
		errorHandler: onError
	}));
});

// gulp.task('compressImg', function() {
//     return gulp.src(IMAGES_FILES)
//            .pipe(imagemin({
//                 progressive: true
//            }))
//            .pipe(gulp.dest(path.join(FOLDER_DEV, 'img')));
// });

gulp.task("watch", function(){
	gulp.watch(SASS_FILES, ['sass']);
	gulp.watch(HTML_FILES, ['copyTemplates']);
	gulp.watch(JS_FILES, ['jsConcat', 'copyJs']);
	// .on('change', function(event) {
 //      log('File ' + event.path + ' was ' + event.type + ', running tasks...');
 //    });
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

gulp.task('default', ['connect', 'watch'], function () {
	ENVIRONMENT = 'dev';
	showComment('COMPLETE');
	runFirstTime = false;
});	

gulp.task('deploy', ['copyTemplates'], function () {
	ENVIRONMENT = 'dep';
	runFirstTime = false;
	showComment('COMPLETE DEPLOY');
});	

//************************************************************************************

