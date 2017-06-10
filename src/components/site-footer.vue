<template lang="pug">
  footer
    a(href="http://github.com/antivitla/mr-timer")
      //- Чиби-йоби
      img(src="../assets/images/chibi-07.png" style="margin: 0px auto; display: block; margin-bottom: 100px; margin-top: 50px;")
      //- Копирайты мои
      div(style="font-size: 18px;") Таймер 3.1
      div(style="font-size: 14px; margin-top: 5px;")
        | сделано на&nbsp;левом берегу ™
      img(style="display: block; margin: 25px auto 0px auto" src="../assets/images/cat-preloader.gif")
</template>

<style lang="stylus">
  @import '../assets/stylesheets/variables'

  footer
    text-align center
    display: block;
    text-align: center;
    padding-top: 40px;
    padding-bottom: 40px;
    box-shadow: 0 -1px 0 0 tttc-border;
    a[href]
      text-decoration none
      color tttc-text
</style>
