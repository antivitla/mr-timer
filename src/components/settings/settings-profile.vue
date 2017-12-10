<template lang="pug">
  .user-profile
    img.avatar(:src="userProfile.avatar")
    .name {{ userName }}
    div(v-if="isAuthorized")
      .email(v-if="userName !== userProfile.email") {{ userProfile.email }}
      button.logout(
        @click.stop.prevent="setNotAuthorized"
        :title="tipUserProfileLogout"
      )
        i.material-icons lock
        span {{ label('logout') }}
      i.toggle-delete-account.material-icons(@click="showProfileDanger = !showProfileDanger")
        span(v-if="!showProfileDanger") settings
        span(v-else) settings
      .delete-account(v-if="showProfileDanger")
        p
          small {{ label('settings.confirmDeleteLabel') }}
        input(
          type="text"
          v-model="tryDelete"
          @keyup.enter="confirmDelete")
    div(v-else)
      .local-account {{ label('profile.localAccount') }}
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        tryDelete: '',
        showProfileDanger: false
      }
    },
    computed: {
      ...mapGetters([
        'userName',
        'userProfile',
        'isAuthorized'
      ])
    },
    methods: {
      confirmDelete () {
        if (this.tryDelete === this.label('settings.confirmDeletePhrase')) {
          this.tryDelete = ''
          this.deleteAccount()
          this.setNotAuthorized()
          this.closeSidebar()
        }
      },
      ...mapMutations([
        'setNotAuthorized',
        'closeSidebar'
      ]),
      ...mapActions([
        'deleteAccount'
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

    .delete-account
      p
        margin-top 20px
        margin-bottom 10px
        color titamota-color-text-invert
      input
        width 100%
        display block
        box-sizing border-box

    .toggle-delete-account
      font-size 24px
      width 40px
      height 40px
      text-align center
      line-height 38px
      vertical-align top
      margin-top 20px
      cursor pointer
      color titamota-color-text-invert

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
