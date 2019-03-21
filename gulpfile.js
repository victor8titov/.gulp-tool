'use strict'
/* -------------------------------------------------------------------------
*           SETTING THEMS
---------------------------------------------------------------------------*/
var o = {
    /*
    *   SETTING NAME FOLDER AND PATH
    */
    nameDirectDevelop:  '',  //   Имя директории разработки                                      
    pathDirectDevelop:  '',      //   Путь до директории разработки
                                    //   относительно папки .gulp-tool

    nameDirectPublic:   'public',   //   Имя директории сборки проекта
    pathDirectPublic:   '',      //   Путь до директории сборки проекта, 
                                    //   относительно папки .gulp-tool
    
    //  директории относительно папки разработк и папки сборки проекта!!!
    jsDirect:        'js/',
    stylesDirect:    'styles/',
    imgDirect:       'img/',
    fontsDirect:     'fonts/',
    modelDirect:     '.model/',
    tmpDirect:       '.tmp/',

    /*
    *   SETTING BROWSER SYNC
    */
    typeServer:         'single',   //  single || proxy                                    
    url:                '',         //  Url сервера. Нужен для создания proxy сервера
};
/*
*   SETTING STYLES
*/
o.typeCompilerStyles = 'less',

//          LESS
//  Файлы стилей для компиляции в CSS
//  для указания нового имени файла css, заполнить свойство nameCSS
//  свойсво file and nameCSS могут быть строкой
//  example: file: 'general.less'     
o.less =    {
                nameLess: 'main.less',
                pathLess: o.stylesDirect + '/',
                nameCSS: 'main.css',
                pathCss:  o.stylesDirect + '/',
            };  

//  Установка базовых директорий проекта
o.src = {    
    //  Полный путь и имя директории разработки
    dev: o.pathDirectDevelop + o.nameDirectDevelop + '/',  
    // Полный путь и имя директории сборки готового проекта
    build: o.pathDirectPublic + o.nameDirectPublic +'/',
}
o.prefix = '.'; //  Префикс для папок генерируемые в разработке но не участвующие
                //  в построение проекта и отслеживании изменений в watcher

/* -------------------------------------------------------------------------
*           INIT PLAGIN
---------------------------------------------------------------------------*/
const gulp =        require('gulp');

//          Working with Files 
const rename       = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
const del =         require('del');
//const path =        require('path');
const fs   = require('fs');

//          Working with Streams
const concat =      require('gulp-concat');
//const newer =       require('gulp-newer'); // Слечает дату модификации файлов в директориях откуда и куда
const cached =      require('gulp-cached');
//const remember =    require('gulp-remember');
//const replace =      require('gulp-replace'); // Замена части данных в файле https://www.npmjs.com/package/gulp-replace

//          Working with Styles
//const stylus =      require('gulp-stylus');
const less =        require('gulp-less');
const cssnano =     require('gulp-cssnano');
//const autoprefixer= require('gulp-autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls'); // Замена урла в css файлах https://www.npmjs.com/package/gulp-modify-css-urls

//          Working with fonts
const fontmin =     require('gulp-fontmin');

//      Working with JavaScript
const uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)

//          Working with images
const imagemin =    require('gulp-imagemin');

//          Browser - Sync
const browserSync = require('browser-sync').create();
//          Testing tool

//          Debug plagin
const debug =       require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
var gulpif =        require('gulp-if');
const notify =      require('gulp-notify'); //Выводит подсвеченный синтаксис ошибки в потоке и попап окно 
//      Вешает обработчики событий на все этпы в потоке 
//      что позволяет выдать сообщение на том этапе где произошла ошибка
const plumber =     require('gulp-plumber');
//     еще пару дебагеров
//      объединяет потоки в один что позволяет повесть на него один стандартный 
//      обработчик событий
//       multipipe
//       stream-combinear2

//gulp-ssh — обеспечивает возможность подключения по SSH и SFTP.
//gulp-zip — архивирует папки и файлы.
//gulp-clean и gulp-copy — соответственно очищают и копируют указанные исходники. 
//gulp-filesize — отображает размеры файлов в удобном для чтения формате.

//  --------------------------------------------
//          OTHER TASK
//  ------------------------------------------

//  -----------------------------------------------------
//  directory created
//  ----------------------------------------------------=
gulp.task('init:direct', function(callback) {
    const folders = [
        o.src.dev,
        o.src.dev + o.stylesDirect,
        o.src.dev+ o.stylesDirect +'libs/',            
        o.src.dev+ o.jsDirect,
        o.src.dev + o.jsDirect +'libs/',
        o.src.dev + o.fontsDirect,
        o.src.dev + o.tmpDirect,
        o.src.dev + o.imgDirect,                
        o.src.dev + o.modelDirect,
        o.src.build
    ];

    folders.forEach(dir => {
        if(!fs.existsSync(dir))     
            fs.mkdirSync(dir), 
            console.log('folder created:', dir);        
    });    
    callback();
});

gulp.task('init', gulp.series('init:direct'));

//  ----------------------------------------------------------
//          WORKING CSS LESS SASS STYLES
//  ----------------------------------------------------------

gulp.task('less',function(){
    return gulp.src(o.src.dev + o.less.pathLess + o.less.nameLess )
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(less({javascriptEnabled: true}))
    .pipe(debug())
    .pipe(gulpif( function() {
        if ( o.less.nameCSS ) return true;
        return false;
    } , rename( o.less.nameCSS ) ))
    .pipe(debug())
    .pipe(sourcemaps.write('logfile'))
    .pipe(gulp.dest(o.src.dev + o.less.pathCss));
});
    
gulp.task('delete:styles', function(callback) {
    if (o.src.dev + o.stylesDevDirect !== o.src.build + o.stylesDirect) {
        del.sync(o.src.build + o.stylesDirect +'**/*.css', {force: true});        
    }
    callback();
    
});

gulp.task('delete:css', function(callback) {
        del.sync([o.src.build + o.stylesDirect +'**/*.css', '!' + o.src.build + o.stylesDirect + '**/*min.css'], {force: true});            
    callback();
    
});

gulp.task('build:styles:normal',gulp.series('delete:styles','less', function(callback) {
    if (o.src.dev + o.stylesDevDirect !== o.src.build + o.stylesDirect) {
        gulp.src(o.src.dev + '*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));
     
    
        return gulp.src(o.src.dev + o.stylesDevDirect + '**/*.css')
            .pipe(plumber({errorHandler: notify.onError()}))
            .pipe(debug())
            .pipe(gulp.dest(o.src.build + o.stylesDirect));
    }
    callback();   
}));

gulp.task('build:styles:mini',gulp.series('delete:styles','less', function() {
    if (o.src.dev + o.stylesDevDirect !== o.src.build + o.stylesDirect) {
        gulp.src(o.src.dev + '*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));
    }

    return gulp.src(o.src.dev + o.stylesDevDirect + '**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(cssnano())
        .pipe(rename(function(path) {
            if (path.basename.search(/min/) === -1)
            path.basename += '.min'
        }))   
        .pipe(debug())     
        .pipe(gulp.dest(o.src.build + o.stylesDirect));
}));

//  ----------------------------------------------------------
//          WORKING JAVASCRIPT
//  ----------------------------------------------------------
gulp.task('delete:js', function(callback) {
    if (o.src.dev + o.jsDevDirect !== o.src.build + o.jsDirect) {
        del.sync(o.src.build + o.jsDirect , {force: true});
        console.log('-- Delete /js --');
    }    
    callback();
})

gulp.task('dev:js', function(callback) {
    if (o.src.dev + o.jsDevDirect !== o.src.build + o.jsDirect) {
        return gulp.src(o.src.dev + o.jsDevDirect + '**/*.js')
        .pipe(cached('dev:js'))
        .pipe(plumber({errorHandler: notify.onError()}))    
        .pipe(debug())
        .pipe(gulp.dest(o.src.build + o.jsDirect));
    }
    callback();
});

gulp.task('build:js:normal', gulp.series('delete:js',function(callback){
    if (o.src.dev + o.jsDevDirect !== o.src.build + o.jsDirect) {
        return gulp.src(o.src.dev + o.jsDevDirect +'**/*.js')
        .pipe(plumber({errorHandler: notify.onError()}))        
        .pipe(debug())     
        .pipe(gulp.dest(o.src.build + o.jsDirect));
    };
    callback();    
}));

gulp.task('build:js:mini', gulp.series('delete:js',function(callback){
    if (o.src.dev + o.jsDevDirect !== o.src.build + o.jsDirect) {
        return gulp.src(o.src.dev + o.jsDevDirect + '**/*.js')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(uglify())   
        .pipe(debug())     
        .pipe(gulp.dest(o.src.build + o.jsDirect));
    };
    callback();    
}));

//  ----------------------------------------------------------
//          FONTS
//  ----------------------------------------------------------
gulp.task('build:fonts',function(callback){
    if (o.src.dev + o.fontsDevDirect !== o.src.build + o.fontsDirect) {
        del.sync(o.src.build + o.fontsDirect, {force: true});
        console.log('-- Delete /fonts');
        return gulp.src(o.src.dev + o.fontsDevDirect + '*.*')
            .pipe(plumber({errorHandler: notify.onError()}))
            .pipe(debug())
            .pipe(gulp.dest(o.src.build + o.fontsDirect));
    };
    callback();    
})

gulp.task('dev:fonts', function(callback) {
    if (o.src.dev + o.fontsDevDirect !== o.src.build + o.fontsDirect) {
        return gulp.src(o.src.dev + o.fontsDevDirect + '**/*.*')
        .pipe(cached('dev:fonts'))
        .pipe(plumber({errorHandler: notify.onError()}))    
        .pipe(debug())
        .pipe(gulp.dest(o.src.build + o.fontsDirect));
    };
    callback();
});

gulp.task('fonts:convert', function() {
    return gulp.src(o.src.dev + o.fontsDevDirect + '*.ttf')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(fontmin())
        .pipe(debug())
        //  если получаем из потока файл расширения .css то выполним сборку в один файл fonts.css
        .pipe(gulpif(function(file){
            return file.extname === ".css";
        }, concat('fonts.css')))
        .pipe(debug())
        //  если файл взятый из потока имеет расширение .css то выплним модификацию в нем а именно
        //  отредактируем пути в файле с помощью плагина modifyCssUrls
        .pipe(gulpif(function(file){
            return file.extname === ".css";
        }, modifyCssUrls({
            //  запускаем функцию в которую получаем адрес из файла и корректируем его по условию
            //  условия в зависимости вложена ли папка с шрифтами в папку со стилями
            modify: function(url) {                
                if (o.fontsDevDirect.search(o.stylesDevDirect) === -1)
                     return '../'+ o.fontsDevDirect + url;
                else {
                    var path = o.fontsDevDirect.split('/');                    
                    return path[path.length - 2] + '/' + url;
                }
            }
        })))
        .pipe(debug())
        //  раскладываем файлы по каталогам .css идет в папку со стилями.
        .pipe(gulp.dest(function(file){
            return file.extname === ".css" ? o.src.dev + o.stylesDevDirect :
            o.src.dev + o.fontsDevDirect;
        }));
        
});
//  ----------------------------------------------------------
//          html
//  ----------------------------------------------------------
gulp.task('build:html', function(callback) {
    if (o.src.dev !== o.src.build ) {
        del.sync(o.src.build + '**/*.html', {force: true});
        console.log(' -- Dalete /**/*.html --');
        return gulp.src(o.src.dev + '**/*.html')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));
    };
    callback();    
});

gulp.task('dev:html', function(callback) {
    if (o.src.dev !== o.src.build) {
        return gulp.src(o.src.dev + '**/*.html')
        .pipe(cached('dev:html'))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));
    };
    callback();
});


//  ----------------------------------------------------------
//          PHP
//  ----------------------------------------------------------
gulp.task('dev:php', function(callback) {
    if (o.src.dev !== o.src.build ) {
        return gulp.src(o.src.dev + '**/*.php')
        .pipe(cached('dev:php'))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));
    };
    callback();    
});

gulp.task('build:php', function(callback) {
    if (o.src.dev !== o.src.build) {
        del.sync(o.src.build + '**/*.php', {force: true});
        console.log(' -- Dalete /**/*.php --');
        return gulp.src(o.src.dev + '**/*.php')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));
    };
    callback();        
});

//  ----------------------------------------------------------
//             Image
//  ----------------------------------------------------------
//  Optimization of images
gulp.task('build:img', function() {    
    return gulp.src(o.src.dev + o.imgDevDirect + '**/*.{jpg,png,jpeg,gif}')
        .pipe(cached('build:img'))
        .pipe(plumber({errorHandler: notify.onError()}))      
        .pipe(debug())
        .pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest(o.src.build + o.imgDirect))
});

gulp.task('delete:img', function(callback) {
    if (o.src.dev + o.imgDevDirect !== o.src.build + o.imgDirect) {
        del.sync(o.src.build + o.imgDirect , {force: true});
        console.log('Delate css/img');
    };    
    callback();
});

gulp.task('reset:img',gulp.series('delete:img', 'build:img'));

//  ----------------------------------------------------------
//             BUILD PROJECT 
//  ----------------------------------------------------------

gulp.task('delete:all',function(callback){
    if (o.src.dev  !== o.src.build) {
        del.sync(o.src.build + '**', {force: true});
        console.log('Delete all in direct theme');
    };    
    callback();
});

gulp.task('build:normal',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles:normal','build:js:normal','build:fonts')));

gulp.task('build:mini',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles:mini','build:js:normal','build:fonts')));
//  ----------------------------------------------------------
//     TESTING     
//  ----------------------------------------------------------

//  ------------------------------------------------------------
//          Browser - Sync
//  ------------------------------------------------------------


gulp.task('server:dev', function(){

    if (o.typeServer === 'single') {
        browserSync.init({
            server: o.src.dev
        });        
    } else if (o.typeServer === 'proxy') {
        browserSync.init({
            poxy: o.url +'/',
           
        });        
    }          
});

gulp.task('server:dev:watch', function(){

    if (o.typeServer === 'single') {
        browserSync.init({
            server: o.src.dev
        });
        browserSync.watch(o.src.dev + '**/*.*').on('change', browserSync.reload);
    } else if (o.typeServer === 'proxy') {
        browserSync.init({
            poxy: o.url +'/',
           
        });
        browserSync.watch(o.src.dev + '**/*.*').on('change', browserSync.reload);
    }          
});

gulp.task('server:public', function(){

    if (o.typeServer === 'single') {
        browserSync.init({
            server: o.src.build
        });
        browserSync.watch(o.src.build + '**/*.*').on('change', browserSync.reload);
    } else if (o.typeServer === 'proxy') {
        browserSync.init({
            poxy: o.url +'/',
           
        });
        browserSync.watch(o.src.build + '**/*.*').on('change', browserSync.reload);
    }    
});

gulp.task('server:reload', function(callback){
    browserSync.reload();    
    callback();
});
gulp.task('server:pause', function(callback){
    browserSync.pause();
    callback();
});
gulp.task('server:resume', function(callback){
    browserSync.resume();
    callback();
});
gulp.task('server:exit', function(callback){
    browserSync.exit();
    callback();
});

/*
*  ----------------------------------------------------------
*         Developer watcher 
*  ----------------------------------------------------------
*/

/*
*       -------------------
*           watch:styles
*       --------------------
*/
gulp.task( 'watch:styles', function() {
    var currentIgnoreFile = '';
    if (o.typeCompilerStyles === 'less') {
        gulp.watch( [ o.src.dev +'**/*.less', '!'+o.prefix+'*', '!node_modules/**/*.less', '!.template/**/*.less'], gulp.series('less', 'server:reload'));
        currentIgnoreFile = o.src.pathDirectDevelop + o.less.pathCss + o.less.nameCSS;
    };

    //          watch for CSS
    gulp.watch( [o.src.dev + '**/*.css', '!'+o.prefix+'*', '!node_modules/**/*.css', '!.template/**/*.css', '!'+ currentIgnoreFile ], gulp.series('server:reload') );    
 });

/*
*       -------------------
*           watch:img
*       -------------------
*/
gulp.task('watch:img', function(){
    if (o.src.dev + o.imgDevDirect !== o.src.build + o.imgDirect) {
        gulp.watch( [ o.src.dev + o.imgDevDirect + '**/*.*', '!' + o.prefix + '*' ], gulp.series('server:reload') );
    }    
});

/*
*       -----------------------
*           watch:fonts
*       -----------------------
*/
gulp.task('watch:fonts', function() {    
    gulp.watch( [ o.src.dev + o.fontsDevDirect + '**/*.*', '!' + o.prefix + '*'], gulp.series('server:reload') );
});

/*
*       -----------------------
*           watch:js
*       -----------------------
*/
gulp.task('watch:js', function() {
    gulp.watch( [ o.src.dev + o.jsDevDirect + '**/*.js', '!'+o.prefix+'*' ], gulp.series('server:reload') );
});

/*
*       -----------------------
*           watch:php
*       -----------------------
*/
gulp.task('watch:php', function() {
    gulp.watch( [o.src.dev + '**/*.php','!'+o.prefix+'*'], gulp.series('server:reload') );
});

/*
*       -----------------------
*           watch:html
*       -----------------------
*/
gulp.task('watch:html', function() {
    gulp.watch( [o.src.dev + '**/*.html','!'+o.prefix+'*'], gulp.series('server:reload') );
});

/*
*       -------------------
*           develop
*       -------------------
*/

gulp.task( 'develop', gulp.parallel( 'server:dev', 'watch:styles', 'watch:js', 'watch:fonts', 'watch:img', 'watch:html', 'watch:php' ) );





/*
* -----------------------
*   path code for example
*/

/*
    if (o.src.dev + o.imgDevDirect !== o.src.build + o.imgDirect) {
        gulp.watch(o.src.dev + o.imgDevDirect + '**\/*.*', gulp.series('build:img')).on('unlink', function(filepath) {           
            console.log('\t--remove file /img --');        
            delete  cached.caches['build:img'];
            del.sync(o.src.build + o.imgDirect, {force: true});
        });
    }
    */