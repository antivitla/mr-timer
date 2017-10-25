<template lang="pug">
  .settings-migration
    //- Timer 3.0 account
    p(v-if="countEntries.timer30")
      button.block.with-preloader(
        :disabled="waitingMigrate.timer30"
        :preloader="waitingMigrate.timer30"
        @click="migrate('timer30')")
        div
          i.fa.fa-refresh
          |  Импортировать
          strong  {{ labelNumberOfEntries(countEntries.timer30) }}
        small Таймер 3.0, локальный аккаунт

    //- Timer 3.1 account
    p(v-if="countEntries.timer31 && isAuthorized")
      button.block.with-preloader(
        :disabled="waitingMigrate.timer31"
        :preloader="waitingMigrate.timer31"
        @click="migrate('timer31')")
        div
          i.fa.fa-refresh
          |  Импортировать
          strong  {{ labelNumberOfEntries(countEntries.timer31) }}
        small Таймер 3.1, локальный аккаунт

    //- Petrov account
    p.input-group.vertical
      input(
        type="text"
        v-model="petrovAccount"
        placeholder="Имя онлайн-аккаунта для импорта")
      button.with-preloader(
        @click="migrate('petrov')"
        :disabled="Boolean(!petrovAccount || !countEntries.petrovAccount || waitingMigrate.petrov)"
        :preloader="waitingMigrate.petrov")
        div(v-if="!petrovAccount")
          | Не введено имя аккаунта
        div(v-if="petrovAccount && !countEntries.petrovAccount")
          | Не найдено записей
        div(v-if="countEntries.petrovAccount")
          i.fa.fa-refresh
          |  Импортировать
          strong  {{ labelNumberOfEntries(countEntries.petrovAccount) }}
        small Сервер <q>Petrov</q> 1.0
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import debounce from 'debounce'
  import migration from '@/mixins/migration'
  import i18nLabel from '@/mixins/i18n-label'

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
        }
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
          if (error.message === '404') {
            console.warn('Не найдены записи для таймера 3.0')
          }
          if (error.message === '500') {
            console.warn('Записи для таймера 3.0 кажется сломаны')
          }
        })
      // Titomata Local Entries
      this.getEntriesFromLocalStorage('titamota-entries-local')
        .then(entries => {
          this.entries.timer31 = entries
          this.countEntries.timer31 = entries.length
        })
        .catch(error => {
          if (error.message === '404') {
            console.warn('Не найдены записи для таймера 3.1')
          }
          if (error.message === '500') {
            console.warn('Записи для таймера 3.1 кажется сломаны')
          }
        })
    },
    computed: {
      ...mapGetters([
        'isAuthorized'
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
    button
    .button
      padding-left 15px
      padding-right 15px
</style>
