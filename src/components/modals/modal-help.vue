<template lang="pug">
  .modal.help
    //- Close
    .close-modal(@click="closeModal")
      i.material-icons close

    h2 {{ label('view.help')}}

    template(v-if="locale === 'ru'")
      p.index
        a(@click="scrollToIndex(1)")
          small 1. Быстрый старт задач
        a(@click="scrollToIndex(2)")
          small 2. Подзадачи через « / »
        a(@click="scrollToIndex(3)")
          small 3. Редактирование
        a(@click="scrollToIndex(4)")
          small 4. Контекст
        a(@click="scrollToIndex(5)")
          small 5. Вкладки (виды)
        a(@click="scrollToIndex(6)")
          small 6. Авторизация
        a(@click="scrollToIndex(7)")
          small 7. Боковое меню
        a(@click="scrollToIndex(8)")
          small 8. Деньги, валюта и язык
        a(@click="scrollToIndex(9)")
          small 9. Отчёт!

      h3(ref="index-1") 1. Быстрый старт задач
      p &mdash; <strong>Клик</strong> по кнопке с цифрами запускает таймер. Если название задачи не задано в строке ввода рядом, оно cгенерируется.
      p
        img(src="static/img/help-001-ru.png")
      p &mdash; <strong>Enter</strong> в строке ввода запускает и останавливает запись. Если названия задачи нет, оно создастся.
      p
        img(src="static/img/help-002-ru.png")
      p &mdash; <strong>Клик</strong> по задаче продолжит её. Не обязательно останавливать таймер.
      p
        img(src="static/img/help-003-ru.png")
      p &mdash; <strong>Клик по родительской</strong> задаче создаст новую внутри и запустит её. Не обязательно останавливать таймер.
      p
        img(src="static/img/help-004-ru.png")

      h3(ref="index-2") 2. Подзадачи через « / »
      p Можно делать подзадачи, если в названии отделить их с помощью « / » (наклонная черта с пробелами до и после). См. <a v-on:click="scrollToIndex(4)">пункт 4 "Контекст"</a> дополнительно.
      p
        img(src="static/img/help-005-ru.png")

      h3(ref="index-3") 3. Редактирование
      p Задачи можно редактировать в процессе записи в поле ввода, или позже:
      p &mdash; <strong>Длинным кликом</strong> по тексту задачи
      p
        img(src="static/img/help-006-ru.png")
      p &mdash; <strong>При наведении</strong> мыши на задачу появится доп. меню, там иконка редактирования
      p
        img(src="static/img/help-007-ru.png")
      p &mdash; <strong>Время</strong> можно редактировать рядом с названием задачи. Формат такой: 45 минут это "45м" или "45m" (буквы русские или латинские),  5 часов это "5ч" или "5h", а 2 часа 30 минут это "2ч 35м" или "2h 35m".
      p
        img(src="static/img/help-018-ru.png")

      h3(ref="index-4") 4. Контекст
      p Когда станет много проектов и длинных задач, можно установить "контекст" - это означает что таймер "войдет" в задачу как в папку и будет показывать только ее содержимое во всех вкладках. Названия задач тоже сократятся. Это своего рода путешествие по дереву файлов и папок. "Войти" в задачу (сделать её "контекстом") это иконка "папка" при наведении на задачу мыши во вкладке "задачи".
      p
        img(src="static/img/help-008-ru.png")
      p
        img(src="static/img/help-009-ru.png")

      h3(ref="index-5") 5. Вкладки (виды)
      p Есть несколько вкладок - задачи, годы, месяцы, дни и хранилище. Это разная группировка исходных записей таймера.
      p
        img(src="static/img/help-010-ru.png")
      p <strong>Запись</strong> состоит из даты начала, даты конца и названия задачи (длительность вычисляется автоматически). Получается длинный список записей, который и хранится в базе данных. Этот вид представлен во вкладке <em>"хранилище"</em>.
      p
        img(src="static/img/help-011-ru.png")
      p Остальные виды группируют записи по названию задачи, чтобы можно было увидеть сколько всего времени потрачено на задачу (вкладка "задачи"), что было сделано за неделю, месяц, день.


      h3(ref="index-6") 6. Авторизация
      p Рекомендуется авторизоваться через соцсети (клик по иконке меню в верхнем правом углу), чтобы ваши данные сохранялись на сервер и были доступны на разных устройствах. Но можно работать и без регистрации - тогда данные будут сохраняться только в одном броузере.
      p
        img(src="static/img/help-012-ru.png")

      h3(ref="index-7") 7. Боковое меню
      p Меню содержит различные настройки интерфейса, а также экспорт и импорт. Там же и вход через соцсети. Закрыть кликнув по верхней части меню (картинка). Чтобы не отвлекали, можно отключить какие-то части интерфейса.
      p
        img(src="static/img/help-013-ru.png")

      h3(ref="index-8") 8. Деньги, валюта и язык
      p Да, конечно можно показывать сумму заработанных денег - в рублях, долларах, евро и юанях. Выбор валюты в <strong>боковом меню</strong>. Цена слева над списком задач. Можно переключить на английский.
      p
        img(src="static/img/help-014-ru.png")
      p
        img(src="static/img/help-015-ru.png")

      h3(ref="index-9") 9. Отчет!
      p Его можно сформировать по текущему содержимому таймера. В Excel, Markdown и обычный текст. Сложность отчета можно настроить. Выбор отчёта - вкладка "зигзаг". См. <a v-on:click="scrollToIndex(4)">пункт 4 "Контекст"</a>, чтобы в отчет попала только выбранная задача с подзадачами, а не вообще всё.
      p
        img(src="static/img/help-016-ru.png")
      p
        img(src="static/img/help-017-ru.png")

    template(v-else)
      p.index
        a(@click="scrollToIndex(1)")
          small 1. Quick start task
        a(@click="scrollToIndex(2)")
          small 2. Subtasks with " / "
        a(@click="scrollToIndex(3)")
          small 3. Edit title and duration
        a(@click="scrollToIndex(4)")
          small 4. Context
        a(@click="scrollToIndex(5)")
          small 5. Views
        a(@click="scrollToIndex(6)")
          small 6. Authentication
        a(@click="scrollToIndex(7)")
          small 7. Sidebar
        a(@click="scrollToIndex(8)")
          small 8. Money, currency and language
        a(@click="scrollToIndex(9)")
          small 9. Report!

      h3(ref="index-1") 1. Quick start task
      p &mdash; <strong>Click</strong> on button with numbers will start timer. If no task title provided, it will be generated.
      p
        img(src="static/img/help-001.png")
      p &mdash; <strong>Enter</strong> inside task title input field will start or stop timer. If there is no title, it will be generate.
      p
        img(src="static/img/help-002.png")
      p &mdash; <strong>Click</strong> on task will continue it. You may not stop timer, it will switch automatically.
      p
        img(src="static/img/help-003.png")
      p &mdash; <strong>Click on parent</strong> task will create new sub-task and start it. Timer may be running, it will switch automatically.
      p
        img(src="static/img/help-004.png")

      h3(ref="index-2") 2. Subtasks with " / "
      p You can create sub-tasks if you divide task name with " / " (slash with space before and after). Check <a v-on:click="scrollToIndex(4)">4. Context</a> for more on subtasks.
      p
        img(src="static/img/help-005.png")

      h3(ref="index-3") 3. Edit title and duration
      p You can edit task title during timer running inside task title input, or later:
      p &mdash; <strong>Long click</strong> on task
      p
        img(src="static/img/help-006.png")
      p &mdash; <strong>Hover</strong> over task, edit menu will appear, use 'edit' icon.
      p
        img(src="static/img/help-007.png")
      p &mdash; <strong>Duration</strong> may be edited near task title. Format is "45m" for 45 mins, "2h" for 2 hours and "2h 47m" for 2 hours 47 mins.
      p
        img(src="static/img/help-018.png")

      h3(ref="index-4") 4. Context
      p At some point you will end up with long subtasks, which are disturbing to view all the time. You can set up "context". It is like entering a folder on file disk. Everything in timer will now deal only with this task/context contents. Set up task context (enter "folder") is "folder" icon in action menu on task hover.
      p
        img(src="static/img/help-008.png")
      p
        img(src="static/img/help-009.png")

      h3(ref="index-5") 5. Views
      p There are multiple views - tasks, years, months, days, history. It is various grouping of the same timer records.
      p
        img(src="static/img/help-010.png")
      p <strong>Record</strong> consists of date start, date end and task details (title). Duration is counter automatically. So there is long list of such records, which is stored in database internally. This low-level view is <strong>History</strong>.
      p
        img(src="static/img/help-011.png")
      p Other views group records by title and date. So you can check what was done for task as a whole, during month, or during a day.


      h3(ref="index-6") 6. Authentication
      p It is recommended to authenticate through social accounts, so you data will persist on remote server and will be accessible on different machines. But you can work without auth also - then data will persist on you browser only (saved between refresh).
      p
        img(src="static/img/help-012.png")

      h3(ref="index-7") 7. Sidebar
      p Sidebar holds various UI settings, data import/export. You can close it by clicking on upper part of sidebar (image). You can hide some of UI parts if you want minimal disturbance.
      p
        img(src="static/img/help-017.png")

      h3(ref="index-8") 8. Money, currency and language
      p Yes, of course you can see how much money you earned. Currency can be rubles, USD, EUR, chineese yuan. Select currrency in sidebar, set your hour price in left upper area under timer. Also you can switch to Russian.
      p
        img(src="static/img/help-014.png")
      p
        img(src="static/img/help-015.png")

      h3(ref="index-9") 9. Report!
      p You can create it with current timer records. Use <a v-on:click="scrollToIndex(4)">4. Context</a> to limit report to only one task. Possible formats are Excel, Markdown and plain text. Complexity of report can be altered. Click on zigzag icon after 'History' view. Report icon can be disabled in sidebar, if you don't use it.
      p
        img(src="static/img/help-013.png")
      p
        img(src="static/img/help-016.png")
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    computed: {
      ...mapGetters([
        'locale'
      ])
    },
    methods: {
      scrollToIndex (index) {
        console.log('scroll', this.$refs[`index-${index}`])
        this.$refs[`index-${index}`].scrollIntoView({
          behavior: 'smooth'
        })
      },
      ...mapActions([
        'closeModal'
      ])
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/modal'

  .modal.help
    max-width 640px
    box-shadow 1px 3px 10px 0px alpha(titamota-color-text, 10%)
    text-align left

    a
      text-decoration underline

    h3
      margin-top 40px

    p img
      width 100%

    .index
      a
        display block
</style>
