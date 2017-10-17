<template lang="pug">
  nav.app-navbar
    div.left
      slot(name="left") Left
    div.right
      slot(name="right") Right
</template>
<script>
  export default {
    name: 'app-navbar'
  }
</script>
<style lang="stylus">
  .app-navbar
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    .left
      margin-right auto
    .right
      margin-left auto
</style>
