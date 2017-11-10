<template lang="pug">
  .sidebar(
    :class="{ 'active': sidebarActive }"
    v-click-outside="closeSidebar"
    v-esc-outside="closeSidebar")

    //- Toggle sidebar
    .toggle-sidebar(@click="toggleSidebar")
      i.material-icons close

    //- Profile
    .profile
      img.avatar(
        @click.stop.prevent="modal('chooseAvatar')"
        :src="userAvatar")
      .name {{ userName }}

    .layout
      //- Localization
      .fieldset
        h4 {{ labelL10n }}
        p
          select(v-model="selectedLocale")
            option(
              v-for="l in locales"
              :value="l.code") {{ capitalize(l.label) }}
        p
          select(v-model="selectedCurrency")
            option(
              v-for="c in currencies"
              :value="c.code") {{ labelCurrency(c.code) }}

      //- Виды
      .fieldset
        h4 {{ labelTurnOn }}
        p(v-for="(value, view) in views")
          label(:disabled="isOnlyOne(view)")
            span.custom-checkbox
              input(
                type="checkbox"
                v-model="views[view]"
                @change="toggleView(view, $event)")
              i.material-icons.on check_box
              i.material-icons.off check_box_outline_blank
            span {{ labelView(view) }}

    //- Import / Export
    import-export

    //- Copyrights
    .copyrights
      div
        span {{ labelIcons }}
        a(href="http://www.freepick.com" target="_blank") Freepik
        span {{ labelFrom }}
        a(href="http://flaticon.com" target="_blank") flaticon.com
      div
        span {{ labelGirls }}
        a(href="http://hyanna-natsu.deviantart.com/") Hyanna Natsu
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  import capitalize from 'lodash/capitalize'
  import {
    translate,
    locales,
    currencies } from '@/store/i18n'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'
  import importExport from '@/components/modals/import-export'

  export default {
    data () {
      return {
        locales,
        currencies,
        selectedLocale: null,
        selectedCurrency: null,
        capitalize,
        views: {}
      }
    },

    created () {
      this.selectedLocale = this.locale
      this.selectedCurrency = this.currency
      this.views = Object.assign({}, this.viewsAvailable)
    },

    watch: {
      'selectedLocale': function (locale) {
        if (locale) {
          this.setLocale({ locale })
          moment.locale(locale)
          const name = this.$route.name
          const query = Object.assign({},
            this.$route.query, { locale })
          this.$router.push({ name, query })
          this.closeSidebar()
        }
      },
      'selectedCurrency': function (currency) {
        if (currency) {
          this.setCurrency({ currency })
          const name = this.$route.name
          const query = Object.assign({},
            this.$route.query, { currency })
          this.$router.push({ name, query })
          this.closeSidebar()
        }
      }
    },

    computed: {
      labelIcons () {
        return capitalize(translate[this.locale].sidebar.icons)
      },
      labelFrom () {
        return translate[this.locale].sidebar.from
      },
      labelGirls () {
        return capitalize(translate[this.locale].sidebar.girls)
      },
      labelL10n () {
        return capitalize(translate[this.locale].sidebar.l10n)
      },
      labelImportExport () {
        const t = translate[this.locale]
        return `${capitalize(t.import)} ${t.and} ${t.export}`
      },
      labelTurnOn () {
        return capitalize(translate[this.locale].sidebar.turnOn)
      },
      ...mapGetters([
        'locale',
        'currency',
        'userKey',
        'userAvatar',
        'userName',
        'sidebarActive',
        'viewsAvailable'
      ])
    },

    methods: {
      labelCurrency (code) {
        return capitalize(translate[this.locale].currency[code])
      },
      modal (name) {
        this.openModal({ modal: name })
        this.closeSidebar()
      },
      labelView (view) {
        return capitalize(translate[this.locale].view[view])
      },
      toggleView (view) {
        this.toggleAvailableView({ view })
      },
      isOnlyOne (view) {
        return Object.keys(this.views)
          .filter(v => this.views[v])
          .length < 2 && this.views[view]
      },
      ...mapMutations([
        'toggleSidebar',
        'closeSidebar',
        'setLocale',
        'setCurrency',
        'openModal',
        'toggleAvailableView'
      ])
    },

    directives: {
      clickOutside,
      escOutside
    },

    components: {
      importExport
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .sidebar
    background titamota-color-back-dark url('../assets/images/misty-mountains-bw.png') no-repeat center top
    background-position -30px -90px
    background-size auto 290px
    color titamota-color-text-invert
    position fixed
    top 0px
    right 0px
    bottom 0px
    overflow auto
    box-sizing border-box
    padding 180px 40px 60px 40px
    width 100%
    box-shadow inset 10px 0px 20px -10px rgba(0,0,0,0.5)
    transform translateX(100%)
    transition all 0.3s ease-out
    font-size 14px
    opacity 0
    pointer-events none
    @media (min-width 768px)
      max-width 50vw
    &.active
      transform translateX(0%)
      opacity 1
      pointer-events all

    .toggle-sidebar
      position absolute
      left 0px
      top 0px
      right 0px
      height 150px
      color titamota-color-text-invert
      cursor pointer
      .material-icons
        position absolute
        right 20px
        top 10px
        font-size 24px
        line-height 40px
        display none
        color titamota-color-text-invert-highlight

    a
      color titamota-color-text-invert
    p
      margin 5px auto
    h4
      font-size 16px
      line-height 24px
      font-weight 300
      margin 50px auto 10px auto
      color titamota-color-text-invert-highlight
      a
        color inherit
      i
        line-height 1
        vertical-align top
        display inline
        position relative
        top 2px
    select
      height 24px
      border 0px
      margin 0px
      width 75%
      cursor pointer
      color lighten(titamota-color-text-invert, 50%)
      background-color lighten(titamota-color-back-dark, 15%)
      &:focus
        background-color titamota-color-back-light
        color titamota-color-text

    .layout
      display flex
      flex-direction column
      .fieldset
        width 100%
      @media (min-width 480px)
        flex-direction row
        .fieldset
          width 50%

    label[disabled]
      opacity 0.5
      cursor text
      pointer-events none

    .copyrights
      font-size 12px
      margin-top 60px
      div * + *
        margin-left 0.5em

    .profile
      display flex
      align-items flex-start
      flex-direction column
      .avatar
        height 60px
        display block
        cursor pointer
        border-radius 25%
        opacity 0.75
        // box-shadow 0px 0px 0px 2px rgba(white, 0.125)
      .name
        font-size 24px
        margin-top 15px
        color titamota-color-text-invert-highlight

    .import-export
      margin-top 50px
      width 100%
      .info
        display none
      .switch-menu-wrapper
        margin-bottom 20px
        border-bottom-color alpha(titamota-color-line, 10%)
        margin-left -5px
        width calc(100% + 10px)
      .switch-menu
        &.type
          a
            font-size 16px
            padding-left 5px
            padding-right 5px
        a
          color alpha(titamota-color-text-invert, 50%)
          &:hover:after
            background-color alpha(titamota-color-text-invert, 50%)
        a.active
          color titamota-color-text-invert-highlight
        a.active:after
          background-color titamota-color-text-invert
      textarea
        background-color transparent
        color titamota-color-text-invert
        resize none
        height 10em !important
        padding 0px
        margin-top 20px
        margin-bottom 20px
      .submit
        justify-content flex-start
        .button
          font-size 12px
          padding 5px 20px
          font-weight 400
        .button + .button
          margin-left 10px
        .merge
          color titamota-color-text
</style>
