<template lang="pug">
  section
    h2 Mitaba Social Auth
    div
      p Profile:
      pre {{ userProfile }}
      p &nbsp;

    button.login(@click="login('facebook')")
      i.fa.fa-facebook.fa-lg
    span &emsp;
    button.login(@click="login('github')")
      i.fa.fa-github-alt.fa-lg
    span &emsp;
    button.login(@click="login('google')")
      i.fa.fa-google.fa-lg
    span &emsp;
    button.login(@click="login('vk')")
      i.fa.fa-vk.fa-lg
    span &emsp;
    button.login(@click="login('yandex')")
      strong Yandex
    span &emsp;
    button.login.primary(@click="logout()") Logout
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'userProfile'
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
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/common'
  @import '~@/assets/stylesheets/api'

  .login
    margin 10px
    width 150px
</style>
