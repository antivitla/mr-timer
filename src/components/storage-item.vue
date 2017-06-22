<template lang="pug">
  div.storage-item(
    :class="{ 'active': timerEntry.uid() === uid }")
    span.edit(
      v-if="isEditingTask && editingTaskUid === uid"
      @keyup.esc="cancelEdit()"
      v-esc-outside="cancelEdit"
      v-click-outside="cancelEdit")
      span.start
        input(
          type="text"
          v-focus-and-select-all="editingFocus === 'start'"
          :value="edit.start"
          @input="updateStart($event)"
          @keyup.enter="submit()")
      span.details
        span.non-editable(
          v-if="timerActive && timerEntry.uid() === uid") {{ details }}
        list-input(
          v-else
          :focus="editingFocus === 'details'"
          :value="edit.details"
          @input-original-event="updateDetails($event)"
          :on-submit="submit")
      span.duration
        span.non-editable(
          v-if="timerActive && timerEntry.uid() === uid") {{ duration }}
        input(
          v-else
          type="text"
          v-focus-and-select-all="editingFocus === 'duration'"
          :value="edit.duration"
          @input="updateDuration($event)"
          @keyup.enter="submit()")
      span.actions
        a.icon-button.delete(@click="removeEntry({ entry })")
          i.material-icons delete
        a.icon-button.cancel(@click="cancelEdit()")
          i.material-icons block
        span.icon-button.select
          input(type="checkbox" v-model="selected")

    span.read(
      v-else
      :class="{ 'selected': selected }"
      @click="toggleSelectEntry()")
      span.start(
        v-once
        v-long-click="500"
        @long-click="startEdit('start')") {{ start }}
      span.details(
        v-once
        v-long-click="500"
        @long-click="startEdit('details')") {{ details }}
      span.duration(
        v-long-click="500"
        @long-click="startEdit('duration')") {{ duration }}
      span.actions
        span.icon-button.select(v-if="selectionEntries.length")
          input(type="checkbox" v-model="selected")
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { translate } from '@/store/i18n'
  import { duration, durationEditable } from '@/utils/duration'
  import { timeEditable } from '@/utils/time'
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'
  import listInput from '@/components/list-input'
  import bus from '@/event-bus'
  import Entry from '@/models/entry'

  export default {
    props: ['entry'],

    data () {
      return {
        edit: {
          details: null,
          duration: null,
          start: null
        },
        selected: false
      }
    },

    created () {
      this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'selectionClear') {
          this.selected = false
        }
      })

      bus.$on('tick-timer', () => {
        if (this.entry.uid() === this.timerEntry.uid()) {
          this.entry.stop = this.timerEntry.stop
        }
      })
    },

    watch: {
      selected (value, b) {
        if (value) {
          this.selectionAdd({ entry: this.entry })
        } else {
          this.selectionRemove({ entry: this.entry })
        }
      }
    },

    computed: {
      details () {
        return this.entry.details.join(' / ')
      },
      duration () {
        const d = duration(this.entry.duration())
        if (this.entry.uid() === this.timerEntry.uid()) {
          return d.format('HH:mm:ss')
        } else {
          return d.format('HH:mm')
        }
      },
      start () {
        return timeEditable
          .stringify(this.entry.start, translate[this.locale].time.at)
      },
      uid () {
        return this.entry.uid()
      },
      isSelected () {
        return this.selectionEntries.indexOf(this.entry) > -1
      },
      ...mapGetters([
        'timerEntry',
        'timerActive',
        'locale',
        'isEditingTask',
        'editingTaskUid',
        'editingTaskFields',
        'editingFocus',
        'selectionEntries'
      ])
    },

    methods: {
      startTask () {
        bus.$emit('start-task', {
          entry: new Entry({
            start: new Date().getTime(),
            stop: new Date().getTime(),
            details: this.entry.details.slice(0)
          })
        })
      },
      toggleSelectEntry () {
        this.selected = !this.selected
      },
      clearEdit () {
        this.edit.details = null
        this.edit.duration = null
        this.edit.start = null
      },
      startEdit (field) {
        // Очистить ранние значения редактирования
        this.clearEdit()
        // Рефрешим на всякий режим редактирования
        this.cancelEdit()
        // Сочиняем объект редактирования,
        // используется как память с чем сравнивать
        // ну и вообще
        let payload = {
          focus: field,
          edit: {
            start: this.entry.start,
            details: this.entry.details,
            duration: this.entry.duration()
          },
          uid: this.entry.uid()
        }
        // Парсим из сырых цифр (милисекунд и деталей)
        // в человекочитаемое
        this.edit.start = timeEditable
          .stringify(this.entry.start, translate[this.locale].time.at)
        this.edit.details = this.entry.details.join(' / ')
        this.edit.duration = durationEditable
          .stringify(this.entry.duration())
        // Го редактировать
        this.startTaskEditing(payload)
        // Кстати, выбранная запись как будто стала выбрана
        // в пакетное редактирование
        // this.selected = true
      },
      cancelEdit () {
        this.stopTaskEditing()
        // this.selectionClear()
      },
      updateDetails (event) {
        this.edit.details = event.target.value
      },
      updateDuration (event) {
        this.edit.duration = event.target.value
      },
      updateStart (event) {
        this.edit.start = event.target.value
        const start = timeEditable
          .parse(this.edit.start)
        this.edit.duration = durationEditable
          .stringify(this.entry.stop - start)
        console.log(start)
        this.setTimerStart({ start })
      },
      submit () {
        this.cancelEdit()
        this.selectionClear()
        if (!this.timerActive) {
          const start = timeEditable
            .parse(this.edit.start)
          const duration = durationEditable
            .parse(this.edit.duration)
          const stop = start + duration
          const details = this.edit.details.split('/').map(d => d.trim())
          const payload = {
            entry: this.entry,
            update: { start, stop, details }
          }
          this.updateEntry(payload)
        }
      },
      ...mapMutations([
        'stopTaskEditing',
        'startTaskEditing',
        'selectionAdd',
        'selectionRemove',
        'selectionClear',
        'setTimerStart'
      ]),
      ...mapActions([
        'updateEntry',
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
      position relative
      &:hover
      &.selected
        cursor pointer
        background-color whitesmoke
        cursor pointer
        position relative
      @media (min-width 768px)
        flex-direction row
        align-items baseline
      .start
        cursor pointer
        display block
        color titamota-color-text-muted
        font-size 14px
        font-family PT Mono
        white-space nowrap
        width 165px
        @media (min-width 768px)
          line-height 1
      .details
        cursor pointer
        display block
        width 100%
        margin-top 5px
        margin-bottom 5px
        @media (min-width 768px)
          width auto
          max-width calc(100% - 320px)
          margin 0px 10px 0px 23px
      .duration
        cursor pointer
        display block
        color titamota-color-text-muted
        font-family PT Mono
        font-size 14px
        width 100px
        &:before
          content "="
          margin-right 10px
        @media (min-width 768px)
          line-height 1
      .actions
        position absolute
        right 0px
        bottom 0px
        display flex
        justify-content flex-end
        padding-top 4px
        padding-bottom 4px
        .select
          input
            pointer-events none

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
        display block
        color titamota-color-text-muted
        font-size 14px
        font-family PT Mono
        white-space nowrap
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
          color titamota-color-text
          &:focus
            background-color titamota-color-back-dark
            color titamota-color-text-invert-highlight
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
          color titamota-color-text
          &:focus
            background-color titamota-color-back-dark
            color titamota-color-text-invert-highlight
        .non-editable
          padding-top 4px
          padding-bottom 4px
          display block
          padding-left 8px
          padding-right 8px
          box-sizing box-sizing
      .duration
        width 6.5em
        margin-right 0px
        margin-left -8px
        display block
        font-family PT Mono
        font-size 14px
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
          color titamota-color-text
          font-family inherit
          &:focus
            background-color titamota-color-back-dark
            color titamota-color-text-invert-highlight
        .non-editable
          padding-top 4px
          padding-bottom 4px
          display block
          padding-left 8px
          padding-right 8px
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
        input
          margin-left 0.2em
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
    .storage-item.active
      color titamota-color-red
      .start
      .duration
        font-weight 700
        color titamota-color-red
      .details
        font-weight 500
      .start input
      .details textarea
      .duration input
        color titamota-color-red
        &:focus
          color lighten(titamota-color-red, 10%)
      .start input
      .duration input
        font-weight bold
      .details textarea
        font-weight 500

</style>
