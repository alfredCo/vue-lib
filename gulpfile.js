'use strict'

let gulp = require('gulp'),
  rename = require('gulp-rename');
	//del = require('del');


//通用模块
gulp.task("move",function(){
  //favicon.ico
  gulp.src('./src/favicon.ico')
    .pipe(gulp.dest('./built'))

  //公用html
  gulp.src([
    './src/**/*.html'
    ])
    .pipe(gulp.dest('./built'))

    gulp.src('./src/frontend_static/**/*.*')
    .pipe(gulp.dest('./built/frontend_static'))

    gulp.src('./src/images/content/*.*')
    .pipe(gulp.dest('./built/images/content/'))
  
})

//default config.js
gulp.task("defConfMove",function(){
  gulp.src('./src/js/config.js')
    .pipe(gulp.dest('./built/js'))
})




gulp.task('default', ['move','defConfMove'])



