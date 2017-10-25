<template lang="pug">
  div.api-debug
    h2 Petrov API
    p.url
      span.method {{method}}
      input(
        type="text"
        v-bind:class="{error: !account}"
        @keyup.13="send()"
        v-model.trim="account"
        placeholder="код аккаунта")

    p.send
      button(
        v-for="method in methods"
        @click="send(method.name)"
        v-bind:class="isLastMethod(method.name)"
        v-bind:disabled="isDisabled") {{method.name}}

    p.response(v-bind:class="{error: !status}" v-if="response")
      pre {{response}}
</template>

<script>
  import Petrov from '@/petrov'

  const methods = [
    { name: 'GET' },
    { name: 'POST' },
    { name: 'PUT' },
    { name: 'DELETE' }
  ]

  export default {
    name: 'petrov',
    data () {
      return {
        url: Petrov.baseUrl,
        account: '',
        methods,
        method: 'GET',
        response: '',
        status: true,
        waiting: false
      }
    },
    computed: {
      isDisabled () {
        return this.waiting || !this.account
      }
    },
    methods: {
      send (method) {
        this.method = method || this.method
        this.waiting = true
        Petrov[this.method.toLowerCase()](this.account)
          .then(data => {
            this.response = data
            this.status = true
            this.waiting = false
          })
          .catch(error => {
            this.response = error.message
            this.status = false
            this.waiting = false
          })
      },
      isLastMethod (method) {
        return {
          active: this.method === method
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/api'
</style>
