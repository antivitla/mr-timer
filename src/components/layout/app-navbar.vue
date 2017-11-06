<template lang="pug">
  nav.app-navbar
    div.left
      slot(name="left") Left
    div.right
      slot(name="right") Right
</template>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .app-navbar
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    .left
      margin-right auto
      flex-grow 1
    .right
      margin-left auto
</style>
