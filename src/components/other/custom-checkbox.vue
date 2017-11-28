<template lang="pug">
  label.custom-checkbox
    input(
      type="checkbox"
      ref="input"
      :id="id"
      :checked="value"
      @change="updateValue($event.target.checked)")
    i.material-icons.on
      span(v-if="!mark") check_box
      span(v-else) check
    i.material-icons.off
      span(v-if="!mark") check_box_outline_blank
      span.empty(v-else) check
</template>
<script>
  export default {
    props: {
      value: Boolean,
      id: String,
      mark: Boolean
    },
    methods: {
      updateValue (value) {
        this.$emit('input', Boolean(value))
      }
    }
  }
</script>
<style lang="stylus">
  .custom-checkbox
    display inline-block
    vertical-align middle
    position relative
    top -1px
    cursor pointer
    &:first-child + label
      margin-left 10px
    input
      display none
    i
      margin 0px 0px 0px 0px
      font-size 1.25em
    input:not(:checked) ~ .on
      display none
    input:not(:checked) ~ .off
      display block
    input:checked ~ .on
      display block
    input:checked ~ .off
      display none
    .empty
      opacity 0
</style>
