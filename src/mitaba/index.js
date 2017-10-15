const socialConfig = {
  facebook: {
    DIALOG_URL: 'https://www.facebook.com/v2.10/dialog/oauth',
    CLIENT_ID: '348877668894043',
    SCOPE: 'email',
    MITABA_BACKEND: 'facebook'
  },
  github: {
    DIALOG_URL: 'https://github.com/login/oauth/authorize',
    CLIENT_ID: '029f1bd3d31303085a51',
    SCOPE: 'user',
    MITABA_BACKEND: 'github'
  },
  google: {
    DIALOG_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    CLIENT_ID: '103805617597-46bfk19ot55d9n1sk8a35o9q82n6ane3.apps.googleusercontent.com',
    SCOPE: 'email profile',
    MITABA_BACKEND: 'google-oauth2'
  },
  vk: {
    DIALOG_URL: 'https://oauth.vk.com/authorize',
    CLIENT_ID: '6211554',
    SCOPE: 'email',
    MITABA_BACKEND: 'vk-oauth2'
  },
  yandex: {
    DIALOG_URL: 'https://oauth.yandex.ru/authorize',
    CLIENT_ID: '21327e57e0ec4bbe973307ebf45868f1',
    SCOPE: 'login:email login:avatar login:info',
    MITABA_BACKEND: 'yandex-oauth2'
  }
}

const apiConfig = {
  base: 'https://local.mitaba.ru/api/',
  profile: 'profile/?avatar_size=60',
  entries: 'entries/',
  social: 'login/social/token_user/'
}

class Mitaba {
  constructor () {
    this.config = {
      api: apiConfig,
      social: socialConfig
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
    }).then(r => {
      if (r.status >= 200 && r.status < 300) {
        return r.json()
      } else {
        r.text().then(message => console.log(message, r))
        throw new Error(r)
      }
    }).then(auth => {
      this.token = auth.token
      return auth
    })
  }

  getProfile () {
    return fetch(
      this._endpoint('profile'),
      this._createConfig('GET')
    ).then(r => {
      if (r.status >= 200 && r.status < 300) {
        return r.json()
      } else {
        r.text().then(message => console.log(message, r))
        throw new Error(r)
      }
    }).then(profile => {
      profile.providers = profile.providers.map(p => p.split('-')[0])
      return profile
    })
  }

  getEntries () {
    return fetch(
      this._endpoint('entries'),
      this._createConfig('GET')
    ).then(r => {
      if (r.status >= 200 && r.status < 300) {
        return r.json()
      } else {
        r.text().then(message => console.log(message, r))
        throw new Error(r)
      }
    })
  }

  postEntries (entries) {
    const config = this._createConfig('POST')
    config.body = JSON.stringify(entries)
    return fetch(
      this._endpoint('entries'),
      config
    ).then(r => {
      if (r.status >= 200 && r.status < 300) {
        return r.json()
      } else {
        r.text().then(message => console.log(message, r))
        throw new Error(r)
      }
    })
  }

  patchEntries (entries) {
    const config = this._createConfig('PATCH')
    config.body = JSON.stringify(entries)
    return fetch(
      this._endpoint('entries'),
      config
    ).then(r => {
      if (r.status >= 200 && r.status < 300) {
        return r.json()
      } else {
        r.text().then(message => console.log(message, r))
        throw new Error(r)
      }
    })
  }

  deleteEntries (entries) {
    const config = this._createConfig('DELETE')
    config.body = JSON.stringify(entries)
    return fetch(
      this._endpoint('entries'),
      config
    ).then(r => {
      if (r.status >= 200 && r.status < 300) {
        return 'Deleted successfully'
      } else {
        r.text().then(message => console.log(message, r))
        throw new Error(r)
      }
    })
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
    return `${location.protocol}//${location.host}/${provider}-auth-redirect`
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
