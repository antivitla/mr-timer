# Titamo&#x301;ta

Time, task and money tracking, clean and thoughtful. For my fellow coders.

*Powered by [vuejs](https://vuejs.org/)*

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Заметки о разработке / Devnotes

**Картинки / Images**

Статические картинки в `/static/img/` это те, которые прикрепляются как обычно, ссылкой. При компиляции к имени добавляется рандомный хеш. Путь к ним в коде необходимо делать относительным.

Второй тип картинок в `/src/assets/images/` это те, которые при компиляции преобразуются в data:image-формат (хорошо для мелочей, чтоб не плодить запросы к диску). Путь к ним нужно писать как, например `~@/assets/images/example.png`.

Static images in `/static/img/` are added as usual (link to file). Compiler will add random stuff to filename to battle cache. Path to such images should be relative.

Another images are compiled as `data:image` (good for small images). Their path should be some kind of root path with webpack-specific stuf, for example `~@/assets/images/example.png`. You should put such images to `/src/assets/images/`.

**Деплой изменений**

``` bash
npm run build
scp -r dist u49801@u49801.netangels.ru:~/mr-woodman.ru/www/titamota
```
