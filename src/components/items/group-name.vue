<template lang="pug">
  .group-name
    .with-link(
      v-if="isTaskWithLink()"
      v-html="displayHtmlName")
    .without-link(v-else) {{ displayName }}
    .weekend(v-if="weekend && group.type === 'day'") {{ label('weekend', false) }}
</template>
<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import capitalize from 'lodash/capitalize'
  import i18nLabel from '@/mixins/i18n-label'

  const urlRegexp = /((https?):\/\/.*?(\s|$))/

  export default {
    props: ['group'],
    computed: {
      displayName () {
        return this[this.group.type]
      },
      displayHtmlName () {
        let href = this.group.name.match(urlRegexp)[1]
        const providers = {
          bitbucket: href.match(/bitbucket.(org|com)\//),
          trello: href.match(/trello.com\//),
          basecamp: href.match(/(basecamp|basecamphq).com\//),
          asana: href.match(/app.asana.com\//),
          github: href.match(/github.com\//),
          atlassian: href.match(/atlassian.net/)
        }
        const provider = Object.keys(providers).find(key => {
          return providers[key]
        })
        const name = this.group.name.replace(href, '').trim()
        const link = decodeURIComponent(href.replace(/https?:\/\//, ''))
        return (provider ? `<div class="favicon ${provider}"></div>` : '') +
          (name ? `<div class="link-name">${name}</div>` : '') +
          (link ? `<div class="link-url">${link}</div>` : '')
      },
      task () {
        return this.group.name
      },
      year () {
        return this.group.name
      },
      month () {
        const d = moment(this.group.start)
        let label = capitalize(d.format('MMMM YYYY'))
        if (d.year() === (new Date()).getFullYear()) {
          label = label.split(' ')[0]
        }
        return label
      },
      day () {
        const d = moment(this.group.start)
        let label = d.format('LLLL')
        if (this.locale === 'ru') {
          label = capitalize(d.format('dddd, D MMMM YYYY'))
        }
        if (this.locale === 'en') {
          label = d.format('ddd, MMMM D, YYYY')
        }
        if (d.year() === (new Date()).getFullYear()) {
          label = label
            .replace(/, \d{4}/, '')
            .replace(/ \d{4}/, '')
        }
        return label
      },
      weekend () {
        const day = parseInt(moment(this.group.lastUpdated()).format('d'))
        return (day === 0 || day === 6)
      },
      ...mapGetters([
        'locale'
      ])
    },
    methods: {
      isTaskWithLink () {
        return this.group.type === 'task' &&
          this.group.name.match(urlRegexp)
      }
    },
    mixins: [
      i18nLabel
    ]
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .group-name

    // Layout icon + name
    .link-name
      display inline

    // Take out link from flow and cut to 1 line
    .with-link
      position relative
      padding-bottom 20px
    .link-url
      position absolute
      left 0px
      bottom 0px
      max-width 50vw
      overflow hidden
      text-overflow ellipsis
      white-space nowrap

    // Icons
    .favicon
      width 1.375em
      height 1em
      display inline-block
      vertical-align top
      background-position left center
      background-size contain
      background-repeat no-repeat
      position relative
      top 0.125em
      &.undefined
        display none
      &.github
        background-image url('~@/assets/images/github.svg')
      &.basecamp
        background-image url('~@/assets/images/basecamp.svg')
      &.asana
        background-image url('~@/assets/images/asana.png')
      &.trello
        background-image url('~@/assets/images/trello.svg')
      &.bitbucket
        background-image url('~@/assets/images/bitbucket.svg')
      &.atlassian
        background-image url('~@/assets/images/atlassian.svg')

    // Small stylings
    .link-url
      color titamota-color-text-muted
      font-size 80%
      font-weight 400
</style>
