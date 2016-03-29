var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var babel = require("gulp-babel");

gulp.task('clean', function(){
    return del('dist')
});

// SERVER
gulp.task('build:server', function () {
  gulp.src('server/**/*.js')
		.pipe(sourcemaps.init())
    .pipe(babel())
		.pipe(gulp.dest('dist'))
});

gulp.task('build:sass', function () {
  gulp.src('client/app/stylesheets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/app/stylesheets/css'));
});

// CLIENT
var jsNPMDependencies = [
    'angular2/bundles/angular2-polyfills.js',
    'angular2/bundles/http.dev.js',
    'systemjs/dist/system.src.js',
    'rxjs/bundles/Rx.js',
    'angular2/bundles/angular2.dev.js',
    'angular2/bundles/router.dev.js',
    'socket.io-client/socket.io.js',
]

gulp.task('build:index', function(){
    var mappedPaths = jsNPMDependencies.map(file => {return path.resolve('node_modules', file)})

    // Copy our head dependencies into a dist/libs
    var copyJsNPMDependencies = gulp.src(mappedPaths, {base:'node_modules'})
      .pipe(gulp.dest('dist/libs'))

    var copyVendorJs = gulp.src('client/app/vendor/**/*')
      .pipe(gulp.dest('dist/libs'))

    // Copy our index into dist
    var copyIndex = gulp.src('client/index.*')
      .pipe(gulp.dest('dist'))

    // Copy css into dist
    var copyStylesheets = gulp.src('client/app/stylesheets/**/*.css')
      .pipe(gulp.dest('dist/app/stylesheets'));

    // Copy images into dist
    var copyImages = gulp.src('client/app/images/*')
      .pipe(gulp.dest('dist/app/images'));

    return [copyJsNPMDependencies, copyVendorJs, copyStylesheets, copyIndex, copyImages];
});

gulp.task('build:app', function(){
    var tsProject = ts.createProject('client/tsconfig.json');
    var tsResult = gulp.src('client/**/*.ts')
      .pipe(ts(tsProject))
	  return tsResult.js
      .pipe(sourcemaps.write())
		  .pipe(gulp.dest('dist'))
});

gulp.task('start', function (cb) {
  exec('nodemon dist/server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:sass', 'build:index', 'build:app', callback);
});

gulp.task('watch', function() {
  gulp.watch('server/**/*.js', ['build:server']);
  gulp.watch('client/**/*.ts', ['build:app']);
  gulp.watch('client/index.jade', ['build:index']);
  gulp.watch('client/app/stylesheets/**/*', ['build:index', 'build:sass']);
});

gulp.task('default', ['build', 'watch']);
