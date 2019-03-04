'use strict'

/* -------------------------------------------------------------------------
*           SETTING THEMS
---------------------------------------------------------------------------*/
var setTheme = {
    name:               '',         // Имя проекта
    nameDirect:         '',         // имя директории 
    url:                '',         // Нужен для создания proxy сервера
    
    //  директории разработки относительно папки разработки!!!
    jsDevDirect:        'js/',
    stylesDevDirect:    'styles/',
    imgDevDirect:       'img/',
    fontsDevDirect:     'fonts/',
    modelDevDirect:     '_model/',
    tmpDevDirect:       '_tmp/',
    
    //  продакшн директории Отностительно папки продакшн!!!
    jsDirect:           'js/',
    stylesDirect:       'styles/',
    imgDirect:          'img/',
    fontsDirect:        'fonts/',

    //  SETTING LESS 
    //  Файлы стилей для компиляции в CSS
    //  для указания нового имени файла css, заполнить свойство nameCSS
    //  свойсво file and nameCSS могут быть строкой
    //  example: file: 'general.less'     
    lessFile:      {
                        file: '',
                        nameCSS: '',
                    },   
    
    //  для отслеживания дополнительного less файла
    //  при его изменениее компилирует его.    
    //  task: less:one
    //  watch: dev:watch:less | dev:watch
    //  example: lessOne: 'name.less',
    
    //  lessOne: '.less',
    
}
//  Установка базовых директорий проекта
setTheme.src = {    
    //  директория разработки
    dev: '../dev/',    
    //dev: '',

    // директория для продакшина
    build: '../public/',                                            // from single page 
    //build: '../wp-content/themes/' + setTheme.nameDirect + '/',   // from wp-theme
    //build: setTheme.nameDirect + '/',
    //build: '',
   
}

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
        setTheme.src.dev,
        setTheme.src.dev + setTheme.stylesDevDirect,
        setTheme.src.dev+ setTheme.stylesDevDirect +'libs/',
        //'dev/css/img',           
        setTheme.src.dev+ setTheme.jsDevDirect,
        setTheme.src.dev + setTheme.jsDevDirect +'libs/',
        setTheme.src.dev + setTheme.fontsDevDirect,
        setTheme.src.dev + setTheme.tmpDevDirect,
        setTheme.src.dev + setTheme.imgDevDirect,                
        setTheme.src.dev + setTheme.modelDevDirect,
        setTheme.src.build
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

gulp.task('less',function(callback){
    if ( setTheme.lessFile.file ) {
        return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + setTheme.lessFile.file )
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(less({javascriptEnabled: true}))
        .pipe(debug())
        .pipe(gulpif( function() {
            if ( setTheme.lessFile.nameCSS ) return true;
            return false;
        } , rename( setTheme.lessFile.nameCSS ) ))
        .pipe(debug())
        .pipe(sourcemaps.write('logfile'))
        .pipe(gulp.dest(setTheme.src.dev + setTheme.stylesDevDirect));
    }
    callback();
    
});

function lessOneInit(file) {   
    return gulp.task('less:one',function(){
                return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + file, {since: gulp.lastRun('less:one')})
                .pipe(sourcemaps.init())
                .pipe(plumber({errorHandler: notify.onError()}))
                .pipe(less({javascriptEnabled: true}))
                .pipe(debug())        
                .pipe(sourcemaps.write('logfile'))
                .pipe(gulp.dest(setTheme.src.dev + setTheme.stylesDevDirect));
            });
};
if (setTheme.lessOne) lessOneInit(setTheme.lessOne);
    
gulp.task('delete:styles', function(callback) {
    if (setTheme.src.dev + setTheme.stylesDevDirect !== setTheme.src.build + setTheme.stylesDirect) {
        del.sync(setTheme.src.build + setTheme.stylesDirect +'**/*.css', {force: true});        
    }
    callback();
    
});

gulp.task('delete:css', function(callback) {
        del.sync([setTheme.src.build + setTheme.stylesDirect +'**/*.css', '!' + setTheme.src.build + setTheme.stylesDirect + '**/*min.css'], {force: true});            
    callback();
    
});

gulp.task('build:styles:normal',gulp.series('delete:styles','less', function(callback) {
    if (setTheme.src.dev + setTheme.stylesDevDirect !== setTheme.src.build + setTheme.stylesDirect) {
        gulp.src(setTheme.src.dev + '*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build));
     
    
        return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + '**/*.css')
            .pipe(plumber({errorHandler: notify.onError()}))
            .pipe(debug())
            .pipe(gulp.dest(setTheme.src.build + setTheme.stylesDirect));
    }
    callback();   
}));

gulp.task('build:styles:mini',gulp.series('delete:styles','less', function() {
    if (setTheme.src.dev + setTheme.stylesDevDirect !== setTheme.src.build + setTheme.stylesDirect) {
        gulp.src(setTheme.src.dev + '*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build));
    }

    return gulp.src(setTheme.src.dev + setTheme.stylesDevDirect + '**/*.css')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(cssnano())
        .pipe(rename(function(path) {
            if (path.basename.search(/min/) === -1)
            path.basename += '.min'
        }))   
        .pipe(debug())     
        .pipe(gulp.dest(setTheme.src.build + setTheme.stylesDirect));
}));

//  ----------------------------------------------------------
//          WORKING JAVASCRIPT
//  ----------------------------------------------------------
gulp.task('delete:js', function(callback) {
    if (setTheme.src.dev + setTheme.jsDevDirect !== setTheme.src.build + setTheme.jsDirect) {
        del.sync(setTheme.src.build + setTheme.jsDirect , {force: true});
        console.log('-- Delete /js --');
    }    
    callback();
})

gulp.task('dev:js', function(callback) {
    if (setTheme.src.dev + setTheme.jsDevDirect !== setTheme.src.build + setTheme.jsDirect) {
        return gulp.src(setTheme.src.dev + setTheme.jsDevDirect + '**/*.js')
        .pipe(cached('dev:js'))
        .pipe(plumber({errorHandler: notify.onError()}))    
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + setTheme.jsDirect));
    }
    callback();
});

gulp.task('build:js:normal', gulp.series('delete:js',function(callback){
    if (setTheme.src.dev + setTheme.jsDevDirect !== setTheme.src.build + setTheme.jsDirect) {
        return gulp.src(setTheme.src.dev + setTheme.jsDevDirect +'**/*.js')
        .pipe(plumber({errorHandler: notify.onError()}))        
        .pipe(debug())     
        .pipe(gulp.dest(setTheme.src.build + setTheme.jsDirect));
    };
    callback();    
}));

gulp.task('build:js:mini', gulp.series('delete:js',function(callback){
    if (setTheme.src.dev + setTheme.jsDevDirect !== setTheme.src.build + setTheme.jsDirect) {
        return gulp.src(setTheme.src.dev + setTheme.jsDevDirect + '**/*.js')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(uglify())   
        .pipe(debug())     
        .pipe(gulp.dest(setTheme.src.build + setTheme.jsDirect));
    };
    callback();    
}));

//  ------------------------------------------------------------
//          Browser - Sync
//  ------------------------------------------------------------

gulp.task('server:single', function(){
    browserSync.init({
        server: setTheme.src.dev
    });
    browserSync.watch(setTheme.src.dev + '**/*.*').on('change', browserSync.reload);
});

gulp.task('server:proxy',function() {
    browserSync.init({
        poxy: setTheme.url +'/',
       
    });
    browserSync.watch(setTheme.src.dev + '**/*.*').on('change', browserSync.reload);
});

//  ----------------------------------------------------------
//          FONTS
//  ----------------------------------------------------------
gulp.task('build:fonts',function(callback){
    if (setTheme.src.dev + setTheme.fontsDevDirect !== setTheme.src.build + setTheme.fontsDirect) {
        del.sync(setTheme.src.build + setTheme.fontsDirect, {force: true});
        console.log('-- Delete /fonts');
        return gulp.src(setTheme.src.dev + setTheme.fontsDevDirect + '*.*')
            .pipe(plumber({errorHandler: notify.onError()}))
            .pipe(debug())
            .pipe(gulp.dest(setTheme.src.build + setTheme.fontsDirect));
    };
    callback();    
})

gulp.task('dev:fonts', function(callback) {
    if (setTheme.src.dev + setTheme.fontsDevDirect !== setTheme.src.build + setTheme.fontsDirect) {
        return gulp.src(setTheme.src.dev + setTheme.fontsDevDirect + '**/*.*')
        .pipe(cached('dev:fonts'))
        .pipe(plumber({errorHandler: notify.onError()}))    
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + setTheme.fontsDirect));
    };
    callback();
});

gulp.task('fonts:convert', function() {
    return gulp.src(setTheme.src.dev + setTheme.fontsDevDirect + '*.ttf')
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
                if (setTheme.fontsDevDirect.search(setTheme.stylesDevDirect) === -1)
                     return '../'+ setTheme.fontsDevDirect + url;
                else {
                    var path = setTheme.fontsDevDirect.split('/');                    
                    return path[path.length - 2] + '/' + url;
                }
            }
        })))
        .pipe(debug())
        //  раскладываем файлы по каталогам .css идет в папку со стилями.
        .pipe(gulp.dest(function(file){
            return file.extname === ".css" ? setTheme.src.dev + setTheme.stylesDevDirect :
            setTheme.src.dev + setTheme.fontsDevDirect;
        }));
        
});
//  ----------------------------------------------------------
//          html
//  ----------------------------------------------------------
gulp.task('build:html', function(callback) {
    if (setTheme.src.dev !== setTheme.src.build ) {
        del.sync(setTheme.src.build + '**/*.html', {force: true});
        console.log(' -- Dalete /**/*.html --');
        return gulp.src(setTheme.src.dev + '**/*.html')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build));
    };
    callback();    
});

gulp.task('dev:html', function(callback) {
    if (setTheme.src.dev !== setTheme.src.build) {
        return gulp.src(setTheme.src.dev + '**/*.html')
        .pipe(cached('dev:html'))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build));
    };
    callback();
});


//  ----------------------------------------------------------
//          PHP
//  ----------------------------------------------------------
gulp.task('dev:php', function(callback) {
    if (setTheme.src.dev !== setTheme.src.build ) {
        return gulp.src(setTheme.src.dev + '**/*.php')
        .pipe(cached('dev:php'))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build));
    };
    callback();    
});

gulp.task('build:php', function(callback) {
    if (setTheme.src.dev !== setTheme.src.build) {
        del.sync(setTheme.src.build + '**/*.php', {force: true});
        console.log(' -- Dalete /**/*.php --');
        return gulp.src(setTheme.src.dev + '**/*.php')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build));
    };
    callback();        
});

//  ----------------------------------------------------------
//             Image
//  ----------------------------------------------------------
//  Optimization of images
gulp.task('build:img', function() {    
    return gulp.src(setTheme.src.dev + setTheme.imgDevDirect + '**/*.{jpg,png,jpeg,gif}')
        .pipe(cached('build:img'))
        .pipe(plumber({errorHandler: notify.onError()}))      
        .pipe(debug())
        .pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest(setTheme.src.build + setTheme.imgDirect))
});

gulp.task('delete:img', function(callback) {
    if (setTheme.src.dev + setTheme.imgDevDirect !== setTheme.src.build + setTheme.imgDirect) {
        del.sync(setTheme.src.build + setTheme.imgDirect , {force: true});
        console.log('Delate css/img');
    };    
    callback();
});

gulp.task('reset:img',gulp.series('delete:img', 'build:img'));

//  ----------------------------------------------------------
//             BUILD PROJECT 
//  ----------------------------------------------------------

gulp.task('delete:all',function(callback){
    if (setTheme.src.dev  !== setTheme.src.build) {
        del.sync(setTheme.src.build + '**', {force: true});
        console.log('Delete all in direct theme');
    };    
    callback();
});

gulp.task('build:normal',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles:normal','build:js:normal','build:fonts')));

gulp.task('build:mini',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles:mini','build:js:normal','build:fonts')));
//  ----------------------------------------------------------
//     TESTING     
//  ----------------------------------------------------------


//  ----------------------------------------------------------
//         Developer watcher 
//  ----------------------------------------------------------
//--------------------- dev:watch:less ----------------------------------

gulp.task('dev:watch:less', gulp.series('less', function() {
    //  less
    if (setTheme.lessOne) {
        lessOneInit(setTheme.lessOne);
         gulp.watch(setTheme.src.dev + setTheme.stylesDevDirect + setTheme.lessOne, gulp.series('less:one'));
         gulp.watch([setTheme.src.dev + setTheme.stylesDevDirect +'**/*.less','!'+ setTheme.src.dev + setTheme.stylesDevDirect + setTheme.lessOne], gulp.series('less'));
    }
    else {
         gulp.watch(setTheme.src.dev + setTheme.stylesDevDirect +'**/*.less', gulp.series('less'));
    }    
    

    /*
    *               !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    *           Уходит в проверку папки gulp-tool если 
    *           файл находиться вне папки gulp-tool
    *           т.е когда условие истина
    * 
    */

    if (setTheme.src.build.search(/^\.\.\//is) == -1) {        
        gulp.watch(setTheme.src.dev + '**/*.css', function(){
           return gulp.src(setTheme.src.dev + '**/*.css')
                .pipe(plumber({errorHandler: notify.onError()}))      
                .pipe(debug())
                .pipe(gulp.dest(setTheme.src.build));
        });
    }
 }));



//--------------- dev:watch -----------------------------------

gulp.task('dev:watch', gulp.parallel('dev:watch:less', function(){
    //  less
    //  look up dev:watch:less

    //  img
    if (setTheme.src.dev + setTheme.imgDevDirect !== setTheme.src.build + setTheme.imgDirect) {
        gulp.watch(setTheme.src.dev + setTheme.imgDevDirect + '**/*.*', gulp.series('build:img')).on('unlink', function(filepath) {           
            console.log('\t--remove file /img --');        
            delete  cached.caches['build:img'];
            del.sync(setTheme.src.build + setTheme.imgDirect, {force: true});
        });
    }

    //  fonts
    gulp.watch(setTheme.src.dev + setTheme.fontsDevDirect + '**/*.*', gulp.series('dev:fonts')).on('unlink', function(){
        if (setTheme.src.dev + setTheme.fontsDevDirect !== setTheme.src.build + setTheme.fontsDirect) {
            console.log('\t--remove file fonts --');
            delete  cached.caches['dev:fonts'];        
            del.sync(setTheme.src.build + setTheme.fontsDirect, {force: true});
        }
    });

    //  js
    gulp.watch(setTheme.src.dev + setTheme.jsDevDirect + '**/*.js', gulp.series('dev:js')).on('unlink', function(){
        if (setTheme.src.dev + setTheme.jsDevDirect !== setTheme.src.build + setTheme.jsDirect) {
            console.log('\t--remove file js --');        
            delete  cached.caches['dev:js'];
            del.sync(setTheme.src.build + setTheme.jsDirect, {force: true /*разрешение на удаление вне каталога gulp*/ });
        };    
    });
    
    //  php
    gulp.watch(setTheme.src.dev + '**/*.php', gulp.series('dev:php')).on('unlink', function(){
        if (setTheme.src.dev !== setTheme.src.build ) {
            console.log('\t--remove file php --');        
            delete  cached.caches['dev:php'];
            del.sync(setTheme.src.build + '**/*.php', {force: true});
        }    
    });

    //  html
    gulp.watch(setTheme.src.dev + '**/*.html', gulp.series('dev:html')).on('unlink', function(){
        if (setTheme.src.dev !== setTheme.src.build ) {
            console.log('\t--remove file html --');        
            delete  cached.caches['dev:html'];
            del.sync(setTheme.src.build + '**/*.html', {force: true});
        };    
    });
}));



//  ----------------------------------------------------------
//          
//  ----------------------------------------------------------


