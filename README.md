# .gulp-tool
Конфигурационный файл для работы над проектами фронтенда. Настраивается под работу с темой из разного уровня вложенности а так же для работы над одностраничными сайтами.



## List Task
### Inint Tasks
*   init     
    Общий таск. Содержит в себе все init:*   
*   init:styles    
    Добовляет шаблон стилей из папки .template    
*   init:js  
    Добавляет шаблон скрипта из папки .template     
*   init:html   
    Простенький шаблно страничкииз папки .template    
*   init:direct    
    Генерация папок проекта     
### Optimization Tasks   
#### Optimization Styles      
*   less   
    Компилятор less     

*   sass
    Компилятор Sass

*   styles:delMin
    Удаляетв все файлы с префиксом min.css       

*   styles:min     
    Минификация всех файлов .css в проекте с добавление префиксов для браузеров         

*   styles:min:fresh     
    Минификация всех файлов .css в проекте. Удаляет все префиксы применять для проектов раотающих на свежих версиях.          

*   styles:csslint    
    Проверка на ошибки в css файлах. Выводится в консоль            

*   styles:uncss      
    Удаляет не задействованные свойтсва в html файлах.          

*   styles:autoprefixer      
    Расстановка префиксов в css файлах в папке styles           

#### Optimization JavaScript   
*   js:min      
#### Optimization Fonts   
*   fonts:convert  
    Шрифты которые нужно сконвертировать во все поддерживаемые складываем в папку __convert__
#### Optimization Html    
*   html:min   
    Минификация получаем файл и бекап в папке prefix_time
*   html:hint   
    Праверка на валидность ошибки в консоли
#### Optimization IMG            
*   img:min                   
*   img:sprite:png   
    Делает спрайт из файлов в img/spritePng. На выходе файл less и спрайт в папках styles and img              
*   img:sprite:svg                     
    Делает спрайт из файлов в img/spriteSvg. На выходе файл css в папку styles и спрайт в папкy img. Дает стили со вставкой svg в background-image
*   img:sprite:svg:symbol
    Создает в папке img svg файл где все кортинкы сгруппированы с помощью symbol. Для прямой вставки в код или через `data:url`
 ```
 <svg class="svg">
        <use xlink:href="picture.svg#github"></use>
    </svg>
```    

### Build Tasks               

*   build             
*   delete:all           

*   build:styles              
*   delete:styles                
*   build:styles:zip                             
*   reset:styles          
                
*   build:js                           
*   delete:js                
*   build:js:zip              
*   reset:js                  

*   build:fonts                
*   delete:fonts              
*   reset:fonts                

*   build:html              
*   delete:html            
*   reset:html                    

*   build:php                 
*   delete:php             
*   reset:php                 

*   build:img              
*   delete:img             
*   reset:img                  

### Develop Tasks              
*   develop                  

### Server Tasks              
*   server:dev                             
*   server:public              
                    

