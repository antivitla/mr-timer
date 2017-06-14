<template lang="pug">
  div.storage-item
    span.edit(
      v-if="isEditingTask && editingTaskUid === uid"
      @keyup.esc="cancelTaskEditing()"
      v-esc-outside="cancelTaskEditing"
      v-click-outside="cancelTaskEditing")
      span.start
        input(
          type="text"
          v-focus-and-select-all="editingFocus === 'start'"
          :value="editingTaskFields.start"
          @input="updateStart($event)"
          @keyup.enter="submit()")
      span.details
        list-input(
          :focus="editingFocus === 'details'"
          :value="editingTaskFields.details"
          @input-original-event="updateDetails($event)"
          :on-submit="submit")
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
        a.icon-button.delete(@click="removeEntry({ entry })")
          i.material-icons delete
        a.icon-button.cancel(@click="cancelTaskEditing()")
          i.material-icons block

    span.read(v-else)
      span.start(
        v-once
        v-long-click="500"
        @long-click="startEdit('start')") {{ start }}
      span.details(
        v-once
        v-long-click="500"
        @long-click="startEdit('details')"
        @normal-click="startTask()") {{ details }}
      span.duration(
        v-long-click="500"
        @long-click="startEdit('duration')") {{ duration }}
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { translate } from '@/store/i18n'
  import {
    durationHHMM,
    durationHHMMSS,
    timeDDMMYYYY,
    timeHHMM
  } from '@/utils/time'
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'
  import listInput from '@/components/list-input'

  export default {
    props: ['entry'],

    computed: {
      details () {
        return this.entry.details.join(' / ')
      },
      duration () {
        const d = this.entry.duration()
        if (this.entry === this.timerEntry) {
          return durationHHMMSS(d)
        } else {
          return durationHHMM(d)
        }
      },
      start () {
        const d = new Date(this.entry.start)
        const date = timeDDMMYYYY(d)
        const time = timeHHMM(d)
        const label = date + ' ' +
          translate[this.locale].time.at + ' ' +
          time
        return label
      },
      uid () {
        return this.entry.uid()
      },
      ...mapGetters([
        'timerEntry',
        'locale',
        'isEditingTask',
        'editingTaskUid',
        'editingTaskFields',
        'editingFocus'
      ])
    },

    methods: {
      startTask () {
        console.log('start task')
      },

      startEdit (field) {
        this.$store.commit('startTaskEditing', {
          focus: field,
          edit: {
            start: this.entry.start,
            details: this.entry.details,
            stop: this.entry.stop,
            duration: this.entry.duration()
          },
          uid: this.entry.uid()
        })
      },
      submit () {
        console.log('submit')
      },
      ...mapMutations([
        'cancelTaskEditing',
        'removeEntry'
      ])
    },

    directives: {
      longClick,
      clickOutside,
      escOutside,
      focusAndSelectAll
    },

    components: {
      listInput
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables.styl'

  .storage-item
    margin 6px auto 20px auto
    @media (min-width 768px)
      margin-bottom 6px
    .read
      display flex
      flex-direction column
      padding-top 4px
      padding-bottom 4px
      @media (min-width 768px)
        flex-direction row
        align-items baseline
    .start
    .details
    .duration
      display block
      cursor pointer

    .start
      color tttc-text-muted
      font-size 14px
      font-family PT Mono
      white-space nowrap
      width 165px
      @media (min-width 768px)
        line-height 1

    .details
      width 100%
      margin-top 5px
      margin-bottom 5px
      @media (min-width 768px)
        width auto
        max-width calc(100% - 320px)
        margin 0px 10px 0px 23px

    .duration
      color tttc-text-muted
      font-family PT Mono
      font-size 14px
      width 100px
      &:before
        content "="
        margin-right 10px
      @media (min-width 768px)
        line-height 1

    .edit
      display flex
      flex-direction column
      align-items flex-start
      width 100%
      position relative
      padding-top 0
      padding-bottom 0
      .start
        width 180px
        margin-left -8px
        line-height inherit
        margin-bottom 0.5em
        input
          text-align left
          display block
          width 100%
          font-size inherit
          font-family inherit
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
      .details
        width calc(100% + 8px)
        margin 0 0 0.5em -8px
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
        margin-right 0px
        margin-left -8px
        line-height inherit
        &:before
          content none
        input
          text-align left
          display block
          width 100%
          font-size inherit
          box-sizing border-box
          padding 4px 8px
          border none
          line-height inherit
          border-radius 5px
          resize none
          background-color white
          color tttc-text
          font-family inherit
          &:focus
            background-color tttc-back-dark
            color tttc-text-invert-highlight

      .actions
        display flex
        justify-content flex-end
        width 5.75em
        position absolute
        right 0px
        bottom 0px
        padding-top 4px
        padding-bottom 4px
      .icon-button
        font-size 140%
      .icon-button + .icon-button
        margin-left 0.375em

      @media (min-width 768px)
        flex-direction row
        .start
          margin-bottom 0
        .details
          margin-bottom 0
          margin-left 0.5em
          width calc(100% - 12.25em - 180px)
        .duration
          margin-left 0.5em
          input
            text-align center
        .actions
          margin-left auto
          position static

  .timer-active
    .storage-item:first-child
      color tttc-red
      .start
      .duration
        font-weight 700
        color tttc-red
      .details
        font-weight 500

      .start input
      .details textarea
      .duration input
        color tttc-red
        &:focus
          color lighten(tttc-red, 10%)
      .start input
      .duration input
        font-weight bold
      .details textarea
        font-weight 500

</style>
