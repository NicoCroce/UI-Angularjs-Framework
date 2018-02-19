'use strict';

var  serverPort 	= 1111;

var vendorLibraries = require('./config/vendor-libraries'),
	gulp 			= require("gulp"),//http://gulpjs.com/
	gutil 			= require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass 			= require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer 	= require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	cleanCSS 		= require('gulp-clean-css'),//https://www.npmjs.com/package/gulp-clean-css
	rename 			= require('gulp-rename'),//https://www.npmjs.org/package/gulp-rename
	sourcemaps 		= require('gulp-sourcemaps'), //Genera un mapa de referencias para los archivos. 
	path 			= require('path'), //Es de Node. Concatena.
	merge 			= require('merge-stream'),
	concat 			= require('gulp-concat'),
	del 			= require('del'),
	gpUglify 		= require('gulp-uglify'),
	imagemin 		= require('gulp-imagemin'),
	gulpif 			= require('gulp-if'),
	browserSync 	= require('browser-sync').create(),
	ngAnnotate 		= require('gulp-ng-annotate'),
	htmlmin 		= require('gulp-htmlmin'),
	log 			= gutil.log;


// Folders for assets, development environment and production environment
var FOLDER_ASSETS 		= 'assets',
	FOLDER_DEV 			= 'dev',
	FOLDER_BUILD		= 'build',
	FOLDER_DIST			= 'dist',
	NODE_MODULES		= 'node_modules';

var SRC_SASS_BASE 		= path.join(FOLDER_ASSETS, 'styles'),
	SRC_IMAGES_BASE 	= path.join(FOLDER_ASSETS, 'images'),
	SRC_FONTS_BASE 		= path.join(FOLDER_ASSETS, 'icons'),
	SRC_JAVASCRIPT_BASE = path.join(FOLDER_ASSETS, 'js'),
	SRC_DATA_BASE 		= path.join(FOLDER_ASSETS, 'data'),
	SRC_APP_BASE 		= path.join(FOLDER_ASSETS, 'app');

var SASS_FILES 			= SRC_SASS_BASE + '/**/*.scss',
	APP_FILES 			= SRC_APP_BASE + '/**/*',
	APP_HTML_FILES 		= SRC_APP_BASE + '/**/*.html',
	APP_JS_FILES 		= SRC_APP_BASE + '/**/*.js',
	JS_EXTERNAL_FILES	= SRC_JAVASCRIPT_BASE + '/*.js',
	IMAGES_FILES 		= SRC_IMAGES_BASE + '/**/*',
	ICON_FILES 			= SRC_FONTS_BASE + '/**/*',
	DATA_FILES 			= SRC_DATA_BASE + '/**/*.json',
	FILES_DATA 			= path.join(FOLDER_ASSETS, 'data') + '/**/*';

var DEV_HTML_JS_FILES 	= [FOLDER_DEV + 'index.html', FOLDER_DEV + '/templates/**/*.html', FOLDER_DEV + '/js/*.js'],
	JS_WATCH 			= FOLDER_DEV + '/js/**/*.js';


var JS_FILES_EXTERNAL_ORDER = vendorLibraries.getFilesJs(NODE_MODULES);

var JS_FILES_APP_ORDER = vendorLibraries.getAppFiles(SRC_APP_BASE, JS_EXTERNAL_FILES);

var ENVIRONMENT 		= FOLDER_DEV,
	runFirstTime 		= true;

var uglifyOptions = vendorLibraries.getUglifySettings;

//*************************************    SECCIÓN  Tasks    *************************************

// require('gulp-stats')(gulp);

gulp.task('help', gulp.series(showHelp));

gulp.task("clean", gulp.series(clean));

gulp.task("sass", gulp.series(sassFunction));

gulp.task("copyTemplates", gulp.series(cleanTemplates, copyTemplatesFunction));

gulp.task("copyImg", gulp.series(cleanImg, copyImgFunction));

gulp.task("copyIcons", gulp.series(cleanIcons, copyIconsFunction));

gulp.task('jsConcat', gulp.series(cleanJs, jsConcatFunction));

gulp.task('jsConcatLibs', gulp.series(cleanJsLibs, jsConcatLibsFunction));

gulp.task('copyData', gulp.series(cleanData, copyData));

gulp.task("watch", function (done) {
	gulp.watch(SASS_FILES, gulp.series('sass'));
	gulp.watch(APP_HTML_FILES, gulp.series('copyTemplates'));
	gulp.watch([APP_JS_FILES, JS_EXTERNAL_FILES], gulp.series("jsConcat"));
	gulp.watch(ICON_FILES, gulp.series('copyIcons'));
	gulp.watch(IMAGES_FILES, gulp.series("copyImg"));
	gulp.watch(DATA_FILES, gulp.series('copyData'));
	gulp.watch([JS_WATCH, DEV_HTML_JS_FILES], gulp.series(reload));
	return done();
});

gulp.task('connect', gulp.series(gulp.parallel(copyTemplatesFunction, sassFunction, "jsConcatLibs", 'copyData', "jsConcat", copyImgFunction, copyIconsFunction), connectServer));

gulp.task('deployTasks', gulp.series(gulp.parallel(copyTemplatesFunction, sassFunction, "jsConcatLibs", 'copyData', "jsConcat", compressImg, copyIconsFunction)));

gulp.task('deployTasksRun', gulp.series(gulp.parallel(copyTemplatesFunction, sassFunction, "jsConcatLibs", 'copyData', "jsConcat", compressImg, copyIconsFunction), connectServer));

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
	return del([FOLDER_DEV + '/js/*', '!' + FOLDER_DEV + '/js/min']);
};

function cleanJsLibs(done) {
	return del([ENVIRONMENT + '/js/libs.js']);
};

function cleanData(){
	return del([FOLDER_DEV + '/data']);
}

function reload(done) {
	browserSync.reload();
	return done();
}

function connectServer(done) {
	browserSync.init({
		port: serverPort,
		server: {
			baseDir: ENVIRONMENT
		},
		ui: {
			port: 2222,
		}
	});

	return done();
/*


	return done();*/
};

function copyData(done) {
	var destFolder = ENVIRONMENT + '/data';
	showComment('Copying DATA Files');
	gulp.src(DATA_FILES)
		.pipe(gulp.dest(destFolder)).on('error', gutil.log);
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
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'css')))
		.pipe(browserSync.stream()).on('error', gutil.log);
};

function copyTemplatesFunction(done) {
	showComment('Copying HTML Files');
	var copyIndex = gulp.src(SRC_APP_BASE + '/index.html') //Copy only index.html file.
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(ENVIRONMENT)).on('error', gutil.log);

	var copyFiles = gulp.src([APP_HTML_FILES, '!' + SRC_APP_BASE + '/index.html']) //Copy all files except index.html
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest(ENVIRONMENT + '/templates/')).on('error', gutil.log);
	return merge(copyIndex, copyFiles);
	
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

function jsConcatFunction(done) {
	gulp.src(JS_FILES_APP_ORDER)
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.init()))
		.pipe(concat('script.js')) // concat pulls all our files together before minifying them
		.pipe(ngAnnotate())
		.pipe(gulpif(ENVIRONMENT == FOLDER_DEV, sourcemaps.write('./maps')))
		.pipe(gulpif(ENVIRONMENT == FOLDER_BUILD, gpUglify(uglifyOptions)))
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'js'))).on('error', gutil.log);
	done();
}

function jsConcatLibsFunction(done) {
	gulp.src(JS_FILES_EXTERNAL_ORDER)
		.pipe(concat('libs.js')) // concat pulls all our files together before minifying them
		.pipe(gulp.dest(path.join(ENVIRONMENT, 'js/min/'))).on('error', gutil.log);
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
	log("If you modify an HTML, CSS, Js, different font or image files a task that will process the information will be run.");
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

gulp.task('deploy-run', gulp.series(setEnvironmentProd, clean, 'deployTasksRun', function runDeploy() {
	runFirstTime = false;
	finishMsg('IS DEPLOYED in "' + FOLDER_BUILD + '" folder');
}));

//************************************************************************************

