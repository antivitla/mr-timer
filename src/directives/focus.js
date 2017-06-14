import focusAndSelect from '@/utils/focus-and-select'

export const focusAndSelectAll = ({
  inserted (element, { value }) {
    if (value) {
      focusAndSelect(element, 0, element.value.length)
    }
  },

  update (element, { value }) {
    if (value.focus) {
      focusAndSelect(element, 0, element.value.length)
    }
  }
})

export const focusAndSelectRange = ({
  inserted (element, { value }) {
    if (value.focus) {
      focusAndSelect(element, value.start, value.end)
    }
  },

  update (element, { value }) {
    if (value.focus) {
      focusAndSelect(element, value.start, value.end)
    }
  }
})
