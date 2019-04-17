'use strict'
/* -------------------------------------------------------------------------
*           SETTING THEMS
---------------------------------------------------------------------------*/
var o = {
    /*
    *   SETTING NAME FOLDER AND PATH
    */
    nameDirectDevelop:  'develop/',  //   Имя директории разработки                                      
    pathDirectDevelop:  '../',      //   Путь до директории разработки
                                    //   относительно папки .gulp-tool

    nameDirectPublic:   'public/',   //   Имя директории сборки проекта
    pathDirectPublic:   '../',      //   Путь до директории сборки проекта, 
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
                nameLess: 'general.less',
                pathLess: o.stylesDirect + '/',
                nameCSS: 'main.css',
                pathCss:  o.stylesDirect + '/',
            };  

// SASS
o.sass =    {
    nameSass: 'general.scss',
    pathSass: o.stylesDirect + '/',
    nameCSS: 'main.css',
    pathCss:  o.stylesDirect + '/',
}; 
//  Установка базовых директорий проекта
o.src = {    
    //  Полный путь и имя директории разработки
    dev: o.pathDirectDevelop + o.nameDirectDevelop,  
    // Полный путь и имя директории сборки готового проекта
    build: o.pathDirectPublic + o.nameDirectPublic,
}
o.prefix = '.'; //  Префикс для папок генерируемые в разработке но не участвующие
                //  в построение проекта и отслеживании изменений в watcher
o.exeption = '!'+o.src.dev+'**/'+o.prefix+'*/**/*.*';
o.inOnePlace = o.src.dev === o.src.build;
if ( o.inOnePlace ) console.log('Внимание папка разработки и прдакшн одинаковые!!'); 
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
const concat            = require('gulp-concat');
//const newer =       require('gulp-newer'); // Слечает дату модификации файлов в директориях откуда и куда
//const cached            = require('gulp-cached');
//const remember =    require('gulp-remember');
const replace =      require('gulp-replace'); // Замена части данных в файле https://www.npmjs.com/package/gulp-replace

//          Working with HTML and XML
const cheerio = require('gulp-cheerio'); // https://www.npmjs.com/package/gulp-cheerio

//          Working with Styles
//const stylus =      require('gulp-stylus');
const less              = require('gulp-less');
const sass              = require('gulp-sass');
sass.compiler           = require('node-sass');
const cssnano           = require('gulp-cssnano');
//const autoprefixer      = require('gulp-autoprefixer');
const modifyCssUrls     = require('gulp-modify-css-urls'); // Замена урла в css файлах https://www.npmjs.com/package/gulp-modify-css-urls
const csslint           = require('gulp-csslint'); // Инструмент поиска и показа ошибок в коде css
const uncss             = require('gulp-uncss');
const postcss           = require('gulp-postcss');
const autoprefixer      = require('autoprefixer');
const qcmq              = require('gulp-group-css-media-queries');

//          Working with fonts
const fontmin =     require('gulp-fontmin');

//      Working with JavaScript
const uglify            = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)

//          Working with images
const imagemin          = require('gulp-imagemin');
const spritesmith       = require('gulp.spritesmith'); // https://www.npmjs.com/package/gulp.spritesmith
const svgSprite         = require('gulp-svg-sprite'); // https://www.npmjs.com/package/gulp-svg-sprite

//          Browser - Sync
const browserSync       = require('browser-sync').create();
//          Testing tool
const htmlhint          = require('gulp-htmlhint');
const htmlmin           = require('gulp-htmlmin');

//          Debug plagin
const debug             = require('gulp-debug');
const sourcemaps        = require('gulp-sourcemaps');
const gulpif              = require('gulp-if');
const notify            = require('gulp-notify'); //Выводит подсвеченный синтаксис ошибки в потоке и попап окно 
//      Вешает обработчики событий на все этпы в потоке 
//      что позволяет выдать сообщение на том этапе где произошла ошибка
const plumber           = require('gulp-plumber');
const zip               = require('gulp-zip');
//     еще пару дебагеров
//      объединяет потоки в один что позволяет повесть на него один стандартный 
//      обработчик событий
//       multipipe
//       stream-combinear2

//gulp-ssh — обеспечивает возможность подключения по SSH и SFTP.
//gulp-zip — архивирует папки и файлы.
//gulp-clean и gulp-copy — соответственно очищают и копируют указанные исходники. 
//gulp-filesize — отображает размеры файлов в удобном для чтения формате.


/*
*  -----------------------------------------------------
*           Init tasks
*  -----------------------------------------------------
*/
gulp.task('init:direct', function(callback) {
    const folders = [
        o.src.dev,
        o.src.dev + o.stylesDirect,
        o.src.dev + o.stylesDirect +'libs/',            
        o.src.dev + o.jsDirect,
        o.src.dev + o.jsDirect +'libs/',
        o.src.dev + o.fontsDirect,
        o.src.dev + o.fontsDirect + 'convert/',
        o.src.dev + o.tmpDirect,
        o.src.dev + o.imgDirect,
        o.src.dev + o.imgDirect + 'spriteSvg',
        o.src.dev + o.imgDirect + 'spritePng',       
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

gulp.task('init:styles', function() {
    if (o.typeCompilerStyles === 'less') {
        gulp.src('.template/styles/less/**.*')
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.dev + o.stylesDirect));
    };

    return  gulp.src('.template/styles/libs/**.*')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + o.stylesDirect + 'libs'));
});
gulp.task('init:js', function() {
    return  gulp.src('.template/js/**/*.*')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + o.jsDirect));
});
gulp.task('init:html', function() {
    return  gulp.src('.template/html/**.*')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest( o.src.dev ));
});
gulp.task('init:readme', function() {
    return  gulp.src('.template/*.{md,txt}')
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest( o.src.dev ));
})
gulp.task('init', gulp.series('init:direct', 'init:styles', 'init:js', 'init:html' , 'init:readme' ));

/*
*   ----------------------------------------------------------
*
*
*           BLOCK OPTIMIZATION 
*
*
*   ----------------------------------------------------------
*/
/*
*       -------------------------
*           Optimization Styles
*       -------------------------
*/
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

gulp.task('sass',function(){
    return gulp.src(o.src.dev + o.sass.pathSass + o.sass.nameSass )
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(sass())
    .pipe(debug())
    .pipe(gulpif( function() {
        if ( o.sass.nameCSS ) return true;
        return false;
    } , rename( o.sass.nameCSS ) ))
    .pipe(debug())
    .pipe(sourcemaps.write('logfile'))
    .pipe(gulp.dest(o.src.dev + o.sass.pathCss));
});

gulp.task('styles:delMin', function(callback){
    del.sync( [ o.src.dev + '**/*.min.css' , o.exeption], {force: true});
    console.log('-- Delete all *.min.css --');
    callback();
});
gulp.task('styles:min', gulp.series( 'styles:delMin', function() {
    return gulp.src( [o.src.dev + '**/*.css', o.exeption] )
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(cssnano())
        .pipe(rename(function(path) {
            if (path.basename.search(/min/) === -1)
            path.basename += '.min'
        }))   
        .pipe(debug())     
        .pipe( gulp.dest(o.src.dev) );
}));
gulp.task('styles:csslint', function(callback){
    gulp.src([o.src.dev + o.stylesDirect + '*.css', o.exeption])
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(csslint())
        .pipe(csslint.formatter());
        
    callback();
});

/*
*       не работает надо разбираться
// лучшее решение для оптимизации CSS файлов. Плагин
// анализирует HTML код и находит все неиспользуемые и продублированные
// стили
gulp.task('styles:uncss', function () {
    var dir = o.prefix+'uncss_'+ ((Date.now()).toString()).slice(-6);
    gulp.src( [o.src.dev + o.stylesDirect + '*.css', o.exeption] )    
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + o.stylesDirect + dir));
    console.log('\nИмя папки бекапа: '+dir +'\n');
    return gulp.src([o.src.dev + o.stylesDirect + '*.css', o.exeption])
        .pipe(uncss({
            html: [o.src.dev + '*.html'],
            //stylesheets  : ['styles/libs/bootstrap.css', 'styles/main.css'],
        }))
        .pipe(gulp.dest(o.src.dev + o.stylesDirect));
});
*/
// один из самых полезных плагинов, который автоматически 
// расставляет префиксы к CSS свойствам, исходя из статистики ca
// Важно сказать, что Автопрефиксер это лишь один из множества дополнений в рамках проекта PostCSS от Злых Марсиан.
gulp.task('styles:autoprefixer', function () {
    var dir = o.prefix+'autoprefixer_'+ Date.now();
    gulp.src( [o.src.dev + o.stylesDirect + '*.css', o.exeption] )    
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + o.stylesDirect + dir));


    return gulp.src( [o.src.dev + o.stylesDirect + '*.css', o.exeption] )
        //.pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({
            browsers: ['cover 99.5%']
        }) ]))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( o.src.dev + o.stylesDirect ));
});

gulp.task('styles:media', function () {
    var dir = o.prefix+'media-queries_'+ Date.now();
    gulp.src( [o.src.dev + o.stylesDirect + '*.css', o.exeption] )    
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + o.stylesDirect + dir));
    console.log('Backup OK!');

    return gulp.src( [o.src.dev + o.stylesDirect + '*.css', o.exeption] )
        //.pipe(sourcemaps.init())
        .pipe(qcmq())
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( o.src.dev + o.stylesDirect ));
});
/*
*       ----------------------------
*           Optimization JavaScript
*       ----------------------------
*/

gulp.task('js:min', function(callback){
    

    return gulp.src( [ o.src.dev + o.jsDirect +'*.js', o.exeption] )
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename = 'main.min'
    }))      
    .pipe(debug())     
    .pipe(gulp.dest(o.src.dev + o.jsDirect));
});

/*
*       ------------------------
*           Optimization Fonts
*       ------------------------
*/
gulp.task('fonts:convert', function() {
    var prefix = '-convert-'+ Date.now();
    return gulp.src( [o.src.dev + o.fontsDirect + 'convert/*.ttf', o.exeption] )
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(fontmin())
        .pipe(debug())
        //  если получаем из потока файл расширения .css то выполним сборку в один файл fonts.css
        .pipe(gulpif(function(file){
            return file.extname === ".css";
        }, concat('fonts'+prefix+'.css')))
        .pipe(debug())
        //  если файл взятый из потока имеет расширение .css то выплним модификацию в нем а именно
        //  отредактируем пути в файле с помощью плагина modifyCssUrls
        .pipe(gulpif(function(file){
            return file.extname === ".css";
        }, modifyCssUrls({
            //  запускаем функцию в которую получаем адрес из файла и корректируем его по условию
            //  условия в зависимости вложена ли папка с шрифтами в папку со стилями
            modify: function(url) {                
                if (o.fontsDirect.search( o.stylesDirect ) === -1)
                     return '../'+ o.fontsDirect + url;
                else {
                    var path = o.fontsDirect.split('/');                    
                    return path[path.length - 2] + '/' + url;
                }
            }
        })))
        .pipe(debug())
        //  раскладываем файлы по каталогам .css идет в папку со стилями.
        .pipe(gulp.dest(function(file){
            return file.extname === ".css" ? o.src.dev + o.stylesDirect :
            o.src.dev + o.fontsDirect;
        }));
        
});

/*
*       ----------------------
*           Optimization Html
*       ----------------------
*/
gulp.task('html:min', function() {
    var dir = o.prefix+'htmlmin_'+ Date.now();
    gulp.src( [o.src.dev + '**/*.html', o.exeption] )    
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + dir));

    return gulp.src([o.src.dev + '**/*.html', o.exeption])
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(o.src.dev));
  });
gulp.task('html:hint', function(callback){
    return gulp.src( [o.src.dev + '**/*.html', o.exeption] )
        .pipe( htmlhint({
            "tagname-lowercase": true,
            "attr-lowercase": true,
            "attr-value-double-quotes": true,
            "attr-value-not-empty": false,
            "attr-no-duplication": true,
            "doctype-first": true,
            "tag-pair": true,
            "empty-tag-not-self-closed": true,
            "spec-char-escape": true,
            "id-unique": true,
            "src-not-empty": true,
            "title-require": true,
            "alt-require": true,
            "doctype-html5": true,
            "id-class-value": "dash",
            "style-disabled": true,
            "inline-style-disabled": true,
            "inline-script-disabled": true,
            "space-tab-mixed-disabled": "space",
            "id-class-ad-disabled": true,
            "href-abs-or-rel": true,
            "attr-unsafe-chars": true,
            "head-script-disabled": false
          }
          ) )
        .pipe(htmlhint.reporter())
        .pipe(htmlhint.failOnError({ suppress: true }))
});

/*
*       ----------------------
*           Optimization PHP
*       ----------------------
*/

/*
*       ----------------------
*           Optimization IMG
*       ----------------------
*/
gulp.task('img:min', function(callback) {
    var dir = o.prefix+ Date.now();
    gulp.src([o.src.dev+o.imgDirect+'**/*.{jpg,png,jpeg,gif,svg}', o.exeption])
    .pipe(plumber({errorHandler: notify.onError()}))
    .pipe(debug())
    .pipe(gulp.dest(o.src.dev + o.imgDirect + dir));
    
    return gulp.src([o.src.dev+o.imgDirect+'**/*.{jpg,png,jpeg,gif,svg}', o.exeption])        
        .pipe(plumber({errorHandler: notify.onError()}))  
        .pipe(debug())
        .pipe(imagemin())
        .pipe(debug())
        .pipe(gulp.dest(o.src.dev + o.imgDirect))

});

gulp.task('img:sprite:png', function (callback) {
    var prefix = ((Date.now()).toString()).slice(-6),
        cssFormat = '';
    if (o.typeCompilerStyles === 'less') cssFormat = 'less';
    else if (o.typeCompilerStyles === 'sass') cssFormat = 'scss';
    console.log('Формат таблицы стилей: '+ cssFormat);
    console.log('\n Префих файлов: ' + prefix + '\n');
    var spriteData = 
        gulp.src( [o.src.dev+o.imgDirect+'spritePng/*.{png,jpeg,jpg}', o.exeption] ) // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite_'+prefix+'.png',
                imgPath: '../'+o.imgDirect+'sprite_'+prefix+'.png',
                cssName: 'spritePng_'+ prefix +'.'+cssFormat,
                algorithm: 'binary-tree',
                cssFormat: cssFormat,
                padding: 2,

            }))
            .pipe(plumber({errorHandler: notify.onError()}))
            .pipe(debug());

    return spriteData.pipe( gulp.dest(function(file){
        return ( file.extname === ".css" || file.extname === "." + cssFormat ) ? o.src.dev + o.stylesDirect :
        o.src.dev + o.imgDirect;
    }) ); // Сортируем поток css and less кладем в папку styles а sprite в папку img
});
gulp.task('img:sprite:svg', function () {
    var prefix = ((Date.now()).toString()).slice(-6);
    console.log('\n Префих файлов: ' + prefix + '\n');
    return gulp.src( [o.src.dev+o.imgDirect+'spriteSvg/*.svg', o.exeption] ) // svg files for sprite
        .pipe(svgSprite({            
                mode: {                    
                    css: {
                        dest: '.',
                        sprite: "sprite_"+prefix+".svg",  //sprite file name
                        render: {
                            css: true,
                        }  
                    },                                      
                },                                               
            }
        ))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(rename(function(path) {
            if (path.extname === ".css")
            path.basename += 'SVG_'+ prefix;
            if (path.extname === '.svg')
            path.basename = 'sprite_'+ prefix;
        })) 
        .pipe(gulp.dest(function(file){
            return file.extname === ".css" ? o.src.dev + o.stylesDirect :
            o.src.dev + o.imgDirect;
        }));
});
gulp.task('img:sprite:svg:symbol', function () {
    return gulp.src( [o.src.dev+o.imgDirect+'spriteSvg/*.svg', o.exeption] ) // svg files for sprite
        // remove all fill and style declarations in out shapes
        .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[style]').removeAttr('style');
            }
        }))
        // cheerio plugin create unnecessary string '>', so replace it.
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({            
                mode: {                    
                    symbol: {
                        dest: '.',
                        sprite: "sprite-symbol.svg",  //sprite file name                        
                    },                                      
                },                                               
            }
        ))
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())        
        .pipe(gulp.dest(o.src.dev + o.imgDirect));
});

/*
*   ----------------------------------------------------------
*
*
*           BLOCK BUILD 
*
*
*   ----------------------------------------------------------
*/
/*
*       ------------------
*           Build Styles
*       ------------------
*/    
gulp.task('build:styles', function(callback) {
    if ( !o.inOnePlace ) {
        return gulp.src([o.src.dev + '**/*.css', o.exeption])
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));    
    }
    callback();
});
gulp.task('delete:styles', function(callback) {
    if ( !o.inOnePlace ) {
        del.sync(o.src.build + '**/*.css', {force: true});        
    }
    callback();
});
gulp.task('build:styles:zip', function() {
    return gulp.src( [o.src.dev+o.stylesDirect+'**/*.*', o.exeption, '!'+o.src.dev+o.stylesDirect+'*.min.js'])
         .pipe(zip('styles.zip'))
         .pipe(gulp.dest(o.src.build+o.stylesDirect))
 });
gulp.task('reset:styles', gulp.series('delete:styles','build:styles'));
/*
*       ---------------------
*           Build JavaScript
*       ---------------------
*/
gulp.task('build:js', function(callback){
    if (!o.inOnePlace) {
        return gulp.src([o.src.dev + o.jsDirect +'**/*.js', o.exeption])
        .pipe(plumber({errorHandler: notify.onError()}))        
        .pipe(debug())     
        .pipe(gulp.dest(o.src.build + o.jsDirect));
    };
    callback();    
});
gulp.task('delete:js', function(callback) {
    if ( !o.inOnePlace ) {
        del.sync(o.src.build + o.jsDirect , {force: true});
        console.log('-- Delete js --');
    }    
    callback();
});
gulp.task('build:js:zip', function() {
    return gulp.src( [o.src.dev+o.jsDirect+'**/*.*', o.exeption, '!'+o.src.dev+o.jsDirect+'*.min.js'] )
         .pipe(zip('js.zip'))
         .pipe(gulp.dest(o.src.build+o.jsDirect))
 });
gulp.task('reset:js', gulp.series('delete:js','build:js'));

/*
*       ------------------
*           Build Fonts
*       ------------------
*/

gulp.task('build:fonts', function(callback){
    if (  !o.inOnePlace ) {
        return gulp.src([ o.src.dev + o.fontsDirect +'**/*.*', o.exeption, '!'+o.src.dev + o.fontsDirect + 'convert*/**/*.*'])
        .pipe(plumber({errorHandler: notify.onError()}))        
        .pipe(debug())     
        .pipe(gulp.dest(o.src.build + o.fontsDirect));
    };
    callback();    
});
gulp.task('delete:fonts', function(callback) {
    if ( !o.inOnePlace ) {
        del.sync(o.src.build + o.fontsDirect , {force: true});
        console.log('-- Delete js --');
    }    
    callback();
})
gulp.task('reset:fonts', gulp.series('delete:fonts','build:fonts'));

/*
*       ------------------
*           Build HTML
*       ------------------
*/
gulp.task('build:html', function(callback) {
    if ( !o.inOnePlace ) {
        return gulp.src([o.src.dev + '**/*.html', o.exeption])
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));    
    }
    callback();
});
gulp.task('delete:html', function(callback) {
    if ( !o.inOnePlace ) {
        del.sync(o.src.build + '**/*.html', {force: true});        
    }
    callback();
    
});
gulp.task('reset:html', gulp.series('delete:html','build:html'));
/*
*       ------------------
*           Build PHP
*       ------------------
*/
gulp.task('build:php', function(callback) {
    if ( !o.inOnePlace ) {
        return gulp.src([o.src.dev + '**/*.php', o.exeption])
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(debug())
        .pipe(gulp.dest(o.src.build));    
    }
    callback();
});
gulp.task('delete:php', function(callback) {
    if ( !o.inOnePlace ) {
        del.sync(o.src.build + '**/*.php', {force: true});        
    }
    callback();    
});
gulp.task('reset:php', gulp.series('delete:php','build:php'));
/*
*       ------------------
*           Build IMG
*       ------------------
*/
gulp.task('build:img', function(callback) {    
    if ( !o.inOnePlace ) {
        return gulp.src([o.src.dev + o.imgDirect + '**/*.{jpg,png,jpeg,gif,svg}', o.exeption, '!'+o.src.dev + o.imgDirect + 'sprite*/**/*.*'])
        .pipe(plumber({errorHandler: notify.onError()}))      
        .pipe(debug())
        .pipe(gulp.dest(o.src.build + o.imgDirect))
    }
    callback();
});
gulp.task('delete:img', function(callback) {
    if ( !o.inOnePlace ) {
        del.sync(o.src.build + o.imgDirect , {force: true});
        console.log('Delate img');
    };    
    callback();
});
gulp.task('reset:img',gulp.series('delete:img', 'build:img'));
/*
*       ------------------
*           Build PROJECT
*       ------------------
*/
gulp.task('delete:all',function(callback){
    if ( !o.inOnePlace ) {
        del.sync([o.src.build + '**', '!'+o.src.dev+'**'] , {force: true});
        console.log('Delete all in direct theme');
    };    
    callback();
});
gulp.task('build',gulp.series('delete:all', gulp.parallel('build:html','build:php','build:img','build:styles','build:js','build:fonts','build:styles:zip','build:js:zip')));



/*
*  ------------------------------------------------------------
*           Browser - Sync
*  ------------------------------------------------------------
*/


gulp.task('server', function(){

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

gulp.task('server:dev', function(){

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
        gulp.watch( [ o.src.dev +'**/*.less', o.exeption, '!node_modules/**/*.less', '!.template/**/*.less'], gulp.series('less', 'server:reload'));
        currentIgnoreFile = o.src.pathDirectDevelop + o.less.pathCss + o.less.nameCSS;
    };
    if (o.typeCompilerStyles === 'sass') {
        gulp.watch( [ o.src.dev +'**/*.{sass,scss}', o.exeption, '!node_modules/**/*.{sass,scss}', '!.template/**/*.{sass,scss}'], gulp.series('sass', 'server:reload'));
        currentIgnoreFile = o.src.pathDirectDevelop + o.sass.pathCss + o.sass.nameCSS;
    };

    //          watch for CSS
    gulp.watch( [o.src.dev + '**/*.css', o.exeption, '!node_modules/**/*.css', '!.template/**/*.css', '!'+ currentIgnoreFile ], gulp.series('server:reload') );    
 });

/*
*       -------------------
*           watch:img
*       -------------------
*/
gulp.task('watch:img', function(){
    if (o.src.dev + o.imgDirect !== o.src.build + o.imgDirect) {
        gulp.watch( [ o.src.dev + o.imgDirect + '**/*.*', '!' + o.prefix + '*' ], gulp.series('server:reload') );
    }    
});

/*
*       -----------------------
*           watch:fonts
*       -----------------------
*/
gulp.task('watch:fonts', function() {    
    gulp.watch( [ o.src.dev + o.fontsDirect + '**/*.*', '!' + o.prefix + '*'], gulp.series('server:reload') );
});

/*
*       -----------------------
*           watch:js
*       -----------------------
*/
gulp.task('watch:js', function() {
    gulp.watch( [ o.src.dev + o.jsDirect + '**/*.js', o.exeption ], gulp.series('server:reload') );
});

/*
*       -----------------------
*           watch:php
*       -----------------------
*/
gulp.task('watch:php', function() {
    gulp.watch( [o.src.dev + '**/*.php',o.exeption], gulp.series('server:reload') );
});

/*
*       -----------------------
*           watch:html
*       -----------------------
*/
gulp.task('watch:html', function() {
    gulp.watch( [o.src.dev + '**/*.html',o.exeption], gulp.series('server:reload') );
});

/*
*       -------------------
*           develop
*       -------------------
*/

gulp.task( 'develop', gulp.parallel( 'server', 'watch:styles', 'watch:js', 'watch:fonts', 'watch:img', 'watch:html', 'watch:php' ) 
);





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