<template lang="pug">
  section.api-debug
    h2 Mitaba API
    p
      button(@click="getEndpointByName('Profile')")
        small
          span GET
          strong  /profile
      span &emsp;
      button(@click="getEndpointByName('Entries')")
        small
          span GET
          strong  /entries

    p
      button.primary(@click="createEntry()") Создать запись

    p
      pre {{ entries }}

    p
      button(@click="sendApiRequest('post', 'Entries')")
        small
          span POST
          strong  /entries
      span &emsp;
      button(@click="sendApiRequest('patch', 'Entries')")
        small
          span PATCH
          strong  /entries
      span &emsp;
      button(@click="sendApiRequest('delete', 'Entries')")
        small
          span DELETE
          strong  /entries
    p
      pre {{ response }}

</template>

<script>
  import Mitaba from '@/backend/mitaba'
  import { mapGetters } from 'vuex'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  export default {
    name: 'mitaba',

    data () {
      return {
        response: {},
        path: 'profile',
        entries: []
      }
    },

    computed: {
      ...mapGetters([
        'locale'
      ])
    },

    methods: {
      getEndpointByName (name) {
        Mitaba[`get${name}`]().then(response => {
          this.response = response
          console.log(response)
        }).catch(error => {
          this.response = `${JSON.stringify(error, null, '  ')}`
        })
      },

      sendApiRequest (method, name, params = {}) {
        if (method === 'post') {
          params = this.entries
        }
        if (method === 'patch') {
          params = [this.randomEntry(), this.randomEntry()]
          console.log(Math.floor(Math.random() * this.entries.length))
          params[0].id = this.response[Math.floor(Math.random() * this.response.length)].id
          params[1].id = this.response[Math.floor(Math.random() * this.response.length)].id
        }
        if (method === 'delete') {
          params = [
            {id: this.response[Math.floor(Math.random() * this.response.length)].id},
            {id: this.response[Math.floor(Math.random() * this.response.length)].id}
          ]
        }
        Mitaba[`${method}${name}`](params).then(response => {
          this.response = response
          console.log('Успех', response, '.')
        }).catch(error => {
          this.response = `${JSON.stringify(error, null, '  ')}`
        })
      },

      createEntry () {
        this.entries.push(this.randomEntry())
      },

      clearEntries () {
        this.entries = []
      },

      randomEntry () {
        const nest = Math.ceil(Math.random() * 3 + 1)
        const details = []
        for (let i = 0; i < nest; i = i + 1) {
          details.push(funnyTask(this.locale))
        }
        return {
          start: new Date(),
          stop: new Date(),
          details
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/core'
  @import '~@/assets/stylesheets/api'
</style>
