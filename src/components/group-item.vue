<template lang="pug">
  .group-item(:depth="depth")
    span(style="font-size: 10px;")
    .item.edit(
      v-if="isEditingTask && editingTaskUid === entry.uid()"
      @keyup.esc="cancelTaskEditing()"
      v-esc-outside="cancelTaskEditing"
      v-click-outside="cancelTaskEditing")
      span.name(:class="{ 'non-editable': entry.type !== 'task' }")
        list-input(
          v-if="entry.type === 'task'"
          :focus="editingFocus === 'details'"
          :value="editingTaskFields.details"
          @input-original-event="updateDetails($event)"
          :on-submit="submit")
        span(v-else) {{ name }}
      span.duration
        input(
          type="text"
          v-focus-and-select-all="editingFocus === 'duration'"
          :value="editingTaskFields.duration"
          @input="updateDuration($event)"
          @keyup.enter="submit()")
      span.actions
        //- a.icon-button.filter
        //-   i.material-icons filter_list
        a.icon-button.delete
          i.material-icons delete
        a.icon-button.cancel(@click="cancelTaskEditing()")
          i.material-icons block

    .item(v-else)
      span.name(v-once :color="colorCode")
        span(
          v-if="entry.type === 'task'"
          v-long-click="500"
          @long-click="startEdit('details')"
          @normal-click="startTask()") {{ name }}
        span(
          v-else) {{ name }}
      span.duration(
        v-long-click="500"
        @long-click="startEdit('duration')") {{ duration }}
      span.cost(
        v-if="price") {{ cost }}


    group-item(
      v-if="child.type"
      v-for="child in entry.children"
      :key="child.name"
      :entry="child")
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  import capitalize from '@/utils/capitalize'
  import { durationHuman } from '@/utils/time'
  import { translate } from '@/store/i18n'
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'
  import listInput from '@/components/list-input'
  import textareaInput from '@/components/textarea-input'
  // import bus from '@/event-bus'

  const labels = {
    month (item) {
      const d = moment(item.start)
      let label = capitalize(d.format('MMMM YYYY'))
      if (d.year() === (new Date()).getFullYear()) {
        label = label.split(' ')[0]
      }
      return label
    },

    day (item, locale) {
      const d = moment(item.start)
      let label = d.format('LL')
      if (locale === 'ru') {
        label = label.replace('г.', '').trim()
      }
      if (d.year() === (new Date()).getFullYear()) {
        label = label.split(' ').slice(0, 2).join(' ')
        if (locale === 'en') {
          label = label.replace(',', '')
        }
      }
      return label
    },

    task (item) {
      return item.name
    },

    year (item) {
      return item.name
    }
  }

  export default {
    props: [
      'entry'
    ],

    data () {
      return {
        edit: {
          details: '',
          duration: 0,
          start: new Date().getTime(),
          stop: new Date().getTime()
        }
      }
    },

    // Nested component hack
    beforeCreate () {
      this.$options.components.groupItem = require('./group-item.vue')
    },

    computed: {
      name () {
        return labels[this.entry.type](this.entry, this.locale)
      },
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
      ...mapGetters([
        'locale',
        'price',
        'isEditingTask',
        'editingTaskFields',
        'editingTaskUid',
        'editingFocus'
      ])
    },

    methods: {
      startTask () {
        console.log('start task', this.entry)
      },
      startEdit (field) {
        console.log('edit', this.entry)
        if (this.entry.type === 'task') {
          this.$store.commit('startTaskEditing', {
            focus: field,
            edit: {
              details: this.entry.details(),
              duration: this.entry.duration()
            },
            uid: this.entry.uid()
          })
        } else {
          this.$store.commit('startTaskEditing', {
            focus: field,
            entry: this.entry,
            edit: {
              duration: this.entry.duration()
            },
            uid: this.entry.uid()
          })
        }
      },
      updateDetails (event) {
        console.log('details', event)
        this.edit.details = event.target.value
      },
      updateDuration (event) {
        console.log('duration', event)
        this.edit.duration = event.target.value
      },
      submit () {
        console.log('submit', this.edit, this.editingTaskFields)
      },
      ...mapMutations([
        'cancelTaskEditing'
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
      textareaInput
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
      color tttc-text
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
        color tttc-text-muted
        left 0px
        top 0px
      &:before
        float right
        margin-left 0.25em

    .duration
      font-size 80%
      color tttc-text-muted
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
        &.non-editable
          padding-top 4px
          padding-bottom 4px
          padding-left 8px
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
          color tttc-text
          &:focus
            background-color tttc-back-dark
            color tttc-text-invert-highlight
      .duration
        width 6.5em
        margin 0 0 0 -8px
        line-height inherit
        font-size inherit
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
          color tttc-text
          &:focus
            background-color tttc-back-dark
            color tttc-text-invert-highlight
      .actions
        display flex
        padding-top 4px
        padding 4px
        justify-content flex-end
        width 5.75em
        position absolute
        right 0px
        bottom 0px
      .icon-button
        font-size 140%
      .icon-button + .icon-button
        margin-left 0.375em

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


  .view > .group-item > .item
    font-size 32px
    line-height 42px
    font-weight 400
    // display flex
    // justify-content space-between
    // align-items baseline
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

  .view > .group-item:not(:first-child) > .item
    margin-top 40px

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
