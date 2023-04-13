const {src, dest, watch, parallel, series} = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify-es').default;
const imagemin      = require('gulp-imagemin');
const browserSync   = require('browser-sync').create();
const autoprefixer  = require('gulp-autoprefixer');
const clean         = require('gulp-clean');



function scripts() {
  return src([
      /* 'node_modules/swiper/swiper-bundle.js', */
      /* подключение плагина слайдера */
      'node_modules/jquery/dist/jquery.js',
      'app/js/main.js'

      /* 'app/js/*.js',
      '!app/js/main.min.js', */
      /* уберает бесконечный цикл, если в папке js много файлов */
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(concat('style.min.css'))
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function images(){
 return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
  ]))
  .pipe(dest('dist/images'))
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/"
    },
    notify: false
  });
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
      'app/css/style.min.css',
      'app/js/main.min.js',
      'app/**/*.html'
    ], {
      base: 'app'
    })
    .pipe(dest('dist'))
}



exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.building = building;


exports.build = series(cleanDist, images, building);
exports.default = parallel(styles, scripts, browsersync, watching);