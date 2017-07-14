<template lang="pug">
  .group-item(
    :depth="depth"
    :class="{ 'has-children': hasChildren }")
    .item.edit(
      :class="{ 'active': trackingEntry }"
      v-if="isEditingTask && editingTaskUid === group.uid()"
      @keyup.esc="stopTaskEditing()"
      v-esc-outside="stopTaskEditing")
      span.name
        span.non-editable(v-if="group.type !== 'task'")
          group-name(:group="group")
        list-input(
          v-else
          :focus="editingFocus === 'details'"
          :value="edit.details"
          @input-original-event="updateDetails($event)"
          :on-submit="submitTask")
      span.duration
        span.non-editable(
          v-if="trackingEntry") {{ duration }}
        input(
          v-else
          type="text"
          v-focus-and-select-all="editingFocus === 'duration'"
          :value="edit.duration"
          @input="updateDuration($event)"
          @keyup.enter="submitTask()")
      span.actions
        a.icon-button.filter(
          :title="filterByThisLabel"
          @click="filterTask()")
          i.material-icons search
        a.icon-button.delete(
          :title="deleteLabel"
          @click="removeTask()")
          i.material-icons delete
        a.icon-button.cancel(
          :title="cancelLabel"
          @click.stop.prevent="stopTaskEditing()")
          i.material-icons block

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

      span.hover-actions
        //- a.icon-button.start-task(
        //-   @click.stop.prevent="startTask()"
        //-   :title="startTaskLabel"
        //-   v-if="isTask")
        //-   i.material-icons timer
        a.icon-button.start-edit(
          @click.stop.prevent="startEdit('details')"
          :title="startEditLabel")
          i.material-icons mode_edit
        a.icon-button.filter(
          :title="filterByThisLabel"
          @click.stop.prevent="filterTask()")
          i.material-icons search
        a.icon-button.context(
          @click.stop.prevent="setEntryAsContext($event)"
          :title="setContextLabel"
          v-if="isContextable")
          i.material-icons launch

      //- span.actions
      //-   //- a.icon-button.filter
      //-   //-   i.material-icons filter_list
      //-   a.icon-button.delete(@click="removeTask()")
      //-     i.material-icons delete
      //-   span.icon-button.select(v-if="group.type === 'task'")
      //-     input(
      //-       type="checkbox")

    group-item(
      v-if="child.type"
      v-for="child in filterGroupChildren(group.children)"
      :key="child.name"
      :group="child")
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { durationHuman, durationEditable } from '@/utils/duration'
  import moment from 'moment'
  import {
    extractEntries,
    parentOfDifferentType,
    filterGroupChildren,
    wrapContextDetails } from '@/utils/group'
  import { translate } from '@/store/i18n'
  import { taskDelimiter } from '@/store/ui'
  import { Storage } from '@/store/storage'
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'
  import listInput from '@/components/list-input'
  import groupName from '@/components/group-name'
  import bus from '@/event-bus'
  import Entry from '@/models/entry'
  import Group from '@/models/group'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'
  import capitalize from 'lodash/capitalize'
  import debounce from '@/utils/debounce'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  export default {
    props: [
      'group'
    ],

    data () {
      return {
        edit: {
          details: null,
          duration: null
        },
        debounceWheel: debounce(),
        filterGroupChildren
      }
    },

    // Nested component hack
    beforeCreate () {
      this.$options.components.groupItem = require('./group-item.vue')
    },

    mounted () {
      bus.$on('tick-timer', () => {
        const entry = this.trackingEntry
        if (entry) {
          entry.stop = this.timerEntry.stop
        }
      })
    },

    computed: {
      duration () {
        const d = translate[this.locale].duration
        return durationHuman(
          this.group.duration(), d.hr, d.min, d.sec)
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
        return this.group.children
          .some(item => item instanceof Group)
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
          const entry = this.group.children
            .find(entry => entry instanceof Entry)
          if (entry && entry.uid() === this.timerEntry.uid()) {
            return entry
          }
        }
      },
      isContextable () {
        return this.group.children[0] instanceof Group
      },
      isTask () {
        return this.group.type === 'task'
      },
      filterByThisLabel () {
        return capitalize(translate[this.locale].filterByThisLabel)
      },
      deleteLabel () {
        return capitalize(translate[this.locale].delete)
      },
      cancelLabel () {
        return capitalize(translate[this.locale].cancel)
      },
      startTaskLabel () {
        return capitalize(translate[this.locale].startTask) +
          ' «' + this.group.name + '»'
      },
      startEditLabel () {
        return capitalize(translate[this.locale].startEdit)
      },
      setContextLabel () {
        return capitalize(translate[this.locale].setContext)
      },
      ...mapGetters([
        'locale',
        'price',
        'timerActive',
        'timerEntry',
        'isEditingTask',
        'editingTaskUid',
        'editingTaskFields',
        'editingFocus',
        'taskDelimiter'
      ])
    },

    methods: {
      startTask () {
        if (this.timerActive) {
          const timerDetails = this.timerEntry.details.join()
          const groupDetails = this.group.details().join()
          if (timerDetails === groupDetails) {
            return
          }
        }
        let details = this.group.details()
        if (this.group.children[0] instanceof Group) {
          details = details.concat(funnyTask(this.locale))
        }
        if (Storage.context) {
          details = wrapContextDetails(
            Storage.context, details)
        }
        bus.$emit('start-task', {
          entry: new Entry({
            start: new Date().getTime(),
            stop: new Date().getTime(),
            details: details.slice(0)
          })
        })
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
          uid: this.group.uid()
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
      submitTask () {
        const entries = extractEntries(this.group)
        const update = {}
        if (this.edit.details) {
          let source = this.editingTaskFields.details
          let target = this.edit.details
              .split(taskDelimiter)
              .filter(i => i)
              .map(d => d.trim())
              .filter(i => i)
          if (Storage.context) {
            source = wrapContextDetails(
              Storage.context, source)
            target = wrapContextDetails(
              Storage.context, target)
          }
          update.details = { source, target }
        }
        if (this.edit.duration) {
          const dOld = this.group.duration()
          const dNew = durationEditable
            .parse(this.edit.duration)
          const add = (dNew + entries.length - dOld) / entries.length
          update.stop = { add }
        }
        this.stopTaskEditing()
        this.batchUpdateEntries({ entries, update })
      },
      removeTask () {
        this.stopTaskEditing()
        this.batchRemoveEntries({
          entries: extractEntries(this.group)
        })
      },
      filterTask () {
        let filter = []
        // let parent = this.group.parent
        if (this.group.type === 'task') {
          filter = this.group.details()
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
          if (parent && parent.type === 'month') {
            filter = [moment(parent.start).format('MM.YYYY')]
              .concat(filter)
          }
          if (parent && parent.type === 'day') {
            filter = [moment(parent.start).format('DD.MM.YYYY')]
              .concat(filter)
          }
        }
        bus.$emit('filter-entries', {
          filter
        })
      },
      setEntryAsContext (event) {
        if (this.group.children[0] instanceof Group) {
          event.preventDefault()
          // this.debounceWheel(() => {
          this.setContext({ context: this.group })
          // }, 200)
        }
      },
      ...mapMutations([
        'startTaskEditing',
        'stopTaskEditing'
      ]),
      ...mapActions([
        'batchRemoveEntries',
        'batchUpdateEntries',
        'setContext'
      ])
    },

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
  @import '../assets/stylesheets/variables.styl'

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
        padding-top 4px
        padding 4px
        justify-content flex-end
        width 5.75em
        position absolute
        right 0px
        bottom 0px

      @media (min-width 768px)
        flex-direction row
        .name
          width calc(100% - 12.75em)
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
      margin-left 0.375em

    .item.active
      color titamota-color-red
      font-weight 500
      .duration
        color titamota-color-red
        font-weight 400

    .item.read
      display flex
      cursor pointer
      .actions
        display none
      .actions
        display flex
        position absolute
        right 0px
        top 0px
        padding-top 4px
        padding-bottom 4px
      .hover-actions
        display none
      &:hover
        // box-shadow 0px 1px 0px 0px titamota-color-border
        background-color titamota-color-back-light-darker
        .hover-actions
          display flex
          align-self center
          margin-left auto

  .view > .group-item.has-children > .item
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
      &.edit
        .actions
          width 5.5em
        .name
          width calc(100% - 11.5em)
          textarea
            font-weight 400

  .view > .group-item.has-children
    margin-bottom 40px
    margin-top 40px
    &:first-child
      margin-top 0px

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
