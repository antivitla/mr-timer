<template lang="pug">
  label.custom-radio
    input(
      type="radio"
      ref="input"
      :id="id"
      :value="value"
      :checked="isChecked"
      @change="updateValue($event.target.value)")
    i.material-icons.on(v-if="value") radio_button_checked
    i.material-icons.off radio_button_unchecked
</template>
<script>
  export default {
    props: {
      value: String,
      id: String,
      model: String
    },
    computed: {
      isChecked () {
        return this.model === this.value
      }
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .custom-radio
    display inline-block
    vertical-align middle
    color titamota-color-text-invert
    // position relative
    // top -1px
    cursor pointer
    &:first-child + label
      margin-left 10px
    input
      display none
    i
      margin 0px 0px 0px 0px
      font-size 21px
    input:not(:checked) ~ .on
      display none
    input:not(:checked) ~ .off
      display block
      color titamota-color-text-invert
    input:checked ~ .on
      display block
      color titamota-color-text-invert
    input:checked ~ .off
      display none
</style>
