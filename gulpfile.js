const { src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  del = require('del');

const paths = {
  input: 'src',
  output: 'dist',
  pug: {
    input: 'src/pug/*.pug',
    watch: 'src/pug/**/*.pug'
  },
  scss: {
    input: 'src/scss/main.scss',
    watch: 'src/scss/**/*.scss',
    outputName: 'style.min.css',
    output: 'dist/static/css/'
  },
  copy: {
    input: 'src/copy/**/*.*',
    output: 'dist/static/'
  }
};

function clean() {
  return del(paths.output)
}

function copy() {
	return src(paths.copy.input)
		.pipe(dest(paths.copy.output))
}

function html() {
	return src(paths.pug.input)
    .pipe(pug({pretty: true}))
    .pipe(dest(paths.output))
		.pipe(reload({ stream: true }))
}

function css() {
  return src(paths.scss.input)
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(rename(paths.scss.outputName))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(paths.scss.output))
		.pipe(reload({ stream: true }))	
}

function watching() {
	watch(paths.pug.watch, html)
	watch(paths.scss.watch, css);
}

function browser() {
	browserSync.init({
		server: {
			baseDir: paths.output
		},
		port: 3000,
		notify: false,
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false,
		},
	})
}

exports.build = series(
  clean,
  parallel(html, css, copy)
);
exports.default = series(
  clean,
  parallel(html, css, copy),
  parallel(browser, watching)  
);
