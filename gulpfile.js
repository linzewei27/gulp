/**
 @author linzewei
 @desc 用于自动加版本号，必须有文件发生改变才能加版本号
 @time 2019/06/13
**/
let gulp = require("gulp");
let gulpLoadPlugins = require('gulp-load-plugins');
let $ = gulpLoadPlugins({lazyload: true, rename:{"gulp-ruby-sass" : "sass", "gulp-markdown-pdf": "mdpdf", "gulp-rev-collector":"revCollector", "gulp-asset-rev":"assetRev"}});



const prefix_css = (done) => {//该方法根据CSS生成一个替换文件的JSON清单
    gulp.src(["./WebRoot/**/*.css"])
		.pipe($.rev()) //添加hash后缀
        .pipe(gulp.dest("./dist/css/")) //移动到dist/css
        .pipe($.rev.manifest()) //生成文件映射
        .pipe(gulp.dest("rev/css")) //将映射文件导出到rev/css中
    done()
}

const prefix_js = (done) => {//该方法根据JS生成一个替换文件的JSON清单
    gulp.src(["./WebRoot/**/*.js"])
       .pipe($.rev())
        .pipe(gulp.dest('./dist/js/'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('rev/js'));
    done()
}

const prefix_html = (done) => {//根据JS和CSS清单替换html里面对应的css和JS文件
    gulp.src(["rev/**/*.json","./WebRoot/**/*.html","./**.html"])//第一个参数是清单存放的位置，第二个是实际中html文件的位置
        .pipe($.revCollector({
			replaceReved:true
		}))
        .pipe(gulp.dest('./WebRoot'))//将修改了版本号的文件存放的位置，如果跟原本的html存放的文件夹一样，则会替换原来的文件，相当于在原来的文件上面添加版本号。
    done()
}
exports.default = gulp.series(prefix_css,prefix_js, prefix_html) //按顺序执行方法prefix_css,prefix_js, prefix_html
