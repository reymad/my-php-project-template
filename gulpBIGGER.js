/**
 * Created by jrey on 30/01/2017.
 */
'use strict';

var gulp            = require('gulp'),
    connect         = require('gulp-connect'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    cleanhtml       = require('gulp-cleanhtml'),
    dev             = require('gulp-dev'),
    browserSync     = require('browser-sync'),
    plugins         = gulpLoadPlugins(),
    webpack         = require('webpack'),
    ComponentPlugin = require("component-webpack-plugin"),
    info            = require('./package.json'),
    webpackCompiler;

var config = {

    JS: {
        src: ["src/js/**/*.js"],
        build: "build/js/",
        buildFiles: "build/js/*.js"
    },

    IMAGES: {
        src: ["src/images/**/*.jpg", "src/images/**/*.svg", "!src/images/**/*.png"],
        build: "build/images/",
        png: {
            src: "src/images/**/*.png",
            build: "build/images/"
        }
    },

    HTML:{
        src: ['**/*.php']
        // build: "./app/"
    },

    // Icons
    ICONS: {
        src      : 'src/sass/components/icons/svg/*.svg',
        build    : 'build/css/fonts/',
        fontname : 'icons'
    },

    SASS: {
        src: "src/sass/**/*.scss",
        build: "build/css/"
    }

}

// SERVER ---------------------------------------------------------------------
gulp.task('browser-sync', function() {
    browserSync({
        // server: {
        //   baseDir: "./app/"
        // },
        proxy: "http://webipack.dev/",
        // port: 80,
        browser: "",
        online: true,
        open: false
    });
});


// WEBPACK --------------------------------------------------------------------
gulp.task('webpack', function(callback) {
    webpackCompiler.run(function(err, stats) {
        if (err) {
            throw new plugins.util.PluginError('webpack', err);
        }
        plugins.util.log('webpack', stats.toString({
            colors: true,
        }));
        callback();
    });
});

var webpackConfig = {
    cache: true,
    debug: true,
    progress: true,
    colors: true,
    devtool: 'source-map',
    entry: {
        app: './src/js/app.js',
        vendor: [
            // 'salvattore',
            // 'masonry',
            'slick.js',
            'shifter'
        ]
    },
    output: {
        path: config.JS.build ,
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/app/js/',
    },
    module:{
        loaders: [
            { test: /\.html$/, loader: "html" },
            { test: /\.css$/, loader: "css" }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        alias: {
            'underscore'  : 'lodash',
            'shifter'     : 'Shifter/jquery.fs.shifter.js',
            // 'owl'         : 'owl-carousel2/dist/owl.carousel.js',
            // 'pikabu'      : 'pikabu/build/pikabu.min.js',
            // 'intentionjs' : 'intentionjs/code/intention.min.js'
            // 'firebase'     : 'firebase/firebase.js'
        }
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        // "angular": "angular",
        "$": "jQuery",
        "jquery": "jQuery"
    }

};

gulp.task('set-env-dev', function() {
    webpackConfig.plugins = [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new webpack.BannerPlugin(info.name + '\n' + info.version + ':' + Date.now() + ' [development build]'),
        new ComponentPlugin(),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery"
        })
    ];
    webpackCompiler = webpack( webpackConfig );
});

gulp.task('set-env-prod', function() {
    webpackConfig.debug = false;
    webpackConfig.devtool = "";
    webpackConfig.plugins = [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        // new ngminPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: false
        }),
        new ComponentPlugin(),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery"
        })
    ];
    webpackCompiler = webpack( webpackConfig );
});




// SASS -----------------------------------------------------------------------

gulp.task('sass', function () {
    gulp.src( config.SASS.src )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.plumber() )
        .pipe( plugins.sass({
            outputStyle: 'normal',
            debugInfo: false
        }) )
        .pipe( plugins.sourcemaps.write('./', {includeContent: false, sourceRoot: '../../src/sass/'}) )
        .pipe( gulp.dest( config.SASS.build ) )
        .pipe( plugins.filter( '**/*.css') ) // Filtering stream to only css files
        .pipe( browserSync.reload({ stream: true }) );
});

gulp.task('sass-build', function () {
    gulp.src( config.SASS.src )
        .pipe( plugins.plumber() )
        .pipe( plugins.sass({
            outputStyle: 'normal',
            // sourceComments: 'map',
            // includePaths : [paths.styles.src]
            // source_map_embed: false
        }) )
        .pipe( plugins.autoprefixer (
            "last 1 versions", "> 10%", "ie 9"
        ))
        .pipe( gulp.dest( config.SASS.build ) )
        .pipe( plugins.filter( '**/*.css') ) // Filtering stream to only css files
        .pipe( browserSync.reload({ stream: true }) );
});

gulp.task('sass-prefixer', function () {
    gulp.src( config.SASS.build + "*.css" )
        .pipe( plugins.autoprefixer (
            "last 1 versions", "> 10%", "ie 9"
        ))
        .pipe( gulp.dest( config.SASS.build ) );
});




// JAVASCRIPT RELOADING -------------------------------------------------------
gulp.task('js', function () {
    return gulp.src( config.JS.buildFiles )
        .pipe( plugins.changed ( config.JS.buildFiles ))
        .pipe( plugins.filter('**/*.js'))
        .pipe( browserSync.reload({ stream: true }) );
    // .pipe( plugins.livereload() );
});


// IMAGE OPTIMIZATION ---------------------------------------------------------

gulp.task('buildPNG', function () {
    gulp.src( config.IMAGES.png.src )
        .pipe( plugins.changed ( config.IMAGES.png.build ))
        .pipe( plugins.tinypng ('API KEY HERE'))
        .pipe( gulp.dest( config.IMAGES.png.build ) )
        .pipe( browserSync.reload({ stream: true }) );
    // .pipe( plugins.livereload() );
});

gulp.task('buildIMG', function () {
    gulp.src( config.IMAGES.src )
        .pipe( plugins.changed ( config.IMAGES.build ))
        .pipe( plugins.imagemin ({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe( gulp.dest( config.IMAGES.build ) )
        .pipe( browserSync.reload({ stream: true }) );
    // .pipe( plugins.livereload() );
});


// HTML TEMPORARIO --------------------------------------------------------------
gulp.task('html', function () {
    return gulp.src( config.HTML.src )
        // .pipe( cleanhtml() )
        // .pipe( dev(true) )
        // .pipe( gulp.dest( config.HTML.build ) )
        .pipe( browserSync.reload({ stream: true }) );
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});


// ICONS ----------------------------------------------------------------------
// gulp.task('icons', function(){
//   gulp.src([ config.ICONS.src ])
//     .pipe( plugins.iconfontCss({
//       fontName: config.ICONS.fontname,
//       path: './src/sass/components/icons/_icons-template.scss',
//       targetPath: '../../../src/sass/components/icons/_icons.scss',
//       fontPath: './fonts/',
//     }))
//     .pipe( plugins.iconfont({
//       fontName: config.ICONS.fontname,
//       fixedWidth: true,
//       appendCodepoints: false
//     }))
//     .pipe(gulp.dest( config.ICONS.build ));
// });

gulp.task('icons', function(){
    gulp.src("src/sass/components/icons/symbol-font-14px.sketch")
        .pipe( plugins.sketch({
            export: 'slices',
            formats: 'svg'
        }))
        .pipe( plugins.iconfontCss({
            fontName: config.ICONS.fontname,
            path: './src/sass/components/icons/_icons-template.scss',
            targetPath: '../../../src/sass/components/icons/_icons.scss',
            fontPath: './fonts/',
        }))
        .pipe( plugins.iconfont({
            fontName: config.ICONS.fontname
        }))
        .pipe(gulp.dest( config.ICONS.build ));
});


// DEPLOY ---------------------------------------------------------------------
// Runs the deployment script
// Use it after pushing the local repo into the remote repository
gulp.task('deploy', function () {
    plugins.run('ssh wordpress@wp.webispot.com "cd wordpress/mw-public/themes ; git pull"').exec()
    // .pipe(gulp.dest('output'))    // Writes "Hello World\n" to output/echo.
})




// GLOBAL TASKS ---------------------------------------------------------------

gulp.task('watch', function () {
    // gulp.watch( config.HTML.src , [browserSync.reload] );
    gulp.watch( config.HTML.src , ['bs-reload'] );
    gulp.watch( config.JS.src , ["webpack"]);
    gulp.watch( config.JS.buildFiles , ["js"] );
    gulp.watch( config.IMAGES.png.src , ['buildPNG'] );
    gulp.watch( config.SASS.src , ['sass']  );
});

gulp.task('default', ['set-env-prod', 'browser-sync', 'watch']);
gulp.task('dev', ['set-env-dev', 'browser-sync', 'watch']);
gulp.task('build', ['set-env-prod', 'webpack', 'sass-build'] );
gulp.task('server', ['browser-sync'] );