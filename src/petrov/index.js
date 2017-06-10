import axios from 'axios'
import qs from 'qs'

class Petrov {
  constructor () {
    this.baseUrl = 'http://82.196.2.175:8062/timer'
    this.resource = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      transformRequest: [function (data) {
        const transformed = qs.stringify({data: JSON.stringify(data)})
        return transformed
      }]
    })
  }

  get (accountCode) {
    return this.resource
      .get(this.endpoint(accountCode))
      .then(res => {
        console.log('petrov get', accountCode, res.data.status)
        if (!res.data.status) {
          throw new Error(`Account '${accountCode}' error: ${res.data.error}`)
        }
        return res.data
      })
  }

  post (accountCode, data = '') {
    return this.resource
      .post(this.endpoint(accountCode), data)
      .then(res => {
        console.log('petrov post', accountCode, res.data.status)
        if (!res.data.status) {
          throw new Error(`Account '${accountCode}' error: ${res.data.error}`)
        }
        return res.data
      })
  }

  put (accountCode, data = '') {
    return this.resource
      .put(this.endpoint(accountCode), data)
      .then(res => {
        console.log('petrov put', accountCode, res.data.status)
        if (!res.data.status) {
          console.log('put', res.data)
          throw new Error(`Account '${accountCode}' error: ${res.data.error}`)
        }
        return res.data
      })
  }

  delete (accountCode) {
    return this.resource
      .delete(this.endpoint(accountCode))
      .then(res => {
        console.log('petrov delete', accountCode, res.data.status)
        if (!res.data.status) {
          throw new Error(`Account '${accountCode}' error: ${res.data.error}`)
        }
        return res.data
      })
  }

  endpoint (accountCode) {
    return `${this.baseUrl}/${encodeURIComponent(accountCode)}/`
  }
}

export default new Petrov()
