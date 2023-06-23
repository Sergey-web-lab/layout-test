"use strict";

const { src, dest } = require("gulp")
const gulp = require("gulp")
const browserSync = require("browser-sync").create()
const gulpNotify = require("gulp-notify")
const gulpCssnano = require("gulp-cssnano")
const del = require("del")
const gulpAutoprefixer = require("gulp-autoprefixer")
const gulpCssbeautify = require("gulp-cssbeautify")
const gulpImagemin = require("gulp-imagemin")
const gulpPlumber = require("gulp-plumber")
const gulpRename = require("gulp-rename")
const gulpRigger = require("gulp-rigger")
const gulpStripСssСomments = require("gulp-strip-css-comments")
const gulpUglify = require("gulp-uglify")
const sass = require("gulp-sass")(require("sass"))

// Paths
const srcPath = "src/"
const distPath = "dest/"

const path = {
  build: {
    html: distPath,
    css: `${distPath}assets/css/`,
    js: `${distPath}assets/js/`,
    images: `${distPath}assets/images/`,
    fonts: `${distPath}assets/fonts/`
  },
  src: {
    html: `${srcPath}*.html`,
    css: `${srcPath}assets/scss/*.scss`,
    js: `${srcPath}assets/js/*.js`,
    images: `${srcPath}assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}`,
    fonts: `${srcPath}assets/fonts/**/*.{eot,woff,woff2,ttf,svg}`
  },
  watch: {
    html: `${srcPath}**/*.html`,
    css: `${srcPath}assets/scss/**/*.scss`,
    js: `${srcPath}assets/js/**/*.js`,
    images: `${srcPath}assets/images/**/*.{jpg, png, svg, gif, ico, webp, webmanifest, xml, json}`,
    fonts: `${srcPath}assets/fonts/**/*.{eot, woff, woff2, ttf, svg}`
  },
  clean: `./${distPath}`
}

function server() {
  browserSync.init({
    server: {
      baseDir: `./${distPath}`
    }
  });
}

function html() {
  return src(path.src.html, { base: srcPath })
    .pipe(gulpPlumber())
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  return src(path.src.css, { base: `${srcPath}assets/scss/` })
    .pipe(gulpPlumber({
      errorHandler: function (err) {
        gulpNotify.onError({
          title: "SCSS Error",
          message: "Error: <%= error.message%>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(gulpAutoprefixer())
    .pipe(gulpCssbeautify())
    .pipe(dest(path.build.css))
    .pipe(gulpCssnano({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(gulpStripСssСomments())
    .pipe(gulpRename({
      suffix: ".min",
      extname: ".css"
    }))
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  return src(path.src.js, { base: `${srcPath}assets/js/` })
    .pipe(gulpPlumber({
      errorHandler: function (err) {
        gulpNotify.onError({
          title: "JS Error",
          message: "Error: <%= error.message%>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(gulpRigger())
    .pipe(dest(path.build.js))
    .pipe(gulpUglify())
    .pipe(gulpRename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp.src(path.src.images)
    .pipe(gulpImagemin())
    .pipe(gulp.dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return src(path.src.fonts, { base: `${srcPath}assets/fonts/` })
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del(path.clean)
}

function watchFiles() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.images], images)
  gulp.watch([path.watch.fonts], fonts)
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts))
const watch = gulp.parallel(build, watchFiles, server)

exports.html = html
exports.css = css
exports.js = js
exports.images = images
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch




