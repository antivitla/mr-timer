<template lang="pug">
  footer
    //- Чиби-йоби
    img(src="../assets/images/chibi-07.png" style="margin: 0px auto; display: block; margin-bottom: 100px; margin-top: 50px; max-width: 100%")
    //- Копирайты мои
    a(
      href="http://github.com/antivitla/mr-timer"
      target="_blank"
    )
      div(style="font-size: 18px;") Таймер 3.1
      div(style="font-size: 14px; margin-top: 5px;")
        | сделано на&nbsp;левом берегу ™
      img(style="display: block; margin: 25px auto 0px auto" src="../assets/images/cat-preloader.gif")
</template>

<style lang="stylus">
  @import '../assets/stylesheets/variables'

  footer
    text-align center
    max-width 1000px
    margin-left auto
    margin-right auto
    display: block;
    text-align: center;
    padding-top: 40px;
    padding-bottom: 40px;
    box-shadow: 0 -1px 0 0 titamota-color-line;
    a[href]
      text-decoration none
      color titamota-color-text
</style>
