<template lang="pug">
  .collection-footer
    img.chibi(
      src="../../../static/img/chibi-07.png")
    a.copyright-link(href="//github.com/antivitla/titamota" target="_blank")
      .copyright-title Titamo&#x301;ta 1.0
      .copyright-motto сделано на&nbsp;левом берегу &trade;
      img.copyright-cat(src="~@/assets/images/cat-preloader.gif")
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
    // box-shadow: 0 -1px 0 0 titamota-color-line;
    .chibi
      max-width 100%
      margin 50px auto 100px auto
      display block
    .copyright-title
      font-size 18px
    .copyright-motto
      font-size 14px
      margin-top 5px
    .copyright-cat
      display block
      margin 25px auto 0px auto
    .copyright-link
      text-decoration none
      color titamota-color-text
      display block
      max-width 250px
      margin-left auto
      margin-right auto
</style>
