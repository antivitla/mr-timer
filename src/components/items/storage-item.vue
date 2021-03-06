<template lang="pug">
  div.storage-item(
    :class="{ 'active': isTrackingEntry }")
    span.edit(
      v-if="isEditingTask && editingTaskId === id"
      @keyup.esc="cancelEdit()"
      v-esc-outside="cancelEdit"
      v-click-outside="cancelEdit")
      span.start
        input(
          type="text"
          v-focus-and-select-all="editingFocus === 'start'"
          :value="edit.start"
          @input="updateStart($event)"
          @keyup.enter="submitEdit()")
      span.details
        list-input(
          :focus="editingFocus === 'details'"
          :value="edit.details"
          @input="updateDetails($event)"
          :on-submit="submitEdit")
      span.duration
        span.non-editable(
          v-if="isTrackingEntry") {{ duration }}
        input(
          v-else
          type="text"
          v-focus-and-select-all="editingFocus === 'duration'"
          :value="edit.duration"
          @input="updateDuration($event)"
          @keyup.enter="submitEdit()")
      span.actions
        a.icon-button.delete(
          v-if="!isTrackingEntry"
          @click="deleteAndGetEntries({ entries: [entry] })")
          i.material-icons delete
        a.icon-button.cancel(@click="cancelEdit()")
          i.material-icons block

    span.read(
      v-else
      :class="{ 'selected': selected }"
      @click="toggleSelectEntry()")
      span.start(
        v-long-click="375"
        @long-click="startEdit('start')") {{ start }}
      span.details(
        v-long-click="375"
        @long-click="startEdit('details')")
        span {{ details }}
      span.duration(
        v-long-click="375"
        @long-click="startEdit('duration')") {{ duration }}
      span.actions
        span.icon-button.select(v-if="Selected.entries.length")
          custom-checkbox(v-model="selected" mark)
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { translate } from '@/store/i18n'
  import { Selected } from '@/store/selected'
  import { taskDelimiter } from '@/store/ui'
  import { duration, durationEditable } from '@/utils/duration'
  import { timeEditable } from '@/utils/time'
  import longClick from '@/directives/long-click'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import { focusAndSelectAll } from '@/directives/focus'
  import listInput from '@/components/other/list-input'
  import customCheckbox from '@/components/other/custom-checkbox'
  import Entry from '@/models/entry'
  import storage from '@/mixins/storage'

  export default {
    props: ['entry'],
    data () {
      return {
        edit: {
          details: null,
          duration: null,
          start: null
        },
        selected: false,
        Selected
      }
    },
    created () {
      const actions = {
        'clearSelected': () => {
          this.selected = false
        },
        'tickTimer': () => {
          // Изменяем время текущей задачи если именно она бежит в таймере
          if (this.entry.id === this.timerEntry.id) {
            this.entry.stop = this.timerEntry.stop
          }
        }
      }
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (actions[mutation.type]) {
          actions[mutation.type]()
        }
      })
      // Начальное выставление выбранности
      Selected.entries.forEach(entry => {
        if (entry.id === this.entry.id) {
          this.selected = true
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    watch: {
      selected (value, b) {
        // Добавление / убирание из списка выбранного
        if (value) {
          this.addSelected({ entry: this.entry })
        } else {
          this.removeSelected({ entry: this.entry })
        }
      }
    },
    computed: {
      details () {
        return decodeURIComponent(this.entry.details.join(taskDelimiter))
      },
      duration () {
        let d = duration(this.entry.duration())
        if (this.entry.id === this.timerEntry.id) {
          if (this.timerEntry.duration() > this.entry.duration()) {
            d = duration(this.timerEntry.duration())
          }
          return d.format('HH:mm:ss')
        } else {
          return d.format('HH:mm')
        }
      },
      start () {
        return timeEditable
          .stringify(this.entry.start, translate[this.locale].time.at)
      },
      id () {
        return this.entry.id
      },
      isTrackingEntry () {
        return this.timerActive && this.timerEntry.id === this.entry.id
      },
      ...mapGetters([
        'timerEntry',
        'timerActive',
        'locale',
        'isEditingTask',
        'editingTaskId',
        'editingTaskFields',
        'editingFocus'
      ])
    },
    methods: {
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
        let payload = {
          focus: field,
          edit: {
            start: this.entry.start,
            details: this.entry.details.slice(0),
            duration: this.entry.duration()
          },
          id: this.entry.id
        }
        // Парсим из сырых цифр (милисекунд и деталей)
        // в человекочитаемое
        this.edit.start = timeEditable
          .stringify(this.entry.start, translate[this.locale].time.at)
        this.edit.details = this.entry.details
          .join(taskDelimiter)
        this.edit.duration = durationEditable
          .stringify(this.entry.duration())
        // Го редактировать
        this.startTaskEditing(payload)
        // Кстати, выбранная запись как будто стала выбрана
        // в пакетное редактирование
        this.selected = true
      },
      cancelEdit () {
        this.stopTaskEditing()
        if (Selected.entries.length < 2) {
          this.clearSelected()
        }
      },
      updateDetails (event) {
        this.edit.details = event.join(taskDelimiter)
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
        if (this.entry.id === this.timerEntry.id) {
          this.setTimerStart({ start })
        }
      },
      submitEdit () {
        this.cancelEdit()
        this.clearSelected()
        const id = this.entry.id
        const start = timeEditable.parse(this.edit.start)
        const duration = durationEditable.parse(this.edit.duration)
        const stop = start + duration
        const details = this.edit.details.split(taskDelimiter).map(d => d.trim())
        // Collect into new entry
        const updatedEntry = new Entry({ id, start, stop, details })
        // Perform update
        if (id === 'new') {
          this.postEntries({
            entries: [updatedEntry]
          })
        } else {
          this.patchEntries({
            remove: [this.entry],
            add: [updatedEntry]
          })
        }
      },
      ...mapMutations([
        'stopTaskEditing',
        'startTaskEditing',
        'addSelected',
        'removeSelected',
        'clearSelected',
        'setTimerStart'
      ]),
      ...mapActions([
        'patchEntries'
      ])
    },
    mixins: [
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
      customCheckbox
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

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
        background-color titamota-color-back-light-darker
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
          max-width calc(100% - 12em - 180px)
          margin 0px 10px 0px calc(0.5em + 15px)
      .duration
        cursor pointer
        display block
        color titamota-color-text-muted
        font-family PT Mono
        font-size 14px
        width 100px
        margin-left auto
        text-align right
        margin-right 2.25em
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
        @media (min-width 768px)
          bottom auto
          top 0px

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
        .material-icons
          display none
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
        width 4em
        position absolute
        right 0px
        bottom 0px
        padding-top 4px
        padding-bottom 4px
        .icon-button + .icon-button
          margin-left 0.45em
        .icon-button + .icon-button.select
          margin-left 0.5em
      @media (min-width 768px)
        flex-direction row
        .start
          margin-bottom 0
        .details
          margin-bottom 0
          margin-left 0.5em
          width calc(100% - 12em - 180px)
        .duration
          margin-left 0.5em
          input
            text-align center
        .actions
          margin-left auto
          position static

    &.active
      color titamota-color-text
      .start
        font-weight 700
        color titamota-color-text
      .duration
        font-weight 700
        color titamota-color-red

      .details
        font-weight 500
      .start input
      .details textarea
      .duration input
        color titamota-color-text
      .start input
      .duration input
        font-weight bold
      .details textarea
        font-weight 500

      .details
        .timer-clock
          display inline-block
          height 0px
          width 28px
          vertical-align middle
          position relative
          i.material-icons
            position absolute
            left 0px
            top -12px
            font-size 24px
            width 24px
            height 24px
            display inline-block
            // float left
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
</style>
