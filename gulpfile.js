// Run 'eslint gulpfile.js' after editing this file.
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const staticI18n = require('static-i18n');
const path = require('path');
const through = require('through2');
const argv = require('minimist')(process.argv);
const fs = require('fs');

const $ = gulpLoadPlugins();

// Set the language or fallback to the standard language (in this case 'en').
const language = argv.lang ? argv.lang : 'en';

// Check if the locales files are present.
gulp.task('check-files', () => {
  fs.access(`locales/${language}.yml`, (err) => {
    if (err.code === 'ENOENT') {
      $.util.log($.util.colors.red(`File locales/${language}.yml not found.`));
      process.exit();
    }
  });
});

// Create HTML pages based on locales.
function i18nReplace(options) {
  const transform = function (file, encoding, cb) {
    const rawHtml = file.contents.toString(encoding);
    const self = this;

    staticI18n.process(rawHtml, options, (err, results) => {
      if (err) {
        cb(err);
      } else {
        Object.keys(results).forEach((locale) => {
          const translatedFile = file.clone();
          translatedFile.path = path.join(file.base, file.relative);
          translatedFile.contents = new Buffer(results[locale]);

          self.push(translatedFile);
        });
        cb();
      }
    });
  };

  return through.obj(transform);
}

gulp.task('i18n', ['check-files'], () => {
  gulp.src(['dev/html/**/*.html'])
    .pipe($.plumber())
    .pipe(i18nReplace({
      fileFormat: 'yml',
      locale: language,
      locales: [language],
    }))
    .pipe(gulp.dest('./'));
});

// Wait for the 'i18n' task to finish before reloading the browser.
gulp.task('i18n-watch', ['i18n'], () => {
  browserSync.reload();
});

// Serve the page(s) and watch for changes.
gulp.task('serve', ['i18n'], () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  // Watch for changes in either the HTML files or the locales.
  gulp.watch(
    ['dev/html/**/*.html', 'locales/*.yml'],
    ['i18n-watch'],
  );
});

gulp.task('default', () => {
  gulp.start('serve');
});
