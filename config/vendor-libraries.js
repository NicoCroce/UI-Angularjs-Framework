'use strict';

var path = require('path');

exports.getProjects = function() {
    return ['assets/a', 'assets/b'];
}

exports.getFiles = function (BOWER_COMPONENTS) {
    return [
        path.join(BOWER_COMPONENTS + '/jquery/dist/jquery.min.js'),
        path.join(BOWER_COMPONENTS + '/angular/angular.min.js'),
        path.join(BOWER_COMPONENTS + '/angular-resource/angular-resource.min.js'),
        path.join(BOWER_COMPONENTS + '/angular-ui-router/release/angular-ui-router.min.js')
    ];
};


exports.getAppFiles = function (SRC_APP_BASE, JS_EXTERNAL_FILES) {
    return [
        path.join(SRC_APP_BASE + '/app.config.js'),
        path.join(SRC_APP_BASE + '/app.modules.js'),
        path.join(SRC_APP_BASE + '/**/*.js'),
        path.join(JS_EXTERNAL_FILES)
    ];
};


exports.getUglifySettings = {
    compress: {
        sequences: true,  // join consecutive statemets with the “comma operator”
        properties: true,  // optimize property access: a["foo"] → a.foo
        dead_code: true,  // discard unreachable code
        drop_debugger: true,  // discard “debugger” statements
        unsafe: false, // some unsafe optimizations (see below)
        conditionals: true,  // optimize if-s and conditional expressions
        comparisons: true,  // optimize comparisons
        evaluate: true,  // evaluate constant expressions
        booleans: true,  // optimize boolean expressions
        loops: true,  // optimize loops
        unused: true,  // drop unused variables/functions
        hoist_funs: true,  // hoist function declarations
        hoist_vars: false, // hoist variable declarations
        if_return: true,  // optimize if-s followed by return/continue
        join_vars: true,  // join var declarations
        cascade: true,  // try to cascade `right` into `left` in sequences
        side_effects: true,  // drop side-effect-free statements
        warnings: true,  // warn about potentially dangerous optimizations/code
        global_defs: {}     // global definitions
    }
}