<template lang="pug">
  .group-item(
    :depth="depth"
    :class="{ 'has-children': hasChildren }")
    .item.edit(
      :class="{ 'active': isTrackingEntry }"
      v-if="isEditingTask && editingTaskUid === entry.uid()"
      @keyup.esc="stopTaskEditing()"
      v-esc-outside="stopTaskEditing"
      v-click-outside="stopTaskEditing")
      span.name
        span.non-editable(v-if="entry.type !== 'task' || isTrackingEntry")
          item-name(:entry="entry")
        list-input(
          v-else
          :focus="editingFocus === 'details'"
          :value="edit.details"
          @input-original-event="updateDetails($event)"
          :on-submit="submitTask")
      span.duration
        span.non-editable(
          v-if="isTrackingEntry") {{ duration }}
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
          @click="stopTaskEditing()")
          i.material-icons block

    .item.read(
      v-else
      :class="{ 'active': isTrackingEntry }")
      span.name(
        :color="colorCode"
        @wheel="setEntryAsContext($event)")
        span(
          v-if="entry.type === 'task'"
          v-long-click="500"
          @long-click="startEdit('details')"
          @normal-click="startTask()")
          item-name(:entry="entry")
        span(
          v-else
          v-long-click="500"
          @long-click="startEdit('details')")
          item-name(:entry="entry")
      span.duration(
        v-long-click="500"
        @long-click="startEdit('duration')") {{ duration }}
      span.cost(
        v-if="price") {{ cost }}
      //- span.actions
      //-   //- a.icon-button.filter
      //-   //-   i.material-icons filter_list
      //-   a.icon-button.delete(@click="removeTask()")
      //-     i.material-icons delete
      //-   span.icon-button.select(v-if="entry.type === 'task'")
      //-     input(
      //-       type="checkbox")

    group-item(
      v-if="child.type"
      v-for="child in entry.children"
      :key="child.name"
      :entry="child")
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { durationHuman, durationEditable } from '@/utils/duration'
  import moment from 'moment'
  import { extractEntries, parentOfDifferentType } from '@/utils/group'
  import { translate } from '@/store/i18n'
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'
  import listInput from '@/components/list-input'
  import itemName from '@/components/item-name'
  import bus from '@/event-bus'
  import Entry from '@/models/entry'
  import Group from '@/models/group'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'
  import capitalize from 'lodash/capitalize'
  // import cloneDeep from 'lodash/cloneDeep'
  import debounce from '@/utils/debounce'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  export default {
    props: [
      'entry'
    ],

    data () {
      return {
        edit: {
          details: null,
          duration: null
        },
        debounceWheel: debounce()
      }
    },

    // Nested component hack
    beforeCreate () {
      this.$options.components.groupItem = require('./group-item.vue')
    },

    computed: {
      // name () {
      //   return itemName[this.entry.type](this.entry, this.locale)
      // },
      duration () {
        const d = translate[this.locale].duration
        return durationHuman(
          this.entry.duration(), d.hr, d.min, d.sec)
      },
      colorCode () {
        if (this.entry.type === 'month' || this.entry.type === 'day') {
          return new Date(this.entry.start).getMonth()
        }
      },
      cost () {
        const c = parseInt(
          this.entry.duration() * this.price / 3600000, 10)
        let part = '' + c
        let result = ''
        while (part.length) {
          result = ' ' + part.substr(-3) + result
          part = part.slice(0, -3)
        }
        return result.trim()
      },
      depth () {
        return this.entry.path().length - 1
      },
      hasChildren () {
        return this.entry.children[0] instanceof Group
      },
      activeEntry () {
        let child = this.entry
        while (child.children && child.children.length) {
          child = child.children[0]
        }
        return child
      },
      isTrackingEntry () {
        return this.timerActive &&
          this.activeEntry.uid() === this.timerEntry.uid()
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
      ...mapGetters([
        'locale',
        'price',
        'timerActive',
        'timerEntry',
        'isEditingTask',
        'editingTaskUid',
        'editingTaskFields',
        'editingFocus'
      ])
    },

    methods: {
      startTask () {
        let details = this.entry.details()
        if (this.entry.children[0] instanceof Group) {
          details = details.concat(funnyTask(this.locale))
        }
        bus.$emit('start-task', {
          entry: new Entry({
            start: new Date().getTime(),
            stop: new Date().getTime(),
            details
          })
        })
      },
      clearEdit () {
        this.edit.details = null
        this.edit.duration = null
      },
      startEdit (field) {
        console.log(field)
        this.clearEdit()
        this.stopTaskEditing()
        let payload = {
          focus: field,
          edit: {},
          uid: this.entry.uid()
        }
        if (this.entry.type === 'task') {
          payload.edit.details = this.entry.details()
          this.edit.details = payload.edit.details.join(' / ')
        }
        payload.edit.duration = this.entry.duration()
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
        const entries = extractEntries(this.entry)
        const update = {}
        if (this.edit.details !== null) {
          update.details = {
            source: this.editingTaskFields.details,
            target: this.edit.details.split('/').map(d => d.trim())
          }
        }
        if (this.edit.duration !== null) {
          const dOld = this.entry.duration()
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
          entries: extractEntries(this.entry)
        })
      },
      filterTask () {
        let filter = []
        // let parent = this.entry.parent
        if (this.entry.type === 'task') {
          filter = this.entry.details()
            .concat(filter)
        } else if (this.entry.type === 'month') {
          filter = [moment(this.entry.start).format('MM.YYYY')]
            .concat(filter)
        } else if (this.entry.type === 'day') {
          filter = [moment(this.entry.start).format('DD.MM.YYYY')]
            .concat(filter)
        }
        if (this.entry.type === 'task') {
          const parent = parentOfDifferentType(this.entry.type)
          if (parent.type === 'month') {
            filter = [moment(parent.start).format('MM.YYYY')]
              .concat(filter)
          }
          if (parent.type === 'day') {
            filter = [moment(parent.start).format('DD.MM.YYYY')]
              .concat(filter)
          }
        }
        bus.$emit('filter-entries', {
          filter
        })
      },
      setEntryAsContext (event) {
        event.preventDefault()
        this.debounceWheel(() => {
          this.setContext({ context: this.entry })
        }, 200)
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
      itemName
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
      .duration
        color titamota-color-red

    .item.read
      display flex
      .actions
        display none
      .actions
        display flex
        position absolute
        right 0px
        top 0px
        padding-top 4px
        padding-bottom 4px

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
