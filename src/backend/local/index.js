class LocalBackendDriver {
  getEntries () {
    return new Promise((resolve, reject) => {
      resolve('Zak')
    })
  }
}
export default new LocalBackendDriver()
