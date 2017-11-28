import { mapGetters } from 'vuex'
import capitalize from '@/utils/capitalize'
import { translate } from '@/store/i18n'
import MessageFormat from 'messageformat'

const messageFormat = {
  ru: new MessageFormat('ru'),
  en: new MessageFormat('en')
}

export default {
  computed: {
    ...mapGetters([
      'locale',
      'currency'
    ])
  },
  methods: {
    labelFromPath (path) {
      let prop = translate[this.locale]
      path.split('.').forEach(l => {
        prop = prop[l]
      })
      return prop
    },
    label (path, isCapitalized = true) {
      const value = this.labelFromPath(path)
      return isCapitalized ? capitalize(value) : value
    },
    labelFormat (path, params, isCapitalized = true) {
      return messageFormat[this.locale]
        .compile(this.labelFromPath(path))(params)
    }
  }
}
