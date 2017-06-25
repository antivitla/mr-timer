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
        src="../assets/images/050-piranha.svg")
      .name {{ userName }}

    //- Localization
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

    //- Статистика
    //- h4 Статистика
    //- p
      label
        input(type="checkbox")
        | Включить

    //- Import/Export
    //- h4
      a
        span {{ labelImportExport }}
        i.material-icons import_export

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

  export default {
    data () {
      return {
        locales,
        currencies,
        selectedLocale: null,
        selectedCurrency: null,
        capitalize
      }
    },

    created () {
      this.selectedLocale = this.locale
      this.selectedCurrency = this.currency
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
        }
      },
      'selectedCurrency': function (currency) {
        if (currency) {
          this.setCurrency({ currency })
          const name = this.$route.name
          const query = Object.assign({},
            this.$route.query, { currency })
          this.$router.push({ name, query })
        }
      }
    },

    computed: {
      userName () {
        return capitalize(this.userKey)
      },
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
      ...mapGetters([
        'locale',
        'currency',
        'userKey',
        'sidebarActive'
      ])
    },

    methods: {
      labelCurrency (code) {
        return capitalize(translate[this.locale].currency[code])
      },
      ...mapMutations([
        'toggleSidebar',
        'closeSidebar',
        'setLocale',
        'setCurrency'
      ])
    },

    directives: {
      clickOutside,
      escOutside
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables'

  .sidebar
    background titamota-color-back-dark url('../assets/images/misty-mountains-bw.png') no-repeat center top
    background-position -30px -90px
    background-size auto 290px
    color titamota-color-text-invert
    position fixed
    right 0px
    top 0px
    bottom 0px
    overflow auto
    box-sizing border-box
    padding 200px 40px 60px 40px
    width 100%
    max-width 400px
    box-shadow inset 15px 0px 10px -10px rgba(0,0,0,0.5)
    transform translateX(100%)
    transition all 0.3s ease-out
    font-size 14px
    &.active
      transform translateX(0%)

    .toggle-sidebar
      position absolute
      left 0px
      top 0px
      right 0px
      height 200px
      color titamota-color-text-invert
      cursor pointer
      .material-icons
        position absolute
        left 40px
        top 40px
        font-size 24px
        line-height 40px
        display block

    a
      color titamota-color-text-invert
    p
      margin 5px auto
    h4
      font-size 16px
      line-height 24px
      font-weight 300
      margin 40px auto 10px auto
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
      width 50%
      cursor pointer
      color lighten(titamota-color-text-invert, 50%)
      background-color lighten(titamota-color-back-dark, 15%)
      &:focus
        background-color titamota-color-back-light
        color titamota-color-text

    .copyrights
      font-size 12px
      margin-top 60px
      div * + *
        margin-left 0.5em

    .profile
      display flex
      align-items center
      .avatar
        height 60px
        display block
      .name
        font-size 24px
        margin-left 15px
        color titamota-color-text-invert-highlight
</style>
