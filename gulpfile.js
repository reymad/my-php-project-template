/**
 * Created by jrey on 20/01/2017.
 */

// !! install GULP dependencies
    // npm install jshint gulp-jshint --save-dev
    // npm install gulp gulp-jshint gulp-ruby-sass gulp-minify-css gulp-concat gulp-uglify gulp-rename gulp-notify gulp-autoprefixer gulp-imagemin gulp-cache --save
    // npm install --save-dev gulp
    // npm install --save-dev gulp-sass

'use strict';

// Include Gulp
var gulp = require( 'gulp' );

// Include Plugins
var sass = require( 'gulp-sass' ),
    autoprefixer = require( 'gulp-autoprefixer' ),
    minifycss = require( 'gulp-minify-css' ),
    imagemin = require( 'gulp-imagemin' ),
    jshint = require( 'gulp-jshint' ),
    concat = require( 'gulp-concat' ),
    uglify = require( 'gulp-uglify' ),
    rename = require( 'gulp-rename' ),
    notify = require( 'gulp-notify' ),
    cache = require( 'gulp-cache' );

// Tasks

// Watch files for changes

//gulp.task( 'watch', function() {
//
//    // Watch .scss files
//    gulp.watch( 'src/styles/**/*.scss', ['styles'] );
//
//    // Watch .js files
//    gulp.watch( 'src/scripts/**/*.js', ['scripts'] );
//
//    // Watch image files
//    gulp.watch( 'src/images/**/*', ['images'] );
//});
// Default Task
// gulp.task( 'default', ['styles', 'scripts', 'images', 'watch'] );

// funciona
gulp.task('sass', function() {
    gulp.src('theme/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('theme/pub/css/'))
        .pipe( notify( { message: 'Sass is being watched...' } ) );
});
// Styles // funciona concat y min
gulp.task( 'styles', function() {
    return gulp.src('theme/pub/css/**/*.css')
        .pipe(minifycss())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('./dist/css'))
        // .pipe( notify( { message: 'Styles task complete' } ) );
});

// Scripts // funciona concat y min
gulp.task( 'scripts', function() {
    return gulp.src( 'theme/pub/js/**/*.js'  )
        .pipe( jshint( '.jshintrc' ) )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( concat( 'scripts.js' ) )
        .pipe( gulp.dest( './dist/js' ) )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( uglify() )
        .pipe( gulp.dest( './dist/js' ) )
        // .pipe( notify( { message: 'Scripts task complete' } ) );
} );

// Images funciona
gulp.task( 'images', function() {
    return gulp.src( 'theme/images/**/*'  )
        .pipe( cache( imagemin( { optimizationLevel: 3, progressive: true, interlaced: true } ) ) )
        .pipe( gulp.dest( './dist/images' ) )
        // .pipe( notify( { message: 'Images task complete' } ) );
} );


//Watch task
gulp.task('default', [/*'sass',*/'styles','scripts','images'], function() {
    // sass watcher
    gulp.watch('theme/scss/**/*.scss',['sass']);
    // min css
    gulp.watch('theme/pub/css/**/*.css',['styles']);
    // min js
    gulp.watch('theme/pub/js/**/*.js',['scripts']);
    // min js
    // gulp.watch('theme/pub/js/**/*.js',['images']);// no pongo watcher para imagenes

});
