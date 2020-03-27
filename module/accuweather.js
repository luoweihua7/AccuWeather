const axios = require('axios')
const qs = require('querystring')

module.exports = class AccuWeather {
  /**
   * AccuWeather
   * @param {object} options Initialize options
   * @param {string} options.apiKey Accuweather ApiKey
   * @param {string} [options.locationKey] City weather id
   * @param {string} [params.language] Language of weather. https://developer.accuweather.com/localizations-by-language
   * @param {boolean} [parms.metric] Boolean value (true or false) that specifies to return the data in either metric (=true) or imperial units.
   * @param {string|object} [params.proxy] Proxy config
   * @param {number} [parms.timeout] Request timeout delay. default 30s
   */
  constructor(options) {
    this.baseUrl = `http://api.accuweather.com/`
    this.options = { language: 'zh-CN', metric: true, ...options, details: true }
  }

  async request(url, params) {
    let { apiKey, language, details, metric, proxy, timeout = 30 * 1000 } = this.options
    let query = { apiKey, language, details, metric, ...params.query }
    let finalUrl = url + (url.includes('?') ? '&' : '?') + qs.stringify(query)
    let { data } = await axios.get(finalUrl, { proxy, timeout })

    return data
  }

  getLocationKey(params = {}) {
    if (!this.options.locationKey && !params.locationKey) {
      throw new Error(`Parameter "locationKey" require!`)
    }

    return this.options.locationKey || params.locationKey
  }

  generateUrl(pathname) {
    return this.baseUrl + pathname
  }

  async currentconditions(params = {}) {
    let locationKey = this.getLocationKey(params)
    let url = this.generateUrl(`currentconditions/v1/${locationKey}.json`)

    return await this.request(url, params)
  }

  async forecast(params = {}) {
    let locationKey = this.getLocationKey(params)
    let { type = 'daily', day = '1day' } = params
    let url = this.generateUrl(`forecasts/v1/${type}/${day}/${locationKey}?metric=true`)

    return await this.request(url, params)
  }

  async alerts(params = {}) {
    let locationKey = this.getLocationKey(params)
    let url = this.generateUrl(`alerts/v1/${locationKey}`)

    return await this.request(url, params)
  }

  async locations(params = {}) {
    let locationKey = this.getLocationKey(params)
    let url = this.generateUrl(`locations/v1/${locationKey}`)

    return await this.request(url, params)
  }
}
