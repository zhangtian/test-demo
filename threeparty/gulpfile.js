const gulp = require('gulp');
const less = require('gulp-less');
const shell = require('gulp-shell');
const mincss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const minifier = require('gulp-uglify/minifier');
const pump = require('pump');
const connect = require('gulp-connect');
const gulp_replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const tobase64 = require("gulp-tobase64");
const fontSpider = require( 'gulp-font-spider' );
const server = require('gulp-devserver');
const arrImgType = ['jpg', 'png', 'gif', 'bng'];
const base64_opts = {
  maxImageSize: 1024 * 16
};
const tobase64_opts = {
  maxsize: base64_opts.maxImageSize/1024
};

/*static.huli.com/wap/ M站配置 end*/
const wap_html_src = './static/*.html';
const wap_less_src = './static/less/**/*.less';

gulp.task('compress:wap', function (cb) {
    pump([
        gulp.src('static/js/*.js'),
        uglify(),
        gulp.dest('dist/js/')
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
    .pipe(base64(base64_opts))
    .pipe(mincss())
    // .pipe(gulp_replace('../images', 'https://events.huli.com/static/threeparty'))
    .pipe(gulp.dest('./dist/css/'))
});
gulp.task('minimage:wap', () =>
  gulp.src('**/*', { cwd: 'static/images' })
    // .pipe(imagemin([
    //   imagemin.jpegtran({progressive: true})
    // ]))
    .pipe(gulp.dest('dist/images'))
);
gulp.task('html:wap', function(){
  gulp.src(wap_html_src)
    // .pipe(fontSpider())
    .pipe(connect.reload())
});
gulp.task('copyimg:wap', function(){
  gulp.src('./static/images/**/*')
    .pipe(gulp.dest('./dist/images'))
});
gulp.task('watch:wap', function(){
  gulp.watch(wap_less_src, ['less:wap']);
  gulp.watch([wap_html_src], ['html:wap']);
});
gulp.task('html:base64', () => {
  gulp.src('./static/*.html')
    .pipe(tobase64(tobase64_opts))
    .pipe(gulp.dest('dist/'))
});
gulp.task('fonts:build', () => {
  gulp.src('./static/fonts/*')
    .pipe(gulp.dest('dist/fonts/'))

  gulp.src('./dist/*.html')
    .pipe(fontSpider())
});

gulp.task('connect', function(){
  connect.server({
    port: '8888',
    livereload: true
  });
});

gulp.task('devserver', () => {
  gulp.src('./dist')
    .pipe(server({
      livereload: {
        clientConsole: true
      },
      proxy: {
        enable: true,
        host: 'https://www.souyidai.com',
        urls: /^\//
      }
    }))
})

gulp.task('wap', ['less:wap', 'connect', 'watch:wap']);
gulp.task('build', ['minimage:wap', 'compress:wap', 'less:wap:build', 'html:base64', 'fonts:build']);