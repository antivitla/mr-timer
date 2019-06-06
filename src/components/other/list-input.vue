<template lang="pug">
  textarea(
    spellcheck="false"
    rows="1"
    ref="textarea"
    @input="updateValue($event)"
    @keydown.enter.prevent.stop="keepValue($event)"
    @keyup.enter.prevent.stop="onSubmit"
    :value="joinedList"
    v-focus-and-select-range="focusSelectionRangeOptions"
    :placeholder="placeholder")
</template>
<script>
  import autosize from 'autosize'
  import debounce from '@/utils/debounce'
  import { focusAndSelectRange } from '@/directives/focus'
  import bus from '@/event-bus'
  import { taskDelimiter } from '@/store/ui'

  function parseList (list) {
    return (typeof list === 'string' ? list.split(taskDelimiter) : list)
      .map(item => item.replace(/\n/g, '').replace(/\/\s?$/, '').trim())
      .filter(item => item)
  }

  export default {
    data () {
      return {
        debounceUpdate: debounce(),
        focusOnActive: false,
        focusedOnce: false,
        doNotUpdate: false,
        cachedEnter: '',
        handlers: {
          onResetFocus: () => { this.focusedOnce = false },
          onDropSelection: () => { this.dropSelection() }
        }
      }
    },
    props: {
      value: String,
      placeholder: String,
      debounce: {
        type: Number,
        default: 0
      },
      onSubmit: Function,
      focus: Boolean,
      resetFocusOn: String,
      dropSelectionOn: {
        type: String,
        default: 'drop-selection'
      }
    },
    created () {
      bus.$on(this.resetFocusOn, this.handlers.onResetFocus)
      bus.$on(this.dropSelectionOn, this.handlers.onDropSelection)
    },
    mounted () {
      autosize(this.$el)
      this.unsubscribe = this.$store.subscribe(mutation => {
        let t = mutation.type
        if (t === 'setContext' || t === 'clearContext') {
          setTimeout(() => {
            autosize.update(this.$el)
          }, 10)
        }
        if (t === 'startTimer') {
          this.doNotUpdate = false
        }
      })
    },
    beforeDestroy () {
      bus.$off(this.resetFocusOn, this.handlers.onResetFocus)
      bus.$off(this.dropSelectionOn, this.handlers.onDropSelection)
      this.unsubscribe()
    },
    watch: {
      joinedList () {
        setTimeout(() => {
          autosize.update(this.$el)
        }, 10)
      },
      focus (focus) {
        if (focus) {
          this.focusedOnce = false
        }
      }
    },
    computed: {
      joinedList () {
        let jl = ''
        if (Array.isArray(this.value)) {
          jl = this.value
            .join(taskDelimiter)
        } else if (this.value) {
          jl = String(this.value)
        }
        return jl
      },
      focusSelectionRangeOptions () {
        if (!this.focusedOnce) {
          this.focusedOnce = true
          let start = 0
          if (this.joinedList.match(taskDelimiter)) {
            start = this.joinedList.lastIndexOf(taskDelimiter) + 3
          }
          return {
            focus: this.focus,
            start,
            end: this.joinedList.length
          }
        } else {
          return {
            focus: false,
            start: this.joinedList.length,
            end: this.joinedList.length
          }
        }
      }
    },
    methods: {
      updateValue ($event) {
        // Clear from linebreaks
        this.$el.value = this.$el.value.replace(/\n/g, '')
        // Do not update if was selected
        if (this.doNotUpdate) {
          this.doNotUpdate = false
          return
        }
        // Return list if changed.
        const unfinishedList = $event.target.value.match(/\s\/\s*$/)
        const nextList = parseList($event.target.value).join(taskDelimiter)
        const prevList = parseList(this.value).join(taskDelimiter)
        if (nextList !== prevList && !unfinishedList) {
          const updatedList = $event.target.value.split(taskDelimiter)
          // Use delayed update..
          if (this.debounce) {
            this.debounceUpdate(() => {
              this.$emit('input', updatedList)
              this.$emit('input-original-event', $event)
            }, this.debounce)
          } else {
            // ...or not
            this.$emit('input', updatedList)
            this.$emit('input-original-event', $event)
          }
        }
      },
      keepValue (event) {
        this.doNotUpdate = true
        this.dropSelection()
        if (event.target.value) {
          this.cachedEnter = event.target.value
        } else {
          event.target.value = this.cachedEnter
        }
      },
      dropSelection () {
        this.$el.setSelectionRange(this.$el.selectionEnd, this.$el.selectionEnd)
      }
    },
    directives: {
      focusAndSelectRange
    }
  }
</script>
