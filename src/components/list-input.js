import autosize from 'autosize'

function parseList (list) {
  return (typeof list === 'string' ? list.split('/') : list)
    .map(item => item.replace(/\n/g, '').trim())
    .filter(item => item)
}

let debounceTimeout

function debounce (f, delay) {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(f, delay)
}

export default {
  template: `
    <textarea
      spellcheck="false"
      rows="1"
      ref="textarea"
      @input="updateValue($event.target.value)"
      @keyup.enter="onSubmit"
      :value="joinedList"
      :placeholder="placeholder">
    </textarea>
  `,

  props: [
    'value',
    'placeholder',
    'debounce',
    'onSubmit'
  ],

  mounted () {
    autosize(this.$el)
  },

  watch: {
    joinedList () {
      setTimeout(() => {
        autosize.update(this.$el)
      }, 10)
    }
  },

  computed: {
    joinedList () {
      return this.value.join(' / ')
    },
    delay () {
      return this.debounce ? parseInt(this.debounce, 10) : 0
    }
  },

  methods: {
    updateValue (value) {
      // Clear from linebreaks
      this.$el.value = this.$el.value.replace(/\n/g, '')
      // Return list if changed
      const list = parseList(value)
      const prev = parseList(this.value)
      if (list.join('/') !== prev.join('/')) {
        // Use delayed update..
        if (this.delay) {
          debounce(() => {
            this.$emit('input', list)
          }, this.delay)
        } else {
          // ...or not
          this.$emit('input', list)
        }
      }
    }
  }
}
