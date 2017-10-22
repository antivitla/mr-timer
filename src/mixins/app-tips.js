import { mapGetters } from 'vuex'
import capitalize from '@/utils/capitalize'
import { translate } from '@/store/i18n'

export default {
  computed: {
    tipToggleSidebarTop () {
      return capitalize(translate[this.locale].tip['toggle-sidebar-top'])
    },
    tipToggleSidebarInSidebar () {
      return capitalize(translate[this.locale].tip['toggle-sidebar-in-sidebar'])
    },
    tipUserProfileLogout () {
      return capitalize(translate[this.locale].tip['user-profile-logout'])
    },
    ...mapGetters([
      'locale'
    ])
  }
}
