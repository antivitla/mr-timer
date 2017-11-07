<template lang="pug">
  .user-profile
    img.avatar(:src="userProfile.avatar")
    .name {{ userName }}
    div(v-if="isAuthorized")
      .email {{ userProfile.email }}
      button.logout(
        @click.stop.prevent="logout()"
        :title="tipUserProfileLogout"
      )
        i.material-icons lock
        span {{ label('logout') }}
    div(v-else)
      .local-account {{ label('profile.localAccount') }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    computed: {
      ...mapGetters([
        'userName',
        'userProfile',
        'isAuthorized'
      ])
    },
    methods: {
      logout () {
        this.setNotAuthorized()
        this.clearUser()
        this.closeSidebar()
      },
      ...mapMutations([
        'closeSidebar',
        'clearUser',
        'setNotAuthorized'
      ])
    },
    mixins: [
      appTips,
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  // Common
  .user-profile
    .avatar
      height 120px
      width 120px
      border-radius 20%
    .name
      font-size 24px
      line-height 30px
      margin-top 10px
      margin-bottom 5px
    .email
      margin-top 5px
      margin-bottom 0px
    .logout
      margin-top 20px
      font-size 14px
      i
        vertical-align top
        display inline-block
        position relative
        top -1px
      span
        vertical-align top
        display inline-block

  // Inverted
  .invert .user-profile
  .user-profile.invert
      color titamota-color-text-invert-highlight
      .local-account
      .email
        color titamota-color-text-invert

  // Horizontal
  .user-profile.horizontal
    position relative
    padding-left 150px
    min-height 120px
    .avatar
      position absolute
      left 0px
      top 0px
</style>
