var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cleanCss = require("gulp-clean-css");
var sourcemaps = require("gulp-sourcemaps");
// var babelify = require("babelify");
var browserify = require("browserify");
var watchify = require("watchify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

var browserSync = require("browser-sync");
var exec = require("child_process").exec;

// Configuration
var static_assets_folder = "assets";
var bundles = {
    core: {
        css: {
            src: [
                "src/css/bootstrap-theme.min.css",
                "node_modules/font-awesome/css/font-awesome.min.css",
                "node_modules/leaflet/dist/leaflet.css",
                "node_modules/leaflet.markercluster/dist/MarkerCluster.css",
                "node_modules/leaflet-basemaps/L.Control.Basemaps.css",
                "node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.css",
                "src/css/MarkerCluster.Default.css",
                "src/css/app.css"
            ],
            dist: {
                path: static_assets_folder + "/css/",
                file: "bundle.core.css"
            }
        },
        js: {
            src: ["src/js/app.js"],
            dist: {
                path: static_assets_folder + "/js/",
                file: "bundle.core.js"
            }
        }
    }
};

var bundlingConfigs = Object.keys(bundles);

/**
 * BUNDLE JS
 */
bundlingConfigs.forEach(function(bundleName) {
    gulp.task("scripts:" + bundleName, function() {
        return (
            browserify({
                basedir: ".",
                insertGlobalVars: {
                    $: function(file, dir) {
                        return 'require("jquery")';
                    },
                    jQuery: function(file, dir) {
                        return 'require("jquery")';
                    }
                },
                debug: true,
                entries: bundles[bundleName].js.src
                    // cache: {},
                    // packageCache: {}
            })
            // .transform('babelify', {
            //     presets: ['es2015'],
            //     extensions: ['.js']
            // })
            .bundle()
            .pipe(source(bundles[bundleName].js.dist.file))
            .pipe(buffer())
            // .pipe(sourcemaps.init({ loadMaps: true }))
            // .pipe(uglify())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(bundles[bundleName].js.dist.path))
            .pipe(
                browserSync.reload({
                    stream: true
                })
            )
        );
    });
});

gulp.task(
    "pack-js",
    gulp.parallel(
        bundlingConfigs.map(function(name) {
            return "scripts:" + name;
        })
    )
);

/**
 * BUNDLE CSS
 */
bundlingConfigs.forEach(function(bundleName) {
    gulp.task("styles:" + bundleName, function() {
        return gulp
            .src(bundles[bundleName].css.src)
            .pipe(concat(bundles[bundleName].css.dist.file))
            .pipe(cleanCss())
            .pipe(gulp.dest(bundles[bundleName].css.dist.path))
            .pipe(
                browserSync.reload({
                    stream: true
                })
            );
    });
});

gulp.task(
    "pack-css",
    gulp.parallel(
        bundlingConfigs.map(function(name) {
            return "styles:" + name;
        })
    )
);

/**
 * COPY ASSETS
 * (for dependencies that will look for assets to be in a certain place)
 */

// Configuration
var assets = {
    leaflet: {
        src: "node_modules/leaflet/dist/images/**/*",
        dist: static_assets_folder + "/css/images"
    },
    fontawesome: {
        src: "node_modules/font-awesome/fonts/**/*",
        dist: static_assets_folder + "/fonts"
    }
};

var assetConfigs = Object.keys(assets);

assetConfigs.forEach(function(assetName) {
    gulp.task("assets:" + assetName, function() {
        return gulp
            .src(assets[assetName].src)
            .pipe(gulp.dest(assets[assetName].dist))
            .pipe(
                browserSync.reload({
                    stream: true
                })
            );
    });
});

gulp.task(
    "copy-assets",
    gulp.parallel(
        assetConfigs.map(function(name) {
            return "assets:" + name;
        })
    )
);

/**
 * COMBINED TASKS
 */

// basic build task.
gulp.task("build", gulp.parallel("pack-js", "pack-css", "copy-assets"));

// Run a development server
gulp.task("runserver", function() {
    var proc = exec("jekyll serve");
});
// sync the browser
gulp.task("browser-sync", function() {
    browserSync({
        notify: true,
        proxy: "localhost:4000"
    });
});

gulp.task("serve-and-sync", gulp.parallel("runserver", "browser-sync"));

// gulp watch task
gulp.task(
    "watch",
    // start browserSync, and run the rest of our tasks once
    gulp.parallel(
        "serve-and-sync",
        "pack-css",
        "pack-js",
        "copy-assets",
        // re-run these tasks if source directories change
        function() {
            gulp.watch("src/css/*.css", gulp.parallel("pack-css"));
            gulp.watch("src/js/*.js", gulp.parallel("pack-js"));
        }
    )
);

// default (parameter-less) gulp task, runs watch and browser-sync
gulp.task("default", gulp.parallel("build"));