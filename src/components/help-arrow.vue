<template lang="pug">
  span.help-arrow(v-arrow="target" offset="5,9")
    .text
      slot text
    svg(width="1" height="1")
      defs
        marker#arrow-def(markerWidth="10" markerHeight="6" refX="0" refY="3" orient="auto")
          path(d="M 0,0 10,3 0,6")
      path.arrow
</template>
<script>
  import arrow from '@/directives/arrow'
  export default {
    name: 'help-arrow',
    props: ['target'],
    directives: {
      arrow
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  .help-arrow
    position relative
    .text
      cursor pointer
      display inline-block
      border-bottom dashed titamota-color-red 2px
    &.active
      .text
        border-color titamota-color-red
    svg
      display inline
      overflow visible
    #arrow-def
      fill titamota-color-red
    .arrow
      display none
      fill none
      stroke titamota-color-red
      stroke-width 2px
      stroke-dasharray 7 5
      marker-end url(#arrow-def)
    &.active
      .arrow
        display block
</style>
