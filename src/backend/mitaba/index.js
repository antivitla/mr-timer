import Entry from '@/models/entry'
import { parseHttpResponse } from '@/utils/http'

function isDev () {
  return Boolean(window.location.host.match(/local\./))
}

const socialConfigDev = {
  facebook: {
    CLIENT_ID: '348877668894043'
  },
  github: {
    CLIENT_ID: '029f1bd3d31303085a51'
  },
  google: {
    CLIENT_ID: '103805617597-46bfk19ot55d9n1sk8a35o9q82n6ane3.apps.googleusercontent.com'
  },
  vk: {
    CLIENT_ID: '6211554'
  },
  yandex: {
    CLIENT_ID: '21327e57e0ec4bbe973307ebf45868f1'
  }
}

const socialConfig = {
  facebook: {
    DIALOG_URL: 'https://www.facebook.com/v2.10/dialog/oauth',
    CLIENT_ID: '498893767146355',
    SCOPE: 'email',
    MITABA_BACKEND: 'facebook'
  },
  github: {
    DIALOG_URL: 'https://github.com/login/oauth/authorize',
    CLIENT_ID: '7e7836a99b75e6815c8c',
    SCOPE: 'user',
    MITABA_BACKEND: 'github'
  },
  google: {
    DIALOG_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    CLIENT_ID: '103805617597-m4tl2sqlaqm2s8p9n2cdgtpj5g6d855q.apps.googleusercontent.com',
    SCOPE: 'email profile',
    MITABA_BACKEND: 'google-oauth2'
  },
  vk: {
    DIALOG_URL: 'https://oauth.vk.com/authorize',
    CLIENT_ID: '6222900',
    SCOPE: 'email',
    MITABA_BACKEND: 'vk-oauth2'
  },
  yandex: {
    DIALOG_URL: 'https://oauth.yandex.ru/authorize',
    CLIENT_ID: 'b3baf69227354f67a3ce5454bfaf37ef',
    SCOPE: 'login:email login:avatar login:info',
    MITABA_BACKEND: 'yandex-oauth2'
  }
}

const apiConfigDev = {
  base: `https://local.mitaba.ru/api/`
}

const apiConfig = {
  base: `https://mitaba.ru/api/`,
  profile: 'profile/?avatar_size=120',
  entries: 'entries/',
  petrov: 'petrov/?account=',
  social: 'login/social/token_user/'
}

class Mitaba {
  constructor () {
    this.config = {
      api: Object.assign({}, apiConfig, (isDev() ? apiConfigDev : {})),
      social: Object.assign({}, socialConfig, (isDev() ? socialConfigDev : {}))
    }
    this.token = null
  }

  authorizeWithProvider (provider) {
    window.open(this._createProviderAuthDialogUrl(provider), '_self')
  }

  authorize ({ provider, code } = {}) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json; charset=UTF-8')
    const body = JSON.stringify({
      code,
      provider: this.config.social[provider].MITABA_BACKEND,
      redirect_uri: this._createProviderAuthRedirectUrl(provider)
    })
    return fetch(this._endpoint('social'), {
      method: 'POST',
      mode: 'cors',
      headers,
      body
    }).then(parseHttpResponse).then(auth => {
      // Сохраняем себе токен
      this.token = auth.token
      return auth
    })
  }

  getProfile () {
    const config = this._createConfig('GET')
    return fetch(this._endpoint('profile'), config)
      .then(parseHttpResponse)
      .then(profile => {
        // Очеловечиваем список провайдеров
        profile.providers = profile.providers.map(p => p.split('-')[0])
        return profile
      })
  }

  getEntries () {
    const config = this._createConfig('GET')
    return fetch(this._endpoint('entries'), config)
      .then(parseHttpResponse)
      .then(entries => {
        // Возвращаем готовые Entry-объекты
        return entries.map(e => new Entry(e))
      })
  }

  getPetrov (account) {
    const config = this._createConfig('GET')
    return fetch(`${this._endpoint('petrov')}${account}`, config)
      .then(parseHttpResponse)
  }

  postEntries (entries) {
    const config = this._createConfig('POST')
    config.body = JSON.stringify(entries)
    return fetch(this._endpoint('entries'), config)
      .then(parseHttpResponse)
      .then(entries => {
        // Возвращаем готовые Entry-объекты
        return entries.map(e => new Entry(e))
      })
  }

  patchEntries (entries) {
    const config = this._createConfig('PATCH')
    config.body = JSON.stringify(entries)
    return fetch(this._endpoint('entries'), config)
      .then(parseHttpResponse)
  }

  deleteEntries (entries) {
    const config = this._createConfig('DELETE')
    config.body = JSON.stringify(entries)
    return fetch(this._endpoint('entries'), config)
      .then(parseHttpResponse)
  }

  _endpoint (name) {
    return `${this.config.api.base}${this.config.api[name]}`
  }

  _createConfig (method = 'GET') {
    if (!this.token) {
      throw new Error('А токена-то нету! Без него с API не поработать')
    }
    const headers = new Headers()
    headers.append('Content-Type', 'application/json; charset=UTF-8')
    headers.append('Authorization', `Token ${this.token}`)
    return {
      method: method.toUpperCase(),
      mode: 'cors',
      credentials: 'include',
      headers
    }
  }

  _createProviderAuthRedirectUrl (provider) {
    return `${location.protocol}//${location.host}${isDev() ? '/' : '/titamota/'}${provider}-auth-redirect`
  }

  _createProviderAuthDialogUrl (provider) {
    const dialogParams = {
      client_id: this.config.social[provider].CLIENT_ID,
      redirect_uri: this._createProviderAuthRedirectUrl(provider),
      response_type: 'code',
      scope: this.config.social[provider].SCOPE
    }
    const urlParams = Object.keys(dialogParams)
      .map(k => `${k}=${dialogParams[k]}`)
      .join('&')
    return `${this.config.social[provider].DIALOG_URL}?${urlParams}`
  }
}

export default new Mitaba()
