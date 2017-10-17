<template lang="pug">
  .user-profile
    img.avatar(:src="userAvatar")
    .name {{ userName }}
    .logout {{ labelLogout }}
</template>
<script>
  import { mapGetters } from 'vuex'
  import capitalize from '@/utils/capitalize'
  import { translate } from '@/store/i18n'
  export default {
    name: 'user-profile',
    computed: {
      labelLogout () {
        return capitalize(translate[this.locale].logout)
      },
      ...mapGetters([
        'locale',
        'userName',
        'userAvatar'
      ])
    }
  }
</script>
<style lang="stylus">
  .user-profile
    display flex
    flex-direction column
    align-items flex-start
    .avatar
      border-radius 20%
      display block
    .logout
      cursor pointer
</style>
