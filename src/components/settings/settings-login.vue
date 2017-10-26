<template lang="pug">
  .login(:preloader="whichProviderWaitingForAuth")
    p
      button.block.facebook(@click="login('facebook')")
        i.fa.fa-refresh
        span Facebook
    p
      button.block.github(@click="login('github')")
        i.fa.fa-refresh
        span Github
    p
      button.block.google(@click="login('google')")
        i.fa.fa-refresh
        span Google
    p
      button.block.vk(@click="login('vk')")
        i.fa.fa-refresh
        span VK
    p
      button.block.yandex(@click="login('yandex')")
        i.fa.fa-refresh
        span Yandex
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { translate } from '@/store/i18n'
  export default {
    data () {
      return {
        whichProviderWaitingForAuthTemp: 'github'
      }
    },
    computed: {
      labelInvitation () {
        return translate[this.locale].userLogin.invitation
      },
      ...mapGetters([
        'locale',
        'userProfile',
        'whichProviderWaitingForAuth'
      ])
    },
    methods: {
      login (provider) {
        this.authorizeWithProvider({ provider })
      },
      ...mapActions([
        'authorizeWithProvider'
      ])
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .login
    margin-top 0px
    margin-bottom 0px
    display flex
    flex-wrap wrap
    justify-content space-between
    p
      width 45%

    // Buttons
    button
      padding-left 15px
      padding-right 15px
      font-weight 500
      i.fa-refresh
        margin-right 10px
        display none

    // Preloader
    &[preloader]:not([preloader="false"])
      button
        span
          opacity 0.25
    &[preloader="facebook"] button.facebook
    &[preloader="github"] button.github
    &[preloader="google"] button.google
    &[preloader="vk"] button.vk
    &[preloader="yandex"] button.yandex
      i.fa-refresh
        animation spin 1s infinite linear
        transform rotate(0deg)
        display inline-block
      span
        opacity 1
</style>
