<template lang="pug">
  textarea(
    spellcheck="false"
    rows="1"
    ref="textarea"
    @input="updateValue($event.target.value)"
    @keyup.enter="onSubmit"
    :value="value"
    v-focus-and-select-all="focus"
    :placeholder="placeholder")
</template>

<script>
  import autosize from 'autosize'
  import debounce from '@/utils/debounce'
  import { focusAndSelectAll } from '@/directives/focus'

  export default {
    data () {
      return {
        debounceUpdate: debounce(),
        focusOnActive: false
      }
    },

    props: [
      'value',
      'placeholder',
      'debounce',
      'onSubmit',
      'focus'
    ],

    mounted () {
      autosize(this.$el)
    },

    watch: {
      'value' () {
        setTimeout(() => {
          autosize.update(this.$el)
        }, 10)
      }
    },

    computed: {
      delay () {
        return this.debounce ? parseInt(this.debounce, 10) : 0
      }
    },

    methods: {
      updateValue (value) {
        if (this.delay) {
          this.debounceUpdate(() => {
            this.$emit('input', value)
          }, this.delay)
        } else {
          // ...or not
          this.$emit('input', value)
        }
      }
    },

    directives: {
      focusAndSelectAll
    }
  }
</script>
