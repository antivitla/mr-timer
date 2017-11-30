<template lang="pug">
  .settings-migration
    p.note(v-if="isContext")
      small
        | {{ label('settings.warningContext') }} &ensp;
        q {{ parseDetail(contextString) }}
    //- Timer 3.0 account
    p(v-if="countEntries.timer30")
      button.block.with-preloader(
        :disabled="waitingMigrate.timer30"
        :preloader="waitingMigrate.timer30"
        @click="migrate('timer30')")
        div
          i.fa.fa-refresh
          span  {{ label('settings.doImport') }}
          strong  {{ labelNumberOfEntries(countEntries.timer30) }}
        small {{ label('settings.timer30local') }}

    //- Timer 3.1 account
    p(v-if="countEntries.timer31 && isAuthorized")
      button.block.with-preloader(
        :disabled="waitingMigrate.timer31"
        :preloader="waitingMigrate.timer31"
        @click="migrate('timer31')")
        div
          i.fa.fa-refresh
          span  {{ label('settings.doImport') }}
          strong  {{ labelNumberOfEntries(countEntries.timer31) }}
        small {{ label('settings.timer31local') }}

    //- Petrov account
    p.input-group.vertical
      input(
        type="text"
        v-model="petrovAccount"
        :placeholder="label('settings.migrateAccountPlaceholder')")
      button.with-preloader(
        @click="migrate('petrov')"
        :disabled="Boolean(!petrovAccount || !countEntries.petrovAccount || waitingMigrate.petrov)"
        :preloader="waitingMigrate.petrov")
        div(v-if="!petrovAccount")
          span {{ label('settings.emptyAccountTitle') }}
        div(v-if="petrovAccount && !countEntries.petrovAccount")
          span {{ label('settings.entriesNotFound') }}
        div(v-if="countEntries.petrovAccount")
          i.fa.fa-refresh
          span  {{ label('settings.doImport') }}
          strong  {{ labelNumberOfEntries(countEntries.petrovAccount) }}
        small {{ label('settings.server') }} <q>Petrov</q> 1.0
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { taskDelimiter } from '@/store/ui'
  import debounce from 'debounce'
  import migration from '@/mixins/migration'
  import i18nLabel from '@/mixins/i18n-label'
  import bus from '@/event-bus'
  import parseDetail from '@/utils/parseDetail'

  export default {
    data () {
      return {
        countEntries: {
          timer30: 0,
          timer31: 0,
          petrovAccount: 0
        },
        petrovAccount: '',
        waitingMigrate: {
          timer30: false,
          timer31: false,
          petrov: false
        },
        entries: {
          timer30: [],
          timer31: [],
          petrov: []
        },
        parseDetail
      }
    },
    created () {
      // Timerwood-Log Local Entries
      this.getEntriesFromLocalStorage('Timerwood-Log')
        .then(entries => {
          this.entries.timer30 = entries
          this.countEntries.timer30 = entries.length
        })
        .catch(error => {
          let content = error.message
          let type
          if (error.message === '404') {
            content = 'Timer 3.0 local entries not found'
            console.warn(content)
          }
          if (error.message === '500') {
            content = 'Timer 3.0 local entries are broken'
            type = 'error'
            console.warn(content)
          }
          bus.$emit('toast', { content, type })
        })
      // Titomata Local Entries
      this.getEntriesFromLocalStorage('titamota-entries-local')
        .then(entries => {
          this.entries.timer31 = entries
          this.countEntries.timer31 = entries.length
        })
        .catch(error => {
          let content = error.message
          let type
          if (error.message === '404') {
            content = 'Timer 3.1 local entries not found'
            console.warn(content)
          }
          if (error.message === '500') {
            content = 'Timer 3.1 entries are broken'
            type = 'error'
            console.warn(content)
          }
          bus.$emit('toast', { content, type })
        })
    },
    computed: {
      contextString () {
        return this.context.join(taskDelimiter)
      },
      ...mapGetters([
        'isAuthorized',
        'isContext',
        'context'
      ])
    },
    methods: {
      migrate (type) {
        this.waitingMigrate[type] = true
        this.migrateEntries(this.entries[type]).then(() => {
          this.waitingMigrate[type] = false
          this.closeSidebar()
        })
      },
      labelNumberOfEntries (entries) {
        return this.labelFormat('sidebar.numberOfEntries', { entries })
      },
      ...mapMutations([
        'closeSidebar'
      ])
    },
    watch: {
      'petrovAccount': debounce(function (account) {
        this.getEntriesFromPetrov(account)
          .then(entries => {
            this.entries.petrov = entries
            this.countEntries.petrovAccount = entries.length
          })
          .catch(() => {
            this.countEntries.petrovAccount = 0
          })
      }, 300)
    },
    mixins: [
      migration,
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  .settings-migration
    .note
      margin-bottom 20px
    button
    .button
      padding-left 15px
      padding-right 15px
</style>
