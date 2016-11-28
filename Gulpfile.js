'use strict';

var  serverPort 	= 2173;

var gulp 			= require("gulp"),//http://gulpjs.com/
	gutil 			= require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass 			= require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer 	= require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	cleanCSS 		= require('gulp-clean-css'),//https://www.npmjs.com/package/gulp-clean-css
	rename 			= require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps 		= require('gulp-sourcemaps'), //Genera un mapa de referencias para los archivos. 
	path 			= require('path'), //Es de Node. Concatena.
	merge 			= require('merge-stream'),
	connect 		= require('gulp-connect'),
	concat 			= require('gulp-concat'),
	del 			= require('del'),
	gpUglify 		= require('gulp-uglify'),
	imagemin 		= require('gulp-imagemin'),
	gulpif 			= require('gulp-if'),

	// imagemin = require('gulp-imagemin'),
	log 			= gutil.log;


// Folders for assets, development environment and production environment
var FOLDER_ASSETS 	= 'assets',
FOLDER_DEV 			= 'dev',
FOLDER_BUILD		= 'build',
FOLDER_DIST			= 'dist',
BOWER_COMPONENTS	= 'bower_components';

var SRC_SASS_BASE 	= path.join(FOLDER_ASSETS, 'styles'),
SRC_IMAGES_BASE 	= path.join(FOLDER_ASSETS, 'images'),
SRC_FONTS_BASE 		= path.join(FOLDER_ASSETS, 'icons'),
SRC_JAVASCRIPT_BASE = path.join(FOLDER_ASSETS, 'js'),
SRC_HTML_BASE 		= path.join(FOLDER_ASSETS, 'templates');

var SASS_FILES 		= SRC_SASS_BASE + '/**/*.scss',
HTML_FILES 			= SRC_HTML_BASE + '/**/*.html',
JS_FILES 			= SRC_JAVASCRIPT_BASE + '/*.js',
JS_FILES_BUNDLES 	= path.join(SRC_JAVASCRIPT_BASE, 'bundles') + '/**/*',
IMAGES_FILES 		= SRC_IMAGES_BASE + '/**/*',
ICON_FILES 			= SRC_FONTS_BASE + '/**/*';

// Use this line if you need specified files order to concatenate
var JS_FILES_ORDER		= [SRC_JAVASCRIPT_BASE + '/script.js', SRC_JAVASCRIPT_BASE + '/scroll.js'];

var ENVIRONMENT 	= FOLDER_DEV,
runFirstTime 		= true;

var uglifyOptions = {
	compress: {
		sequences     : true,  // join consecutive statemets with the “comma operator”
		properties    : true,  // optimize property access: a["foo"] → a.foo
		dead_code     : true,  // discard unreachable code
		drop_debugger : true,  // discard “debugger” statements
		unsafe        : false, // some unsafe optimizations (see below)
		conditionals  : true,  // optimize if-s and conditional expressions
		comparisons   : true,  // optimize comparisons
		evaluate      : true,  // evaluate constant expressions
		booleans      : true,  // optimize boolean expressions
		loops         : true,  // optimize loops
		unused        : true,  // drop unused variables/functions
		hoist_funs    : true,  // hoist function declarations
		hoist_vars    : false, // hoist variable declarations
		if_return     : true,  // optimize if-s followed by return/continue
		join_vars     : true,  // join var declarations
		cascade       : true,  // try to cascade `right` into `left` in sequences
		side_effects  : true,  // drop side-effect-free statements
		warnings      : true,  // warn about potentially dangerous optimizations/code
		global_defs   : {}     // global definitions
	}
};

//*************************************    SECCIÓN  Tasks    *************************************

// require('gulp-stats')(gulp);

gulp.task('help', gulp.series(showHelp));

gulp.task("clean", gulp.series(clean));

gulp.task("sass", gulp.series(sassFunction));

gulp.task("copyTemplates", gulp.series(cleanTemplates, copyTemplatesFunction));

gulp.task("copyImg", gulp.series(cleanImg, copyImgFunction));

gulp.task("copyIcons", gulp.series(cleanIcons, copyIconsFunction));

gulp.task("copyJs", gulp.series(cleanJs, copyJsFunction));

gulp.task('jsConcat', gulp.series('copyJs', jsConcatFunction));

gulp.task('copyBower', gulp.series(copyBower));

gulp.task("watch", function (done) {
	gulp.watch(SASS_FILES, gulp.series('sass'));
	gulp.watch(HTML_FILES, gulp.series('copyTemplates'));
	gulp.watch(JS_FILES, gulp.series("jsConcat", "copyJs"));
	gulp.watch(ICON_FILES, gulp.series('copyIcons'));
	gulp.watch(IMAGES_FILES, gulp.series("copyImg"));
	return done();
});

gulp.task('connect', gulp.series(copyBower, gulp.parallel(copyTemplatesFunction, sassFunction, "jsConcat", copyImgFunction, copyIconsFunction), connectServer));

gulp.task('deployTasks', gulp.series(copyBower, gulp.parallel(copyTemplatesFunction, sassFunction, "jsConcat", compressImg, copyIconsFunction)));


//*************************************    SECCIÓN  Functions    *************************************

function clean() {
	return del([ENVIRONMENT]);
};

function setEnvironmentEnv (done) {
	ENVIRONMENT = FOLDER_DEV;
	done();
}

function setEnvironmentProd (done) {
	ENVIRONMENT = FOLDER_BUILD;
	done();
}

function cleanTemplates(done) {
	del([FOLDER_DEV + '/partials']);
	del([FOLDER_DEV + '/index.html']);
	return done();
};

function cleanImg() {
	return del([FOLDER_DEV + '/img']);
};

function cleanIcons(done) {
	del([FOLDER_DEV + '/css/styleIcons.css']);
	del([FOLDER_DEV + '/fonts/*']);
	return done();
};

function cleanJs(done) {
	return del([FOLDER_DEV + '/js/bundles']);
};

function connectServer(done) {
	connect.server({
		root: ENVIRONMENT,
		port: serverPort
	});
	return done();
};

function sassFunction() {
	showComment('Changed SASS File');
	return gulp.src(SRC_SASS_BASE + '/style.scss')
		.pipe(sourcemaps.init())
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sass()))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, sass({outputStyle: 'compressed'})))
		.pipe(autoprefixer())
		.pipe(rename('style.css'))
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, cleanCSS()))
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'css'))).on('error', gutil.log);
};

function copyBower() {
	var jeet = gulp.src(BOWER_COMPONENTS + '/jeet/scss/jeet/**/*')
		.pipe(gulp.dest(SRC_SASS_BASE + '/libs/jeet'));
	var jqueryFiles = gulp.src(BOWER_COMPONENTS + '/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(SRC_JAVASCRIPT_BASE + '/bundles/min/'));
	var normalize = gulp.src(BOWER_COMPONENTS + '/normalize-scss/sass/**/*')
		.pipe(gulp.dest(SRC_SASS_BASE + '/libs/normalize/'));

	return merge(jeet, jqueryFiles, normalize);
};

function copyTemplatesFunction() {
	showComment('Copying HTML Files');
	return gulp.src(HTML_FILES)
		.pipe(gulp.dest(ENVIRONMENT)).on('error', gutil.log);
};

function copyImgFunction() {
	showComment('Copying Images Files');
	return gulp.src(IMAGES_FILES)
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'img'))).on('error', gutil.log);
};

function compressImg () {
	return gulp.src(SRC_IMAGES_BASE+'/*')
        .pipe(imagemin())
        .pipe(gulp.dest(ENVIRONMENT + '/img'));
};

function copyIconsFunction(done) {
	var copyCss = gulp.src(SRC_FONTS_BASE + '/**/*.css')
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'css'))).on('error', gutil.log);

	var copyFonts = gulp.src(SRC_FONTS_BASE + '/fonts/**/*')
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'fonts'))).on('error', gutil.log);
	return merge(copyCss, copyFonts);
};

function copyJsFunction() {
	/*showComment('Copying JS Files');*/
	return gulp.src(JS_FILES_BUNDLES)
		.pipe(gulp.dest(ENVIRONMENT + '/js/bundles'));
}

function jsConcatFunction(done) {
	gulp.src(JS_FILES)
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.init()))
		.pipe(concat('script.js')) // concat pulls all our files together before minifying them
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV , sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gpUglify(uglifyOptions)))
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'js'))).on('error', gutil.log);
	done();
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

function showHelp(done) {
	runFirstTime = false;
	showComment("I can help you");
	log("");
	log("Run 'gulp' to compile the whole project and start working.");
	log("If you modify an HTML, CSS, Js, different font or image files a task that will process the information will run.");
	log("");
	log("----------------------------------------------------------");
	runFirstTime = true;
	done();
}

function finishMsg (msg) {
	setTimeout(function () {
		showComment(msg);
	}, 100);	
}

//*************************************    SECCIÓN  runner    *************************************

gulp.task('default', gulp.series(setEnvironmentEnv, clean, 'connect', 'watch', function runDev() {
	runFirstTime = false;
	finishMsg('YOU CAN START YOUR WORK in http://localhost:' + serverPort + ' GOOD CODE...');
}));

gulp.task('deploy', gulp.series(setEnvironmentProd, clean, 'deployTasks', function runDeploy(done) {
	runFirstTime = false;
	finishMsg('IS DEPLOYED in "' + FOLDER_BUILD + '" folder');	
	done();
}));

// gulp.task('deploy', ['copyTemplates'], function () {
// 	ENVIRONMENT = 'dep';
// 	runFirstTime = false;
// 	showComment('COMPLETE DEPLOY');
// });	

//************************************************************************************

