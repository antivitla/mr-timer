<template>
  <div class="petrov">
    <p>{{url}}</p>
    <p>
      <input type="text" :placeholder="placeholder">
    </p>
    <p>get</p>
    <p>post</p>
    <p>put</p>
    <p>delete</p>
    <p>response</p>
  </div>
</template>

<script>
import Petrov from '@/petrov'

export default {
  name: 'petrov',
  data () {
    return {
      url: Petrov.baseUrl,
      account: '',
      placeholder: 'Введите код аккаунта'
    }
  }
}
</script>
