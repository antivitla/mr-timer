import deepAssign from 'deep-assign'
import Entry from '@/models/entry'
import axios from 'axios'
import qs from 'qs'

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
  petrov: 'petrov/',
  social: 'login/social/token_user/'
}

class Mitaba {
  constructor () {
    this.config = {
      api: deepAssign({}, apiConfig, (isDev() ? apiConfigDev : {})),
      social: deepAssign({}, socialConfig, (isDev() ? socialConfigDev : {}))
    }
    this.token = null
    this.resource = axios.create({
      baseURL: this.config.api.base,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  }

  authorizeWithProvider (provider) {
    window.open(this._createProviderAuthDialogUrl(provider), '_self')
  }

  authorize ({ provider, code } = {}) {
    return this.resource
      .post(this.config.api.social, {
        redirect_uri: this._createProviderAuthRedirectUrl(provider),
        provider,
        code
      }, {
        withCredentials: true
      })
      .then(this._parseSuccessResponse)
      .then(auth => {
        // Сохраняем себе токен
        this.token = auth.token
        return auth
      })
      .catch(error => {
        console.warn(error)
      })
  }

  getProfile () {
    return this.resource
      .get(this.config.api.profile, this._protectedConfig())
      .then(this._parseSuccessResponse)
      .then(profile => {
        // Очеловечиваем список провайдеров
        profile.providers = profile.providers.map(p => p.split('-')[0])
        return profile
      })
      .catch(error => {
        console.warn(error)
      })
  }

  getEntries ({ params = {} }) {
    return this.resource
      .get(this.config.api.entries, this._protectedConfig({ params }))
      .then(this._parseSuccessResponse)
  }

  getPetrov (account) {
    return this.resource
      .get(this.config.api.petrov, {params: { account }})
      .then(this._parseSuccessResponse)
  }

  postEntries (entries) {
    return this.resource
      .post(this.config.api.entries, entries, this._protectedConfig())
      .then(this._parseEntries)
  }

  patchEntries (entries) {
    return this.resource
      .patch(this.config.api.entries, entries, this._protectedConfig())
      .then(this._parseEntries)
  }

  deleteEntries (entries) {
    return this.resource
      .delete(this.config.api.entries, this._protectedConfig({data: entries}))
  }

  _protectedConfig (config) {
    if (!this.token) {
      throw new Error('А токена-то нету! Без него с API не поработать')
    }
    return Object.assign({
      headers: {
        'Authorization': `Token ${this.token}`
      },
      withCredentials: true
    }, config)
  }

  _parseSuccessResponse (response) {
    return response.data
  }

  _parseEntries (response) {
    return response.data.map(e => new Entry(e))
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
    return `${this.config.social[provider].DIALOG_URL}?${qs.stringify(dialogParams)}`
  }
}

export default new Mitaba()
