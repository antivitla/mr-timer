<template lang="pug">
  .view-pagination
    .previous
      //- i.material-icons keyboard_arrow_left
      span {{ label('pagination.previous') }}
    .current.active 26/809
    .next
      span {{ label('pagination.next') }}
      //- i.material-icons keyboard_arrow_right
    .all {{ label('pagination.all') }}
</template>
<script>
  import i18nLabel from '@/mixins/i18n-label'
  export default {
    props: ['type'],
    created () {
      console.log(this.type)
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .view-pagination
    display flex
    margin-top titamota-view-margin
    line-height 24px
    border-top solid titamota-color-border 1px
    font-size 13px

    .previous
      margin-left 0px
      margin-right auto
    .current
      margin-left auto
      margin-right auto
    .next
      margin-left auto
      margin-right 10px
    .all
      margin-right 0px
      margin-left 20px

    i + span
      margin-left 5px

    & > *
      position relative
      padding 0px 3px
      cursor pointer
      display flex
      &:after
        position absolute
        left 0
        top -2px
        height 3px
        display block
        width 100%
        background-color #dcdcdc
      &:hover:after
        content ' '
      &.active:after
        content ' '
        background-color titamota-color-text

</style>
