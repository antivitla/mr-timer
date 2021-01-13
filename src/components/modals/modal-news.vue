<template lang="pug">
  .modal.news
    h2 {{ label('modal.news.title') }}

    //- Show modal next time
    p
      custom-checkbox(
        class="show-news-modal"
        v-model="hideUntilNextUpdate")
      label(v-custom-for="'.show-news-modal'")
        span {{ label('settings.doNotShowUntilNextUpdate') }}

    h3 {{ displayLastUpdate }}
    template(v-if="locale === 'ru'")
      p Добавлен хелп по таймеру. Проверь, может еще не все возможности знаешь?
      p
        img.modal-news-illustration(src="static/img/show-help-ru-02.png")
      p Или
      p
        img.modal-news-illustration(src="static/img/show-help-ru-01.png")
      p
        button.block(@click="openHelp()") Открыть помощь сейчас
    template(v-else)
      p Help added. Check it, chances are you'll find out something new.
      p
        img.modal-news-illustration(src="static/img/show-help-02.png")
      p Or
      p
        img.modal-news-illustration(src="static/img/show-help-01.png")
      p
        button.block(@click="openHelp()") Open help now

    //- Close
    .close-modal(@click="closeModal")
      i.material-icons close
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import customCheckbox from '@/components/other/custom-checkbox'
  import customFor from '@/directives/custom-for'
  import { time } from '@/utils/time'

  export default {
    computed: {
      hideUntilNextUpdate: {
        get () {
          return this.lastUpdate <= this.lastReadUpdate
        },
        set (value) {
          this.setLastReadUpdate({ lastReadUpdate: new Date() })
        }
      },
      displayLastUpdate () {
        return time(this.lastUpdate.getTime()).format('D MMM YYYY', this.locale)
      },
      ...mapGetters([
        'locale',
        'lastUpdate',
        'lastReadUpdate'
      ])
    },
    methods: {
      openHelp () {
        this.toggleSidebar()
        this.openModal({ modal: 'help' })
      },
      ...mapMutations([
        'toggleSidebar',
        'setLastReadUpdate'
      ]),
      ...mapActions([
        'openModal',
        'closeModal'
      ])
    },
    mixins: [
      i18nLabel
    ],
    directives: {
      customFor
    },
    components: {
      customCheckbox
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/modal'

  .modal.news
    max-width 640px
    box-shadow 1px 3px 10px 0px alpha(titamota-color-text, 10%)
    text-align left
    h3
      margin-top 40px

    .modal-news-illustration
      width 100%
      border-radius 5px
</style>
