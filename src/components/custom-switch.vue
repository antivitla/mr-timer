<template lang="pug">
  .custom-switch
    a(
      v-for="option in options"
      :class="{ active: value === option.value }"
      @click="updateValue(option.value)") {{ label(option.label) }}
</template>
<script>
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    name: 'custom-switch',
    props: {
      options: Array,
      value: String
    },
    methods: {
      updateValue (value) {
        this.$emit('input', value)
      }
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  .custom-switch
    font-size 14px
    a
      padding 0px 3px
      cursor pointer
      display inline-block
      position relative
      font-size 13px
      &:after
        position absolute
        left 0
        bottom -2px
        height 3px
        display block
        width 100%
        background-color #dcdcdc
      &:hover:after
        content ' '
      &.active:after
        content ' '
        background-color titamota-color-text
    a + a
      margin-left 5px
</style>
