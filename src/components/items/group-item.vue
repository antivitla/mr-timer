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
      span.name
        span.non-editable(v-if="group.type !== 'task'")
          group-name(:group="group")
        list-input(
          v-else
          :focus="editingFocus === 'details'"
          :value="edit.details"
          @input-original-event="updateDetails($event)"
          :on-submit="submitEdit")
      span.duration
        span.non-editable(v-if="trackingEntry") {{ duration }}
        input(
          v-else
          type="text"
          v-focus-and-select-all="editingFocus === 'duration'"
          :value="edit.duration"
          @input="updateDuration($event)"
          @keyup.enter="submitEdit()")
      span.actions
        a.icon-button.filter(
          :title="label('filterByThis')"
          @click.stop.prevent="filterTask()")
          i.material-icons search
        a.icon-button.delete(
          v-if="!trackingEntry"
          :title="label('delete')"
          @click.stop.prevent="removeTask()")
          i.material-icons delete
        a.icon-button.cancel(
          :title="label('cancel')"
          @click.stop.prevent="stopTaskEditing()")
          i.material-icons block

    //- Read

    .item.read(
      v-else
      :class="{ 'active': trackingEntry }"
      :title="startTaskLabel"
      @click="startTask()")
      span.name(
        :color="colorCode")
        span(
          v-if="group.type === 'task'"
          v-long-click="500"
          @long-click="startEdit('details')")
          group-name(:group="group")
        span(
          v-else
          v-long-click="500"
          @long-click="startEdit('details')")
          group-name(:group="group")
      span.duration(
        v-long-click="500"
        @long-click="startEdit('duration')") {{ duration }}
      span.cost(
        v-if="price") {{ cost }}
      span.actions
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
          i.material-icons flag
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
  import {
    extractEntries,
    parentOfDifferentType,
    filterGroupChildren,
    rootDetails
  } from '@/utils/group'
  import { taskDelimiter } from '@/store/ui'
  import i18nLabel from '@/mixins/i18n-label'
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
        const c = parseInt(
          this.group.duration() * this.price / 3600000, 10)
        let part = '' + c
        let result = ''
        while (part.length) {
          result = ' ' + part.substr(-3) + result
          part = part.slice(0, -3)
        }
        return result.trim()
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
        // ничего не делать
        if (this.timerActive) {
          const timerDetails = this.timerEntry.details.join()
          const groupDetails = this.group.details().join()
          if (timerDetails === groupDetails) {
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
        this.startTimerAndGetEntries({
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
        this.edit.details = event.target.value
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
              .replace(new RegExp('^' + source), target)
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
        this.changeCurrentViewOffset({ offset: 0 })
        this.appendContext({ context: rootDetails(this.group) })
        this.getEntries()
        bus.$emit('scroll-top')
      },
      gotoHref (href) {
        window.open(href, '_blank')
      },
      ...mapMutations([
        'startTaskEditing',
        'stopTaskEditing',
        'setCurrentView',
        'appendContext',
        'setFilter'
      ]),
      ...mapActions([
        'changeCurrentViewOffset',
        'startTimerAndGetEntries',
        'deleteAndGetEntries',
        'patchEntries',
        'getEntries'
      ])
    },
    mixins: [
      i18nLabel
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

  .group-item
    & > .item
      margin 6px auto
      padding-top 4px
      padding-bottom 4px
      font-size 18px
      line-height 24px
    .group-item
      margin-left 20px
      .group-item
        & > .item
          margin 5px auto
          font-size 14px
          line-height 20px

    .item
      display flex
      flex-wrap wrap
      align-items baseline

    .name
      margin-right 0.5em
      width 100%
      cursor pointer

    .cost
      font-size 80%
      color titamota-color-text
      margin-left 0.375em
      position relative
      padding-left 1em
      display inline-block
      white-space nowrap
      &:after
        content '='
        margin-right 0.375
        position absolute
        display block
        color titamota-color-text-muted
        left 0px
        top 0px
      &:before
        float right
        margin-left 0.25em

    .duration
      font-size 80%
      color titamota-color-text-muted
      display inline-block
      cursor pointer

    @media (min-width 768px)
      .name
        width auto
      .duration
      .cost
        font-size 100%
        line-height 1

    .item.edit
      display flex
      align-items flex-start
      flex-direction column
      position relative
      padding-top 0px
      padding-bottom 0px
      .name
        width calc(100% + 8px)
        margin 0 0 0.5em -8px
        .non-editable
          padding-top 4px
          padding-bottom 4px
          padding-left 8px
          padding-right 8px
          display block
          box-sizing box-sizing
        textarea
          width 100%
          font-size inherit
          border none
          padding 4px 8px
          margin 0px
          position relative
          box-sizing border-box
          resize none
          border-radius 5px
          line-height inherit
          display block
          background-color white
          color titamota-color-text
          &:focus
            background-color titamota-color-back-dark
            color titamota-color-text-invert-highlight
      .duration
        width 6.5em
        margin 0 0 0 -8px
        line-height inherit
        font-size inherit
        .non-editable
          padding-top 4px
          padding-bottom 4px
          padding-left 8px
          padding-right 8px
          display block
          box-sizing box-sizing
        textarea
        input
          text-align left
          display block
          width 100%
          font-size inherit
          font-family PT Mono, monospace
          box-sizing border-box
          padding 4px 8px
          margin 0
          border none
          line-height inherit
          border-radius 5px
          resize none
          background-color white
          color titamota-color-text
          &:focus
            background-color titamota-color-back-dark
            color titamota-color-text-invert-highlight
      .actions
        display flex
        padding 4px
        justify-content flex-end
        position absolute
        right 0px
        bottom 0px

      @media (min-width 768px)
        flex-direction row
        .name
          width calc(100% - 15em)
          margin 0 0 0 -8px
        .duration
          margin-left 0.5em
          input
            text-align center
        .actions
          margin-left auto
          position static

    .icon-button
      font-size 140%
      cursor pointer
      input[type="checkbox"]
        margin-left 0.2em
    .icon-button + .icon-button
      margin-left 7px

    .item.active
      color titamota-color-red
      font-weight 500
      .duration
        color titamota-color-red
        font-weight 400

    .item.read
      display flex
      cursor pointer
      position relative
      .actions
        position absolute
        right 0px
        top 0px
        padding 4px
        display none
        a[href]
          color titamota-color-text
          text-decoration none
      &:hover
        background-color titamota-color-back-light-darker
        .actions
          display flex
          align-self center
          margin-left auto


  // Root items
  .group-item[depth="1"].has-children
    margin-bottom 40px
    margin-top 40px
    &:first-child
      margin-top 0px
    & > .item
      font-size 32px
      line-height 42px
      font-weight 400
      .duration
      .cost
        font-size 80%
      &.edit
        .name
          textarea
            font-weight 400

  @media (min-width 768px)
    .group-item[depth="2"] > .item.edit
      .name
        width calc(100% - 13.25em)

    .group-item[depth="1"].has-children > .item.edit
      .name
        width calc(100% - 9em)
        textarea
          font-weight 400

    .group-item[depth="1"]:not(.has-children) > .item.edit
      .name
        width calc(100% - 13.25em)
        textarea
          font-weight 400

  [currency="rub"]
    .cost:before
      content '₽'
  [currency="usd"]
    .cost:before
      content '$'
  [currency="eur"]
    .cost:before
      content '€'
  [currency="cny"]
    .cost:before
      content '¥'
  [is-currency-symbol-before="true"]
    .cost:before
      float none
      margin-right 0.25em
      margin-left 0em
</style>
