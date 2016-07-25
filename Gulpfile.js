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


gulp.task("clean", gulp.series(clean));

gulp.task("sass", gulp.series(sassFunction));

gulp.task("copyTemplates", gulp.series(cleanTemplates, copyTemplates));

gulp.task("copyImg", gulp.series(cleanImg, copyImg));

gulp.task("copyIcons", gulp.series(cleanIcons, copyIcons));

gulp.task("copyJs", gulp.series(cleanJs, copyJs));

gulp.task('jsConcat', gulp.series('copyJs', jsConcat));

gulp.task('connect', gulp.series(clean, gulp.parallel("copyTemplates", "sass", "jsConcat", "copyImg", "copyIcons"), connectServer));

gulp.task("watch", function () {
	gulp.watch(SASS_FILES).on('change', function (pathFile) {
		gulp.series("sass");
		log('El archivo modificado es: ' + pathFile);
	});
	gulp.watch(HTML_FILES).on('change', function (pathFile) {
		gulp.series("copyTemplates");
		log('El archivo modificado es: ' + pathFile);
	});
	gulp.watch(JS_FILES).on('change', function (pathFile) {
		gulp.series("jsConcat", "copyJs");
		log('El archivo modificado es: ' + pathFile);
	});
	gulp.watch(ICON_FILES).on('change', function (pathFile) {
		gulp.series("copyIcons");
		log('El archivo modificado es: ' + pathFile);
	});
});

//*************************************    SECCIÓN  Functions    *************************************

function clean(done) {
	del([FOLDER_DEV]);
	return done();
};

function cleanTemplates(done) {
	del([FOLDER_DEV + '/partials']);
	del([FOLDER_DEV + '/index.html']);
	return done();
};

function cleanImg(done) {
	del([FOLDER_DEV + '/img']);
	return done();
};

function cleanIcons(done) {
	del([FOLDER_DEV + '/css/styleIcons.css']);
	del([FOLDER_DEV + '/fonts']);
	return done();
};

function cleanJs(done) {
	del([FOLDER_DEV + '/js/bundles']);
	return done();
};

function connectServer() {
	connect.server({
		root: FOLDER_DEV,
		port: 2173
	});
};

function sassFunction() {
	showComment('Changed SASS File');
	return gulp.src(SRC_SASS_BASE + '/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename('style.css'))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(path.join(FOLDER_DEV, 'css'))).on('error', gutil.log);
};

function copyTemplates() {
	var destFolder = returnDestFolder();
	showComment('Copying HTML Files');
	return gulp.src(HTML_FILES)
		.pipe(gulp.dest(destFolder)).on('error', gutil.log);
};

function copyImg() {
	var destFolder = returnDestFolder();
	showComment('Copying Images Files');
	return gulp.src(IMAGES_FILES)
		.pipe(gulp.dest(path.join(destFolder, 'img'))).on('error', gutil.log);
};

function copyIcons(done) {
	var destFolder = returnDestFolder();
	log('Copying Icons Files');
	gulp.src(SRC_FONTS_BASE + '/**/*.css')
		.pipe(gulp.dest(path.join(destFolder, 'css'))).on('error', gutil.log);

	gulp.src(SRC_FONTS_BASE + '/fonts/**/*')
		.pipe(gulp.dest(path.join(destFolder, 'fonts'))).on('error', gutil.log);
	return done();
};

function copyJs() {
	showComment('Copying JS Files');
	var destFolder = returnDestFolder();
	return gulp.src(JS_FILES_BUNDLES)
		.pipe(gulp.dest(path.join(destFolder, 'js/bundles'))).on('error', gutil.log);
}

function jsConcat() {
	return gulp.src(JS_FILES)
		.pipe(sourcemaps.init())
		.pipe(concat('script.js')) // concat pulls all our files together before minifying them
		.pipe(sourcemaps.write('./maps'))
		// .pipe(uglify())
		.pipe(gulp.dest(path.join(FOLDER_DEV, 'js'))).on('error', gutil.log);
}

//************************************************************************************************


//*************************************    SECCIÓN  util    *************************************

function showComment(string) {
	if (runFirstTime) { return; }
	log('');
	log('------------------------------------------------');
	log(string);
	log('------------------------------------------------');
	return;
}

function onError(err) {
	return log(err);
}

function returnDestFolder() {
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

gulp.task('default', gulp.series(clean, 'sass', function nico() {
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

