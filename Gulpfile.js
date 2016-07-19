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