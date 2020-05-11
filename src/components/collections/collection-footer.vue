<template lang="pug">
  .collection-footer
    a.copyright-link(href="//github.com/antivitla/titamota" target="_blank")
      .copyright-title Titamo&#x301;ta 1.1
      .copyright-motto сделано на&nbsp;левом берегу &trade;
      img.copyright-cat(src="~@/assets/images/cat-preloader-muted.gif")
</template>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .collection-footer
    text-align center
    max-width 1000px
    margin-left auto
    margin-right auto
    display: block;
    padding-top: 40px;
    padding-bottom: 40px;
    .chibi
      max-width 100%
      margin 50px auto 100px auto
      display block
    .copyright-title
      font-size 18px
    .copyright-motto
      font-size 13px
      margin-top 3px
    .copyright-cat
      display block
      margin 15px auto 5px auto
    .copyright-link
      text-decoration none
      color titamota-color-text
      display block
      max-width 250px
      margin-left auto
      margin-right auto
  .sidebar
    .collection-footer
      padding-bottom 0px
      padding-top 0px
      margin-top 90px
      .copyright-link
        color titamota-color-text-invert
      .copyright-motto
        opacity 0.5
</style>
