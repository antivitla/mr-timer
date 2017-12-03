<template lang="pug">
  .group-item(
    :depth="depth"
    :class="{ 'has-children': hasChildren }")

    //- Edit

    .item.edit(
      v-if="isEditingTask && editingTaskId === group.id"
      :class="{ 'active': trackingEntry }"
      @keyup.esc="stopTaskEditing()"
      v-click-outside="stopTaskEditing"
      v-esc-outside="stopTaskEditing")
      .name(:class="{ 'non-editable': group.type !== 'task' }")
        group-name(
          v-if="group.type !== 'task'"
          :group="group")
        list-input(
          v-else
          :focus="editingFocus === 'details'"
          :value="edit.details"
          @input="updateDetails($event)"
          :on-submit="submitEdit")
      .duration
        .non-editable(v-if="trackingEntry") {{ duration }}
        input(
          v-else
          type="text"
          v-focus-and-select-all="editingFocus === 'duration'"
          :value="edit.duration"
          @input="updateDuration($event)"
          @keyup.enter="submitEdit()")
      .actions
        a.icon-button.delete(
          v-if="!trackingEntry"
          :title="label('delete')"
          @click.stop.prevent="removeTask()")
          i.material-icons delete
        a.icon-button.cancel(
          :title="label('cancel')"
          @click.stop.prevent="stopTaskEditing()")
          i.material-icons block
        a.icon-button.filter(
          :title="label('filterByThis')"
          @click.stop.prevent="filterTask()")
          i.material-icons search

    //- Read

    .item.read(
      v-else
      v-long-click="375"
      @long-click="startEdit('details')"
      :class="{ 'active': trackingEntry }")
      .title(
        :title="startTaskLabel"
        @click="startTask()")
        i.material-icons.timer-clock(v-if="trackingEntry") timer
        .name(
          v-if="group.type === 'task'"
          :color="colorCode"
          v-long-click="375"
          @long-click.prevent.stop="startEdit('details')")
          group-name(:group="group")
        .name(
          v-else
          :color="colorCode"
          v-long-click="375"
          @long-click.prevent.stop="startEdit('details')")
          group-name(:group="group")
        .duration(
          v-if="duration"
          v-long-click="375"
          @long-click.prevent.stop="startEdit('duration')") {{ duration }}
        .cost(v-if="price") {{ cost }}
      .actions
        //- a.icon-button.start-task(
        //-   @click.stop.prevent="startTask()"
        //-   :title="startTaskLabel"
        //-   v-if="isTask")
        //-   i.material-icons timer
        a.icon-button.external-link(
          @click.stop.prevent="gotoHref(taskHref)"
          :href="taskHref"
          :title="externalLinkLabel"
          v-if="isTaskWithLink")
          i.material-icons launch
        a.icon-button.context(
          @click.stop.prevent="setGroupAsContext()"
          :title="label('context.setAsCurrentTask')"
          v-if="isContextable")
          //- i.fa.fa-thumb-tack
          i.material-icons folder_open
        a.icon-button.start-edit(
          @click.stop.prevent="startEdit('details')"
          :title="label('startEdit')")
          i.material-icons mode_edit
        a.icon-button.filter(
          :title="label('filterByThis')"
          @click.stop.prevent="filterTask()")
          i.material-icons search

    group-item(
      v-for="child in filterGroupChildren(group.children)"
      :key="child.name"
      :group="child")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import moment from 'moment'

  // Directives
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'

  // Components
  import listInput from '@/components/other/list-input'
  import groupName from '@/components/items/group-name'

  // Other
  import bus from '@/event-bus'
  import Entry from '@/models/entry'
  import Group from '@/models/group'

  // Utils
  import { durationHuman, durationEditable } from '@/utils/duration'
  import numberFilter from '@/utils/number-filter'
  import {
    extractEntries,
    parentOfDifferentType,
    filterGroupChildren,
    rootDetails
  } from '@/utils/group'
  import { taskDelimiter } from '@/store/ui'
  import i18nLabel from '@/mixins/i18n-label'
  import storage from '@/mixins/storage'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  const urlRegexp = /((https?):\/\/.*?(\s|$))/

  export default {
    name: 'group-item',
    props: ['group'],
    data () {
      return {
        edit: {
          details: null,
          duration: null
        },
        filterGroupChildren
      }
    },
    // Nested component hack
    beforeCreate () {
      this.$options.components.groupItem = require('./group-item.vue')
    },
    computed: {
      duration () {
        const d = this.label('duration', false)
        const trackingEntry = this.trackingEntry
        if (trackingEntry && trackingEntry.duration() < this.timerEntry.duration()) {
          const duration = this.group.duration() - trackingEntry.duration() + this.timerEntry.duration()
          return durationHuman(duration, d.hr, d.min, d.sec)
        } else {
          return durationHuman(this.group.duration(), d.hr, d.min, d.sec)
        }
      },
      colorCode () {
        if (this.group.type === 'month' || this.group.type === 'day') {
          return new Date(this.group.start).getMonth()
        }
      },
      cost () {
        return numberFilter(parseInt(this.group.duration() * this.price / 3600000, 10))
      },
      depth () {
        return this.group.path().length - 1
      },
      hasChildren () {
        return this.group.children.some(item => item instanceof Group)
      },
      getStorageEntry () {
        let child = this.group
        while (child.children && child.children.length) {
          child = child.children[0]
        }
        return child
      },
      trackingEntry () {
        if (this.timerActive) {
          return this.group.children
            .find(entry => {
              const isEntry = entry instanceof Entry
              const isTracking = entry.id === this.timerEntry.id
              return isEntry && isTracking && entry
            })
        }
      },
      taskHref () {
        const href = this.group.name.match(urlRegexp)
        return href ? href[0] : undefined
      },
      isContextable () {
        return this.group.children[0] instanceof Group && this.group.type === 'task'
      },
      isTask () {
        return this.group.type === 'task'
      },
      isTaskWithLink () {
        return this.group.type === 'task' &&
          this.group.name.match(urlRegexp)
      },
      externalLinkLabel () {
        const href = this.group.name.match(urlRegexp) ? this.group.name.match(urlRegexp)[0] : ''
        return this.label('externalLink') +
          ' ' + decodeURIComponent(href)
      },
      startTaskLabel () {
        return this.label('startTask') +
          ' «' + decodeURIComponent(this.group.name) + '»'
      },
      ...mapGetters([
        'locale',
        'price',
        'timerActive',
        'timerEntry',
        'isEditingTask',
        'editingTaskId',
        'editingTaskFields',
        'editingFocus'
      ])
    },
    methods: {
      startTask () {
        // Не стартовать, если мы не являемся задачей,
        // например даты
        if (this.group.type !== 'task') {
          return
        }
        // Если мы уже в режиме редактирования,
        // ничего не делать
        if (this.isEditingTask) {
          return
        }
        // Если мы пытаемся запустить уже запущенную задачу,
        // остановить её
        if (this.timerActive) {
          const timerDetails = this.timerEntry.details.join()
          const groupDetails = this.group.details().join()
          if (timerDetails === groupDetails) {
            this.stopTimer()
            return
          }
        }
        // В остальном - стартуем новую задачу,
        // причем сразу с рандомной подзадачей,
        // если кликуемая задача уже имеет подзадачи
        let details = this.group.details()
        if (this.group.children[0] instanceof Group) {
          details = details.concat(funnyTask(this.locale))
        }
        this.startTimer({
          entry: new Entry({
            start: new Date(),
            stop: new Date(),
            details
          })
        })
        // Мотаем чтоб увидеть старт таймера
        bus.$emit('scroll-top')
      },
      clearEdit () {
        this.edit.details = null
        this.edit.duration = null
      },
      startEdit (field) {
        this.clearEdit()
        this.stopTaskEditing()
        let payload = {
          focus: field,
          edit: {},
          id: this.group.id
        }
        if (this.group.type === 'task') {
          payload.edit.details = this.group.details()
          this.edit.details = payload.edit.details
            .join(taskDelimiter)
        }
        payload.edit.duration = this.group.duration()
        this.edit.duration = durationEditable
          .stringify(payload.edit.duration)
        this.startTaskEditing(payload)
      },
      updateDetails (event) {
        this.edit.details = event.join(taskDelimiter)
      },
      updateDuration (event) {
        this.edit.duration = event.target.value
      },
      submitEdit () {
        // Выдираем все соотв. записи
        const entries = extractEntries(this.group)
        // Собираем изменения
        const update = {}
        if (this.edit.details) {
          const source = this.editingTaskFields.details
          const target = this.edit.details
              .split(taskDelimiter)
              .filter(i => i)
              .map(d => d.trim())
              .filter(i => i)
          update.details = { source, target }
        }
        if (this.edit.duration) {
          const dOld = this.group.duration()
          const dNew = durationEditable
            .parse(this.edit.duration)
          const add = (dNew + entries.length - dOld) / entries.length
          update.stop = { add }
        }
        // Применяем изменения
        const updatedEntries = entries.map(entry => {
          let details = entry.details.slice(0)
          let stop = entry.stop
          if (update.details) {
            let source = update.details.source.join(taskDelimiter)
            let target = update.details.target.join(taskDelimiter)
            details = entry.details
              .join(taskDelimiter)
              .replace(source, target)
              .split(taskDelimiter)
              .filter(d => d)
              .map(d => d.trim())
              .filter(d => d)
          }
          if (update.stop && update.stop.add) {
            stop = entry.stop + update.stop.add
          }
          return new Entry({
            id: entry.id,
            start: entry.start,
            stop,
            details
          })
        })
        // Только теперь можно очистить редактирование
        this.stopTaskEditing()
        // Изменяем
        this.patchEntries({
          remove: entries,
          add: updatedEntries
        })
      },
      removeTask () {
        this.stopTaskEditing()
        const entries = extractEntries(this.group)
        this.deleteAndGetEntries({ entries })
      },
      filterTask () {
        let filter = []
        if (this.group.type === 'task') {
          filter = this.group.details()
            .concat(filter)
        } else if (this.group.type === 'year') {
          filter = [moment(this.group.start).format('YYYY')]
            .concat(filter)
        } else if (this.group.type === 'month') {
          filter = [moment(this.group.start).format('MM.YYYY')]
            .concat(filter)
        } else if (this.group.type === 'day') {
          filter = [moment(this.group.start).format('DD.MM.YYYY')]
            .concat(filter)
        }
        if (this.group.type === 'task') {
          const parent = parentOfDifferentType(this.group)
          if (parent && parent.type === 'year') {
            filter = [moment(parent.start).format('YYYY')]
              .concat(filter)
          }
          if (parent && parent.type === 'month') {
            filter = [moment(parent.start).format('MM.YYYY')]
              .concat(filter)
          }
          if (parent && parent.type === 'day') {
            filter = [moment(parent.start).format('DD.MM.YYYY')]
              .concat(filter)
          }
        }
        this.setCurrentView({ view: 'storage' })
        this.setFilter({ filter })
      },
      setGroupAsContext () {
        this.updatePagination({
          group: this.currentView,
          offset: 0
        })
        this.appendContext({ context: rootDetails(this.group) })
        this.getEntriesWithCurrentParams()
        bus.$emit('scroll-top')
      },
      gotoHref (href) {
        window.open(href, '_blank')
      },
      ...mapMutations([
        'startTaskEditing',
        'stopTaskEditing',
        'setCurrentView',
        'updatePagination',
        'appendContext',
        'setFilter'
      ]),
      ...mapActions([
        'changeCurrentViewOffset',
        'startTimer',
        'stopTimer',
        'patchEntries'
      ])
    },
    mixins: [
      i18nLabel,
      storage
    ],
    directives: {
      longClick,
      clickOutside,
      escOutside,
      focusAndSelectAll
    },
    components: {
      listInput,
      groupName
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  // Normal screens
  .group-item

    // Nested shift
    .group-item
      margin-left 20px

    // Layout Read
    & > .item.read
      display flex
      align-items flex-start
      justify-content space-between
      margin-top 5px
      margin-bottom 5px
      padding-top 4px
      padding-bottom 4px
      font-size 14px
      line-height 20px
      .title
        display flex
        box-sizing border-box
        padding-right 20px
        .name
          box-sizing border-box
          padding-right 0.5em
      .actions
        display flex

    // Show actions Read
    & > .item.read
      .actions
        visibility hidden
      &:hover
        background-color titamota-color-back-light-darker
        .actions
          visibility visible

    // layout Edit
    & > .item.edit
      display flex
      align-items flex-start
      margin-top 5px
      margin-bottom 5px
      font-size 14px
      line-height 20px
      .name
        margin-left -8px
        &.non-editable
          padding-left 8px
          padding-right 8px
          padding-top 4px
          padding-bottom 4px
          box-sizing border-box
        textarea
          display block
          box-sizing border-box
          resize none
          width 100%
          padding 4px 8px
          border-radius 5px
          border 0px
          line-height inherit
          font-size inherit
          background-color white
      .duration
        width 6.5em
        padding-left 0.75em
        input
          display block
          width 100%
          box-sizing border-box
          border-radius 5px
          border 0px
          text-align center
          padding 4px 8px
          line-height inherit
          font-size inherit
          font-family 'PT Sans', monospace
          background-color white
      .actions
        display flex
        padding-top 4px
        padding-bottom 4px
        margin-left auto
        margin-right 0px

  // Colors and other simple stylings
  .group-item
    .item.read .title
      cursor pointer
    .item.edit textarea:focus
    .item.edit input:focus
      background-color titamota-color-back-dark
      color titamota-color-text-invert-highlight
    .item.edit .name
      width calc(100% - 15em)
    .item.read .duration
      color titamota-color-text-muted
      white-space nowrap
      padding-right 0.375em
    .item.edit .duration .non-editable
      padding-top 4px
      padding-bottom 4px
      padding-left 8px
    .item.read .actions a[href]
      color titamota-color-text
      text-decoration none
    .item.read .actions .icon-button
    .item.edit .actions .icon-button
      padding-left 5px
    .item.read .cost
      color titamota-color-text
      position relative
      padding-left 1em
      white-space nowrap
      &:after
        content '='
        position absolute
        display block
        left 0px
        top 0px

  // Active item
  .group-item
    .item.active
      color titamota-color-text
      font-weight 500
      .duration
      .cost
        color titamota-color-text
        font-weight 500
      .title
        position relative
        .timer-clock
          position absolute
          left -28px
          font-size 24px
          top -2px
          width 24px
          height 24px
          & + .name
            margin-left 0px
          &:before
            content ' '
            position absolute
            left 12px
            top 11px
            transform translateX(-50%) translateY(-50%)
            border-radius 50%
            width 10px
            height 10px
            background-color titamota-color-back-light
            z-index 1
          &:after
            content ' '
            width 2px
            height 6px
            background-color titamota-color-text
            position absolute
            transform-origin 50% 80%
            left 11px
            top 6px
            z-index 2
            animation tick 12s steps(12, end) infinite
  .group-item[depth="2"] > .item.read
  .group-item[depth="1"]:not(.has-children) > .item.read
    .timer-clock
      &:before
        top 13px
      &:after
        top 8px
  .group-item[depth="1"].has-children > .item.read
    .timer-clock
      top 0px
      left -30px
      &:before
        top 22px
      &:after
        top 17px


  // Depth === 1 with children
  .group-item[depth="1"].has-children
    margin-top 40px
    margin-bottom 40px
    &:first-child
      margin-top 0px
    &:last-child
      margin-bottom 0px
    & > .item.read
      font-size 32px
      line-height 42px
      font-weight 400
    & > .item.edit
      font-size 32px
      line-height 42px
      font-weight 400
      .duration
        width 5.5em
      .name
        width calc(100% - 9.625em)
        textarea
          font-weight 400

  // Depth === 1 with link
  .group-item[depth="1"].has-children > .item.read .with-link
    padding-bottom 42px

  // Depth === 1 without children equals depth 2
  .group-item[depth="1"]:not(.has-children)
  .group-item[depth="2"]
    & > .item.read
      font-size 18px
      line-height 24px
    & > .item.edit
      font-size 18px
      line-height 24px
      .name
        width calc(100% - 13.25em)

  // Depth === 2 and Depth === 1 without children with link
  .group-item[depth="1"]:not(.has-children)
  .group-item[depth="2"]
    & > .item.read .with-link
      padding-bottom 26px

  // Time-based views fixes
  .view.days
  .view.months
  .view.years
    [depth="1"] > .item
      .name
      .duration
      .cost
        font-weight 300
      .duration
        color titamota-color-text-muted
      .name
        opacity 0.625
    [depth="2"].has-children > .item
      .name
      .duration
      .cost
        font-weight 500

  // Currency reference
  [currency="rub"]
    .group-item .item.read .cost:before
        content '₽'
  [currency="usd"]
    .group-item .item.read .cost:before
      content '$'
  [currency="eur"]
    .group-item .item.read .cost:before
      content '€'
  [currency="cny"]
    .group-item .item.read .cost:before
      content '¥'
  [is-currency-symbol-before="true"]
    .group-item .item.read .cost:before
      margin-right 0.2em
  [currency]:not([is-currency-symbol-before])
    .group-item .item.read .cost
      padding-right 0.875em
      &:before
        position absolute
        right 0px
        top 0px
        margin-right 0px

  // Small screens
  @media (max-width titamota-screen-w-7)
    .group-item

      // Layout read
      & > .item.read
        .title
          flex-wrap wrap
          .name
            width 100%

      // Show actions read
      & > .item.read
        .actions
          visibility visible
          .filter
          .start-edit
            display none

      // Layout edit
      & > .item.edit
        flex-direction column
        position relative
        .name
          width calc(100% + 8px)
        .duration
          padding-left 0px
          margin-top 5px
          margin-left -8px
          input
            text-align left
        .actions
          position absolute
          bottom 0px
          right 0px

    // Depth === 1 with children
    .group-item[depth="1"].has-children
      & > .item.edit
        .name
          width calc(100% + 8px)
        .duration
          margin-top 10px

    // Depth === 2 && Depth === 1 without children
    .group-item[depth="1"]:not(.has-children)
    .group-item[depth="2"]
      & > .item.edit
        .name
          width calc(100% + 8px)
        .duration
          margin-top 7px
</style>
