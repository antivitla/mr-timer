<template lang="pug">
  .icon-preloader
    i.refresh.material-icons autorenew
</template>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .icon-preloader
    width 24px
    height 24px
    line-height 24px
    // font-size 24px
    // color titamota-color-red
    .refresh
      animation spin 0.75s infinite linear
      transform rotate(0deg)
      display block
      font-size 24px
      text-align center
      line-height 24px
</style>
