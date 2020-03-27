const Axios = require('axios')

module.exports = class AccuWeather {
  /**
   * AccuWeather
   * @param {object} options 初始化参数
   * @param {string} options.apiKey ApiKey
   * @param {string} options.locationKey 城市ID
   * @param {string} [params.language] 语言，默认为 zh-CN. https://developer.accuweather.com/localizations-by-language
   * @param {string|object} [params.proxy] 代理配置
   * @param {number} [parms.timeout] 超时时间，单位为毫秒，默认5000
   */
  constructor({ apiKey, locationKey, language = 'zh-CN', proxy, timeout = 5 * 1000 }) {
    if (!apiKey) {
      throw new Error(`[AccuWeather] 参数apiKey不能为空`)
    }

    if (!locationKey) {
      throw new Error(`[AccuWeather] 参数locationKey不能为空`)
    }

    this.locationKey = locationKey

    let instance = Axios.create({
      baseURL: 'http://api.accuweather.com/',
      timeout,
    })

    // 使用实例拦截器添加必须的URLSearchParams
    instance.interceptors.request.use((config) => {
      config.proxy = proxy
      config.params = {
        language: language,
        metric: true,
        apiKey,
        details: true,
      }
      return config
    })

    this.axios = instance
  }

  /**
   * 获取当前位置的基本天气信息
   */
  async currentconditions() {
    let { data } = await this.axios.get(`currentconditions/v1/${this.locationKey}.json`)
    return data
  }

  /**
   * 获取days天数的天气预报信息
   * @param {number}} days 天数，支持3/5/7
   */
  async forecasts(days = 5) {
    let num = [3, 5, 7].includes(days) ? days : 5
    let { data } = await this.axios.get(`forecasts/v1/daily/${num}day/${this.locationKey}`)
    return data
  }

  /**
   * 通过城市ID获取当前的位置信息
   */
  async locations() {
    let { data } = await this.axios.get(`locations/v1/${this.locationKey}`)
    return data
  }

  /**
   * 获取天气预警信息
   */
  async alerts() {
    let { data } = await this.axios.get(`alerts/v1/${this.locationKey}`)
    return data
  }
}
