/**
 * Created by jrey on 20/01/2017.
 */
// Load plugins
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browsersync = require('browser-sync');
var rimraf = require('rimraf');
var yargs = require('yargs');
var yaml = require('js-yaml');
var fs = require('fs');
var compass = require('compass-importer')

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from config.yml
var config = loadConfig();

function loadConfig() {
    ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}

var sassOptionsDev = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: config.PATHS.sass,
    importer: compass
};

var sassOptionsProd = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: config.PATHS.sass,
    importer: compass
};


var autoprefixerOptions = {
    browsers: config.COMPATIBILITY
};

// Styles
function stylesRen() {
    return gulp.src(config.PATHS.src + '/css/xxx/all.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptionsDev).on('error', $.sass.logError))
        .pipe($.autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(config.PATHS.dist + '/css/xxx'))
        .pipe($.sass(sassOptionsProd).on('error', $.sass.logError))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cssnano())
        .pipe(gulp.dest(config.PATHS.dist + '/css/xxx'))
        .pipe($.notify({message: 'StylesRen task complete'}));
};

function stylesDac() {
    return gulp.src(config.PATHS.src + '/css/xxx/all.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptionsDev).on('error', $.sass.logError))
        .pipe($.autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(config.PATHS.dist + '/css/xxx'))
        .pipe($.sass(sassOptionsProd).on('error', $.sass.logError))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cssnano())
        .pipe(gulp.dest(config.PATHS.dist + '/css/xxx'))
        .pipe($.notify({message: 'StylesDac task complete'}));
};

// Scripts
function scriptsRen() {
    return gulp.src(config.PATHS.javascriptRen)
        .pipe($.sourcemaps.init())
        .pipe($.concat('all.js'))
        //.pipe($.sourcemaps.write('.', { sourceRoot: '../../assets/src/js/' }))
        .pipe(gulp.dest(config.PATHS.dist + '/js/xxx'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest(config.PATHS.dist + '/js/xxx'))
        .pipe($.notify({message: 'ScriptsRen task complete'}));
};

function scriptsDac() {
    return gulp.src(config.PATHS.javascriptRen)
        .pipe($.sourcemaps.init())
        .pipe($.concat('all.js'))
        //.pipe($.sourcemaps.write('.', { sourceRoot: '../../assets/src/js/' }))
        .pipe(gulp.dest(config.PATHS.dist + '/js/xxx'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest(config.PATHS.dist + '/js/xxx'))
        .pipe($.notify({message: 'ScriptsDac task complete'}));
};

// Copy fonts
/*function fonts() {
 return gulp.src(config.PATHS.fonts)
 .pipe(gulp.dest(config.PATHS.dist + '/fonts'));
 };*/

// Clean
function clean(done) {
    rimraf(config.PATHS.dist, done);
}

// The main build task
gulp.task('build', gulp.series(
    clean,
    gulp.parallel(stylesRen, stylesDac, scriptsRen, scriptsDac) //, scripts, fonts)
));

// Watch
function watch() {

    // Initialize Browsersync
    /*browsersync.init({
     proxy: config.PROXY,
     https: false
     });*/

    // Watch .scss files
    gulp.watch(config.PATHS.src + '/css/renault/**/*.scss', stylesRen);
    gulp.watch(config.PATHS.src + '/css/dacia/**/*.scss', stylesDac);
    // Watch .js files
    gulp.watch(config.PATHS.src + '/js/**/*.js', scriptsRen);
    gulp.watch(config.PATHS.src + '/js/**/*.js', scriptsDac);
    // Watch any view files in 'views', reload on change
    //gulp.watch(['views/**/*.php']).on('change', browsersync.reload);
    // Watch any files in 'assets/dist', reload on change
    //gulp.watch([config.PATHS.dist + '/js/renault/*']).on('change', browsersync.reload);
    //gulp.watch([config.PATHS.dist + '/js/dacia/*']).on('change', browsersync.reload);
    //gulp.watch([config.PATHS.dist + '/css/*']).on('change', browsersync.reload);
};

// Default task runs build and then watch
gulp.task('default', gulp.series('build', watch));

// Export these function to the Gulp client
gulp.task('clean', clean);
//gulp.task('fonts', fonts);
gulp.task('stylesRen', stylesRen);
gulp.task('stylesDac', stylesDac);
gulp.task('scriptsRen', scriptsRen);
gulp.task('scriptsDac', scriptsDac);
