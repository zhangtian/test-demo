const gulp = require('gulp');
const less = require('gulp-less');
const mincss = require('gulp-minify-css');
const uglify = require('uglify-js');
const minifier = require('gulp-uglify/minifier');
const pump = require('pump');
const connect = require('gulp-connect');
const gulp_replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const fs = require('fs');
const arrImgType = ['jpg', 'png', 'gif', 'bng'];

/*static.huli.com/wap/ M站配置 end*/
const wap_html_src = './static/*.html';
const wap_less_src = './static/less/**/*.less';

gulp.task('compress:wap', function (cb) {
  const arrSrc = [
    '**/*.js',
    '!**/*.min.js'
  ];
  pump([
        gulp.src(arrSrc, {cwd: 'static/js'}),
        minifier({
          compress: {
            screw_ie8: false
          },
          mangle: {
            screw_ie8: false
          }
        }, uglify),
        gulp.dest('static/js')
    ],
    cb
  );
});
gulp.task('less:wap', function(){
  gulp.src([wap_less_src, '!./static/less/**/_*.less'])
    .pipe(less())
    .pipe(gulp.dest('./static/css/'))
    .pipe(connect.reload())
});

gulp.task('less:wap:build', function(){
  gulp.src([wap_less_src, '!./static/less/**/_*.less'])
    .pipe(less())
    .pipe(mincss())
    .pipe(gulp_replace('../images', 'https://events.huli.com/static/threeparty'))
    .pipe(gulp.dest('./dist/css/'))
});
gulp.task('minimage:wap', () =>
  gulp.src('**/*', { cwd: 'static/images' })
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);
gulp.task('html:wap', function(){
  gulp.src(wap_html_src)
    .pipe(connect.reload())
});
gulp.task('copyimg:wap', function(){
  gulp.src('./static/images/**/*')
    .pipe(gulp.dest('./dist/images'))
});
gulp.task('watch:wap', function(){
  gulp.watch([wap_less_src, wap_html_src], 
         ['less:wap', 'html:wap']);
});

gulp.task('connect', function(){
  connect.server({
    port: '8888',
    livereload: true
  });
});

gulp.task('wap', ['less:wap', 'connect', 'watch:wap']);
gulp.task('wap:build', ['copyimg:wap', 'less:wap:build']);